# Notifications System Guide

## Overview

The Supply Unlimited notifications system provides real-time notifications to users through WebSockets, combined with a database persistence layer and RESTful API. Users receive instant notifications through a bell icon in the navbar, with toast popups for important events and a dropdown panel to view all notifications.

## Architecture Components

### 1. **Backend Components**

#### Channels Configuration (`supply_unlimited/settings.py`)
```python
INSTALLED_APPS = [
    'daphne',  # ASGI server
    'channels',  # WebSocket support
    # ... other apps
]

ASGI_APPLICATION = 'supply_unlimited.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('redis', 6379)],
        },
    },
}
```

#### ASGI Application (`supply_unlimited/asgi.py`)
Configures Django Channels with ProtocolTypeRouter to handle:
- **HTTP**: Traditional Django views and DRF endpoints
- **WebSocket**: Real-time notification delivery

```python
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
```

#### WebSocket Routing (`supply_unlimited/routing.py`)
```python
websocket_urlpatterns = [
    re_path(r'ws/notification/', NotificationConsumer.as_asgi()),
]
```

#### WebSocket Consumer (`users/consumers.py`)
**NotificationConsumer** class handles:
- User authentication and connection
- Group management (per-user notification channels)
- Message broadcasting
- Keep-alive heartbeats

Key methods:
- `connect()`: Authenticate user, join notification group
- `disconnect()`: Clean up group membership
- `send_notification()`: Broadcast notification to client

Helper function:
- `send_notification_to_user(user_id, notification_data)`: Send async notification

### 2. **Database Models** (`users/models.py`)

#### Notification Model
```python
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('report_ready', 'Report Ready'),
        ('report_error', 'Report Error'),
        ('role_changed', 'Role Changed'),
        ('permission_denied', 'Permission Denied'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    redirect_url = models.URLField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def mark_as_read(self):
        self.is_read = True
        self.save()
    
    @classmethod
    def create_notification(cls, user, title, message, notification_type, **kwargs):
        """Factory method to create and return a new notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            **kwargs
        )
```

### 3. **Automatic Notification Triggering** (`users/signals.py`)

Django signals automatically create notifications for important events:

#### Signal 1: AI Report Generation
```python
@receiver(post_save, sender='ai_reports.ChatMessage')
def create_notification_on_ai_report(sender, instance, created, **kwargs):
    """Creates notification when AI report is generated"""
    # Sends real-time notification to user
```

#### Signal 2: Role Change
```python
@receiver(post_save, sender='users.User')
def create_notification_on_role_change(sender, instance, created, **kwargs):
    """Creates notification when user's role is updated"""
```

#### Signal 3: Permission Violation
```python
@receiver(post_save, sender='users.AuditLog')
def create_notification_on_permission_violation(sender, instance, created, **kwargs):
    """Notifies admins when permission-denied action is attempted"""
```

All signals:
1. Create database record (persistence)
2. Send WebSocket message (real-time)
3. Include proper error handling

### 4. **API Endpoints** (`users/urls.py`)

#### Notification API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/` | List user's notifications (paginated) |
| POST | `/api/notifications/` | Create notification (admin only) |
| GET | `/api/notifications/<id>/` | Get notification details |
| PUT | `/api/notifications/<id>/` | Update notification |
| DELETE | `/api/notifications/<id>/` | Delete notification |
| POST | `/api/notifications/<id>/mark_as_read/` | Mark single as read |
| POST | `/api/notifications/mark_all_read/` | Mark all as read |
| GET | `/api/notifications/unread_count/` | Get count of unread |
| GET | `/api/notifications/unread/` | Get all unread |

#### User Endpoint
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/current/` | Get current user's info |

### 5. **Frontend Components**

#### Notification Bell in Navbar (`templates/base.html`)
```html
<div class="notification-bell-wrapper">
  <button class="btn btn-link text-white" id="notificationBell">
    <!-- Bell icon SVG -->
  </button>
  <span class="notification-badge" id="notificationCount">5</span>
  
  <div class="notification-panel" id="notificationPanel">
    <!-- Notification list -->
  </div>
</div>
```

#### Notification Styling (`static/css/notifications.css`)
- Bell icon with unread count badge
- Dropdown panel with scrollable list
- Color-coded notification types
- Responsive design for mobile

#### Notification Manager (`static/js/notifications.js`)
**NotificationManager** class provides:

**Initialization**
```javascript
const manager = new NotificationManager();
```

**Key Features**
- WebSocket connection with auto-reconnect (exponential backoff)
- Fallback to polling if WebSocket unavailable
- Keep-alive heartbeats (every 30s)
- Toastr integration for popup notifications

**Public Methods**
```javascript
// Load notifications from API
manager.loadNotifications()

// Mark single notification as read
manager.markAsRead(notificationId)

// Mark all notifications as read
manager.markAllAsRead()

// Refresh unread count
manager.refreshNotificationCount()

// Handle incoming WebSocket message
manager.handleMessage(data)
```

**Configuration**
```javascript
// Toastr options
toastr.options = {
    timeOut: 5000,
    positionClass: 'toast-top-right',
    progressBar: true,
    closeButton: true
}
```

## WebSocket Connection Flow

```
Client Browser
    ↓
[Open WebSocket] → ws://localhost/ws/notification/
    ↓
[NotificationConsumer.connect()]
    ├─ Authenticate user (from scope)
    ├─ Create unique group name: notifications_{user_id}
    ├─ Join channel group
    └─ Accept connection
    ↓
[Keep alive: Client sends ping every 30s]
    ↓
[Server broadcasts notification]
    ├─ Signal triggers (e.g., AI report created)
    ├─ Create Notification in database
    ├─ Call send_notification_to_user(user_id, data)
    ├─ group_send() broadcasts to all user's connections
    ├─ NotificationConsumer.send_notification() called
    └─ Message sent to client via WebSocket
    ↓
[Client receives in notifications.js]
    ├─ handleMessage(data)
    ├─ addNotification(data)
    ├─ showToastNotification(data) - Toastr popup
    └─ renderNotifications() - Update UI
    ↓
[Disconnect]
    └─ [NotificationConsumer.disconnect()]
        ├─ Remove from group
        └─ Clean up
```

## Usage Examples

### Creating a Notification Programmatically

#### From Django Views
```python
from users.models import Notification
from users.consumers import send_notification_to_user
from asgiref.sync import async_to_sync

# Create database record
notification = Notification.create_notification(
    user=request.user,
    title="Processing Complete",
    message="Your data export is ready",
    notification_type='success',
    redirect_url='/exports/123/',
    related_object_type='Export',
    related_object_id=123
)

# Send real-time notification
try:
    async_to_sync(send_notification_to_user)(
        user_id=request.user.id,
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
    logger.error(f"Failed to send notification: {e}")
```

#### In Signal Handlers
```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import Notification
from users.consumers import send_notification_to_user
from asgiref.sync import async_to_sync

@receiver(post_save, sender=MyModel)
def notify_on_event(sender, instance, created, **kwargs):
    if not created:
        return
    
    notification = Notification.create_notification(
        user=instance.owner,
        title="Your Event Occurred",
        message=f"Event: {instance.name}",
        notification_type='info',
        related_object_type='MyModel',
        related_object_id=instance.id,
    )
    
    # Send real-time
    async_to_sync(send_notification_to_user)(
        user_id=instance.owner.id,
        notification_data={
            'notification_id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'notification_type': notification.notification_type,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat(),
            'redirect_url': None,
        }
    )
```

### Frontend JavaScript Usage

#### Connect and Listen
```javascript
// Automatically initialized when DOM loads
// Access via: window.notificationManager

// Mark notification as read
window.notificationManager.markAsRead(notificationId);

// Load all notifications
window.notificationManager.loadNotifications();

// Check unread count
window.notificationManager.refreshNotificationCount();
```

#### WebSocket Events
The notification manager listens for events with type field:
```javascript
// Notification event (auto-handled)
{
    type: 'notification',
    notification_id: 123,
    title: 'Report Ready',
    message: 'Your report has been generated',
    notification_type: 'report_ready',
    is_read: false,
    created_at: '2024-01-30T15:30:00Z',
    redirect_url: '/reports/123/'
}

// Keep-alive pong (auto-handled)
{
    type: 'pong'
}
```

## Notification Types

### Predefined Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `info` | ℹ | Blue | General information |
| `success` | ✓ | Green | Operation successful |
| `warning` | ⚠ | Yellow | Warning message |
| `error` | ✕ | Red | Error occurred |
| `report_ready` | 📊 | Cyan | AI report generated |
| `report_error` | ⚠ | Orange | Report generation failed |
| `role_changed` | 👤 | Purple | User role updated |
| `permission_denied` | 🔒 | Orange | Access denied (admin alert) |

### Adding New Notification Types

1. **Update Model** (`users/models.py`):
```python
NOTIFICATION_TYPES = [
    # ... existing types
    ('my_type', 'My Notification Type'),
]
```

2. **Update Icon Mapping** (`static/js/notifications.js`):
```javascript
getNotificationIcon(type) {
    const icons = {
        // ... existing icons
        'my_type': '⭐',
    };
    return icons[type] || 'ℹ';
}
```

3. **Update CSS** (`static/css/notifications.css`):
```css
.notification-icon.my_type {
    background-color: #your-color;
}
```

## Configuration

### Redis Configuration
Update `supply_unlimited/settings.py`:
```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('redis-host', 6379)],  # Update host/port
        },
    },
}
```

### WebSocket URL
For HTTPS/WSS, the URL is automatically determined:
```javascript
// In notifications.js
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
this.wsUrl = `${protocol}//${window.location.host}/ws/notification/`;
```

### Toastr Configuration
Customize notification toasts in `static/js/notifications.js`:
```javascript
toastr.options = {
    timeOut: 5000,          // How long to show (ms)
    extendedTimeOut: 1000,  // Delay after hover
    positionClass: 'toast-top-right',  // Position
    progressBar: true,      // Show progress
    closeButton: true,      // Show close button
}
```

## Performance Considerations

### Database Indexing
- Index on `(user, created_at)` for efficient queries
- Index on `(user, is_read)` for unread count
- Automatic VACUUM on SQLite (or manual on PostgreSQL)

### WebSocket Optimization
- Keep-alive heartbeat every 30s prevents proxy timeouts
- Exponential backoff for reconnections (max 5 attempts)
- Automatic fallback to polling if WebSocket fails
- Memory limit: Keep last 100 notifications in client memory

### Notification Cleanup
Schedule periodic cleanup of old notifications:
```python
# In a celery task or management command
from django.utils import timezone
from datetime import timedelta
from users.models import Notification

# Delete read notifications older than 30 days
cutoff = timezone.now() - timedelta(days=30)
Notification.objects.filter(
    is_read=True,
    created_at__lt=cutoff
).delete()
```

## Troubleshooting

### WebSocket Connection Fails

**Symptom**: Notifications don't arrive in real-time

**Solutions**:
1. Check Redis is running: `redis-cli ping` → should return `PONG`
2. Check Daphne is running instead of django development server
3. Check firewall allows WebSocket connections
4. Check browser console for connection errors
5. Check settings.py has correct CHANNEL_LAYERS config

### Notifications Not Persisting

**Symptom**: Notifications disappear after page refresh

**Solution**: 
- Check migrations were applied: `python manage.py migrate`
- Check database: `Notification.objects.count()` should show records

### Duplicate Notifications

**Symptom**: User receives same notification multiple times

**Solution**:
- Check signal handlers aren't registered twice
- Check signal imports in apps.py ready() method
- Ensure `created` parameter check in signals

### Performance Issues

**Symptom**: Slow notification loading or WebSocket lag

**Solutions**:
1. Add pagination limit: `/api/notifications/?limit=20`
2. Implement automatic cleanup of old notifications
3. Check Redis memory usage
4. Enable database query optimization (Django Debug Toolbar)

## Testing

### Manual Testing Checklist

- [ ] WebSocket connects on page load
- [ ] Bell icon appears in navbar (authenticated users)
- [ ] Badge shows correct unread count
- [ ] Clicking bell opens dropdown panel
- [ ] Notification list loads with recent notifications
- [ ] Toast popup appears for new real-time notifications
- [ ] Click "Mark as read" updates UI and API
- [ ] Click "Mark all read" updates all notifications
- [ ] Unread count badge disappears when zero
- [ ] Clicking notification redirects correctly
- [ ] Keep-alive heartbeat works (check network tab)
- [ ] Reconnection works after network interruption
- [ ] Works on mobile (responsive design)

### API Testing

```bash
# Get current user
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/user/current/

# List notifications
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/notifications/

# Mark as read
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8000/api/notifications/1/mark_as_read/

# Get unread count
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/notifications/unread_count/
```

## Future Enhancements

1. **Email Notifications**: Send important notifications via email
2. **Notification Preferences**: Let users choose which notifications to receive
3. **Notification Categories**: Filter by notification type
4. **Mobile Push Notifications**: Send to mobile apps via Firebase Cloud Messaging
5. **Notification Scheduling**: Schedule notifications to send at specific times
6. **Bulk Notifications**: Send same notification to multiple users
7. **Notification Templates**: Create reusable notification templates
8. **Analytics**: Track notification delivery and open rates

## Security

### CSRF Protection
WebSocket connections automatically include CSRF tokens from Django session.

### Authentication
- Only authenticated users can connect to WebSocket
- AuthMiddlewareStack enforces Django authentication
- Each user only receives their own notifications

### Authorization
- Users can only read/delete their own notifications
- NotificationViewSet filters by `request.user`
- Admin-only endpoints require explicit permission check

### Data Validation
- All notification data is sanitized before display
- HTML is escaped in JavaScript (escapeHtml function)
- SQL injection prevented by ORM

## Support & Documentation

For issues or questions:
1. Check RBAC_GUIDE.md for role-based access control
2. Check MIGRATION_SUMMARY.md for database changes
3. Review AI Reports documentation for integration examples
4. Check Django Channels documentation: https://channels.readthedocs.io/
