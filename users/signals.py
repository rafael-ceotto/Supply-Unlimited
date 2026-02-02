"""
Django signals for automatic notification generation.

This module defines signals that automatically create notifications
when certain events occur in the application (e.g., new AI reports).
"""

import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

logger = logging.getLogger(__name__)


# Import models here to avoid circular imports
# These are imported inside the signal handlers


@receiver(post_save, sender='ai_reports.ChatMessage')
def create_notification_on_ai_report(sender, instance, created, **kwargs):
    """
    Auto-create notification when a new AI report message is generated.
    
    Triggered when a ChatMessage is created in ai_reports app.
    Creates a notification for the user who requested the report.
    
    Args:
        sender: The model class (ChatMessage)
        instance: The ChatMessage instance that was saved
        created: Boolean indicating if instance was just created
        **kwargs: Additional signal parameters
    """
    if not created:
        return  # Only process on creation, not updates
    
    try:
        # Import here to avoid circular imports
        from ai_reports.models import ChatMessage
        from users.models import Notification
        from users.consumers import send_notification_to_user
        
        # Get the chat session to identify the user
        chat_session = instance.chat_session
        user = chat_session.user
        
        # Determine notification type based on message content
        notification_type = 'report_ready'
        title = f"AI Report Ready - {chat_session.agent.name}"
        message = f"Your {chat_session.agent.name} report has been generated successfully."
        
        # Create notification in database
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            related_object_type='ChatMessage',
            related_object_id=instance.id,
            redirect_url=f'/reports/#report-{chat_session.id}'
        )
        
        # Send real-time notification via WebSocket
        try:
            async_to_sync(send_notification_to_user)(
                user_id=user.id,
                notification_data={
                    'notification_id': notification.id,
                    'title': notification.title,
                    'message': notification.message,
                    'notification_type': notification.notification_type,
                    'is_read': notification.is_read,
                    'created_at': notification.created_at.isoformat(),
                    'redirect_url': notification.redirect_url,
                }
            )
            logger.info(f"Real-time notification sent to user {user.username}")
        except Exception as e:
            logger.error(f"Failed to send real-time notification: {e}")
        
        logger.info(f"Created notification for user {user.username}: {title}")
        
    except Exception as e:
        logger.error(f"Error creating notification on AI report: {e}")


@receiver(post_save, sender='auth.User')
def create_notification_on_role_change(sender, instance, created, **kwargs):
    """
    Auto-create notification when a user's role is changed.
    
    Triggered when a User is updated.
    Notifies the user if their role has been changed by an admin.
    
    Args:
        sender: The User model class
        instance: The User instance that was saved
        created: Boolean indicating if instance was just created
        **kwargs: Additional signal parameters
    """
    if created:
        return  # Only process updates, not creation
    
    try:
        # Import here to avoid circular imports
        from users.models import Notification, UserRole
        from users.consumers import send_notification_to_user
        
        # Check if this user has a role assigned
        try:
            user_role = UserRole.objects.get(user=instance)
            
            # Create notification about role
            notification = Notification.objects.create(
                user=instance,
                title="Your Role Has Been Updated",
                message=f"Your role is now: {user_role.role.name}",
                notification_type='role_changed',
                related_object_type='UserRole',
                related_object_id=user_role.id,
                redirect_url='/dashboard/'
            )
            
            # Send real-time notification
            try:
                async_to_sync(send_notification_to_user)(
                    user_id=instance.id,
                    notification_data={
                        'notification_id': notification.id,
                        'title': notification.title,
                        'message': notification.message,
                        'notification_type': notification.notification_type,
                        'is_read': notification.is_read,
                        'created_at': notification.created_at.isoformat(),
                        'redirect_url': notification.redirect_url,
                    }
                )
            except Exception as e:
                logger.error(f"Failed to send role change notification: {e}")
            
            logger.info(f"Created role change notification for user {instance.username}")
        except UserRole.DoesNotExist:
            pass  # User has no role yet
            
    except Exception as e:
        logger.error(f"Error creating notification on role change: {e}")


@receiver(post_save, sender='users.AuditLog')
def create_notification_on_permission_violation(sender, instance, created, **kwargs):
    """
    Auto-create notification when a user attempts a permission-denied action.
    
    Triggered when an AuditLog is created.
    Notifies admins of failed permission checks.
    
    Args:
        sender: The AuditLog model class
        instance: The AuditLog instance that was saved
        created: Boolean indicating if instance was just created
        **kwargs: Additional signal parameters
    """
    if not created:
        return  # Only process on creation
    
    # Only create notification for failed permission checks
    if instance.action != 'permission_denied':
        return
    
    try:
        # Import here to avoid circular imports
        from users.models import Notification, Role
        from users.consumers import send_notification_to_user
        from django.contrib.auth.models import User
        
        # Get all admin users
        try:
            admin_role = Role.objects.get(name='Admin')
            admin_users = User.objects.filter(userrole__role=admin_role)
            
            for admin in admin_users:
                notification = Notification.objects.create(
                    user=admin,
                    title="Permission Violation Detected",
                    message=f"User {instance.user.username} attempted unauthorized action: {instance.details}",
                    notification_type='permission_denied',
                    related_object_type='AuditLog',
                    related_object_id=instance.id,
                    redirect_url='/admin/users/auditlog/'
                )
                
                # Send real-time notification
                try:
                    async_to_sync(send_notification_to_user)(
                        user_id=admin.id,
                        notification_data={
                            'notification_id': notification.id,
                            'title': notification.title,
                            'message': notification.message,
                            'notification_type': notification.notification_type,
                            'is_read': notification.is_read,
                            'created_at': notification.created_at.isoformat(),
                            'redirect_url': notification.redirect_url,
                        }
                    )
                except Exception as e:
                    logger.error(f"Failed to send permission violation notification: {e}")
        
        except Role.DoesNotExist:
            pass  # No admin role exists yet
            
    except Exception as e:
        logger.error(f"Error creating notification on permission violation: {e}")
