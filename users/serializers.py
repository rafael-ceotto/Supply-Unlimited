"""
Serializers for RBAC models
"""

from rest_framework import serializers
from .models import Permission, Role, UserRole, AuditLog, Notification
from django.contrib.auth.models import User


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer para Permission"""
    code_display = serializers.CharField(source='get_code_display', read_only=True)
    
    class Meta:
        model = Permission
        fields = ['code', 'code_display', 'description', 'created_at']
        read_only_fields = ['created_at']


class RoleSerializer(serializers.ModelSerializer):
    """Serializer para Role com permissões aninhadas"""
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        write_only=True,
        many=True,
        source='permissions'
    )
    role_type_display = serializers.CharField(source='get_role_type_display', read_only=True)
    
    class Meta:
        model = Role
        fields = [
            'role_id', 'name', 'role_type', 'role_type_display', 'description',
            'permissions', 'permission_ids', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['role_id', 'created_at', 'updated_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer para UserRole"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    assigned_by_username = serializers.CharField(source='assigned_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = UserRole
        fields = [
            'user', 'user_username', 'user_email', 'role', 'role_name',
            'assigned_at', 'assigned_by', 'assigned_by_username', 'is_active'
        ]
        read_only_fields = ['assigned_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer para User com role"""
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active']
    
    def get_role(self, obj):
        """Get user's role"""
        try:
            user_role = obj.user_role
            return RoleSerializer(user_role.role).data
        except UserRole.DoesNotExist:
            return None


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer para AuditLog"""
    user_username = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_username', 'action', 'action_display',
            'object_type', 'object_id', 'description', 'ip_address', 'timestamp'
        ]
        read_only_fields = ['timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer para Notification"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message', 'notification_type', 'notification_type_display',
            'is_read', 'created_at', 'updated_at', 'related_object_type', 'related_object_id',
            'redirect_url'
        ]
        read_only_fields = ['created_at', 'updated_at']
