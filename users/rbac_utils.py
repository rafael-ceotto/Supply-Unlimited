"""
RBAC utilities: Decorators and permission checkers
"""

from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponseForbidden
from .models import UserRole, AuditLog


def get_user_role(user):
    """
    Get the role of a user.
    
    Args:
        user: Django User instance
        
    Returns:
        Role instance or None if user doesn't have a role
    """
    try:
        user_role = user.user_role
        if user_role.is_active:
            return user_role.role
    except UserRole.DoesNotExist:
        pass
    return None


def user_has_permission(user, permission_code):
    """
    Check if user has a specific permission.
    
    Args:
        user: Django User instance
        permission_code: Permission code string (e.g., 'view_ai_reports')
        
    Returns:
        Boolean indicating if user has permission
    """
    if user.is_superuser:
        return True
    
    try:
        user_role = user.user_role
        if user_role.is_active:
            return user_role.has_permission(permission_code)
    except UserRole.DoesNotExist:
        pass
    
    return False


def user_has_role(user, role_type):
    """
    Check if user has a specific role type.
    
    Args:
        user: Django User instance
        role_type: Role type string (e.g., 'admin', 'manager')
        
    Returns:
        Boolean indicating if user has role
    """
    role = get_user_role(user)
    if role:
        return role.role_type == role_type
    return False


def log_audit(user, action, object_type, object_id='', description='', ip_address=None):
    """
    Log an action to audit trail.
    
    Args:
        user: Django User instance (can be None)
        action: Action string (e.g., 'create', 'update', 'delete')
        object_type: Type of object being acted upon (e.g., 'ChatSession')
        object_id: ID of the object
        description: Additional description
        ip_address: IP address of the request
    """
    AuditLog.objects.create(
        user=user,
        action=action,
        object_type=object_type,
        object_id=object_id,
        description=description,
        ip_address=ip_address
    )


# ============================================
# Decorators for Views
# ============================================

def require_permission(permission_code):
    """
    Decorator to require a specific permission for a view.
    Works with both function-based and class-based views.
    
    Usage:
        @require_permission('view_ai_reports')
        def my_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user_has_permission(request.user, permission_code):
                log_audit(
                    request.user,
                    'permission_denied',
                    'View',
                    description=f'Denied access to {permission_code}'
                )
                return Response(
                    {'error': f'Permission denied: {permission_code}'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


def require_role(role_type):
    """
    Decorator to require a specific role for a view.
    
    Usage:
        @require_role('admin')
        def admin_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user_has_role(request.user, role_type):
                log_audit(
                    request.user,
                    'permission_denied',
                    'View',
                    description=f'Denied access to role-restricted view: {role_type}'
                )
                return Response(
                    {'error': f'This action requires {role_type} role'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


# ============================================
# Middleware for Audit Logging
# ============================================

class AuditLoggingMiddleware:
    """
    Middleware to log all requests to audit trail.
    Add to MIDDLEWARE in settings.py
    """
    
    EXCLUDED_PATHS = ['/admin/', '/static/', '/media/']
    LOGGED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log certain methods and paths
        if self._should_log(request):
            self._log_request(request, response)
        
        return response
    
    def _should_log(self, request):
        """Determine if request should be logged"""
        # Skip excluded paths
        for path in self.EXCLUDED_PATHS:
            if request.path.startswith(path):
                return False
        
        # Only log specific methods
        if request.method not in self.LOGGED_METHODS:
            return False
        
        return True
    
    def _log_request(self, request, response):
        """Log the request"""
        user = request.user if request.user.is_authenticated else None
        
        # Determine action from method
        action_map = {
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete',
        }
        action = action_map.get(request.method, 'update')
        
        log_audit(
            user=user,
            action=action,
            object_type=request.path,
            description=f"{request.method} {request.path}",
            ip_address=self._get_client_ip(request)
        )
    
    @staticmethod
    def _get_client_ip(request):
        """Extract client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


# ============================================
# Permission Classes for DRF
# ============================================

class HasPermission:
    """
    DRF permission class that checks for specific permission.
    
    Usage in ViewSet:
        permission_classes = [IsAuthenticated, HasPermission]
        required_permission = 'view_ai_reports'
    """
    def __init__(self, permission_code):
        self.permission_code = permission_code
    
    def has_permission(self, request, view):
        """Check if user has permission"""
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        return user_has_permission(request.user, self.permission_code)
