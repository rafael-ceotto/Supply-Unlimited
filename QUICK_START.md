# Quick Start Guide - Real-time Notifications System

## 🚀 Quick Start (5 minutes)

### 1. Verify Installation
```bash
# Check if packages are installed
pip list | grep -E "channels|daphne"

# Expected output:
# channels               4.0.0
# channels-redis        4.1.0
# daphne                4.0.0
```

### 2. Ensure Redis is Running
```bash
# Using Docker Compose (recommended)
docker-compose up -d redis

# Or local Redis
redis-server

# Verify connection
redis-cli ping  # Should respond: PONG
```

### 3. Run Migrations
```bash
python manage.py migrate
```

### 4. Start Daphne (ASGI Server)
```bash
# Development mode
daphne -b 0.0.0.0 -p 8000 supply_unlimited.asgi:application

# OR keep using Django dev server for now (falls back to polling)
python manage.py runserver
```

### 5. Test It Out
1. Open http://localhost:8000/dashboard/
2. Look for bell icon in navbar (top right)
3. Create an AI report in Reports page
4. Should see toast notification appear in real-time!

## 📋 What's New

### Files Created (7)
- `supply_unlimited/routing.py` - WebSocket routing
- `users/consumers.py` - Real-time notification handler
- `users/signals.py` - Auto-trigger notifications
- `static/css/notifications.css` - Styling
- `static/js/notifications.js` - Frontend logic
- `NOTIFICATIONS_GUIDE.md` - Full documentation
- `IMPLEMENTATION_COMPLETE.md` - Completion details

### Files Modified (9)
- `supply_unlimited/asgi.py` - Channels setup
- `supply_unlimited/settings.py` - Config
- `users/models.py` - Notification model
- `users/serializers.py` - API serializer
- `users/views.py` - API endpoints
- `users/urls.py` - Routes
- `users/apps.py` - Signal registration
- `templates/base.html` - Bell icon component
- `ai_reports/views.py` - RBAC integration

## 🔧 Configuration

### If Using Docker Compose
Update docker-compose.yml cmd if needed:
```yaml
services:
  web:
    command: daphne -b 0.0.0.0 -p 8000 supply_unlimited.asgi:application
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### If Using Local Development
```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Daphne
daphne -b 0.0.0.0 -p 8000 supply_unlimited.asgi:application

# OR use Django dev server (slower, polling fallback)
python manage.py runserver
```

## 📊 API Endpoints

All endpoints require authentication (session or token).

### List/Create Notifications
```bash
GET    /api/notifications/              # List user's notifications
POST   /api/notifications/              # Create notification (admin)
```

### Single Notification
```bash
GET    /api/notifications/<id>/         # Get details
PUT    /api/notifications/<id>/         # Update
DELETE /api/notifications/<id>/         # Delete
```

### Quick Actions
```bash
POST   /api/notifications/<id>/mark_as_read/    # Mark single
POST   /api/notifications/mark_all_read/        # Mark all
GET    /api/notifications/unread_count/         # Count
GET    /api/notifications/unread/               # Get unread
```

### User Info
```bash
GET    /api/user/current/               # Get current user
```

## 🎨 UI Components

### Notification Bell
Located in navbar (top right when logged in)
- Shows unread count badge
- Click to open dropdown panel
- Displays last 20 notifications

### Notification Types (Color-Coded)
| Type | Color | Icon |
|------|-------|------|
| info | 🔵 Blue | ℹ |
| success | 🟢 Green | ✓ |
| warning | 🟡 Yellow | ⚠ |
| error | 🔴 Red | ✕ |
| report_ready | 🔷 Cyan | 📊 |
| report_error | 🟠 Orange | ⚠ |
| role_changed | 🟣 Purple | 👤 |
| permission_denied | 🟠 Orange | 🔒 |

## 🔌 WebSocket Connection

### Automatic Connection
- Established when page loads (if authenticated)
- Located at `ws://localhost:8000/ws/notification/`
- Automatically reconnects if connection drops
- Falls back to API polling if WebSocket unavailable

### Keep-Alive
- Sends heartbeat every 30 seconds
- Prevents proxy timeout
- Automatic response handling

## ⚙️ System Architecture

```
User Browser
    ↓
[WebSocket] → /ws/notification/
    ↓
NotificationConsumer
    ├─ Authenticate user
    ├─ Join user's notification group
    └─ Listen for broadcasts
    ↓
Signal Trigger (e.g., AI Report)
    ├─ Create Notification in DB
    └─ Send WebSocket to user group
    ↓
Client Receives
    ├─ Show toast notification
    ├─ Update notification panel
    └─ Update bell badge
```

## 🧪 Testing

### Verify WebSocket Connection
1. Open DevTools → Network tab
2. Reload page
3. Look for WebSocket connection in Network tab
4. Status should be "101 Switching Protocols"
5. Message should show "Connected to WebSocket"

### Create Test Notification
```python
# In Django shell: python manage.py shell
from users.models import Notification
from django.contrib.auth.models import User

user = User.objects.first()  # Get first user
notification = Notification.create_notification(
    user=user,
    title="Test Notification",
    message="This is a test!",
    notification_type="info"
)
```

### API Test
```bash
curl -H "Cookie: sessionid=YOUR_SESSIONID" \
  http://localhost:8000/api/notifications/
```

## 📱 Mobile Support

- Responsive design works on all screen sizes
- Bell icon responsive layout
- Dropdown panel adapts to small screens
- Touch-friendly buttons

## 🔐 Security

- ✅ Only authenticated users can connect
- ✅ Users only see their own notifications
- ✅ CSRF protection enabled
- ✅ XSS prevention via HTML escaping
- ✅ SQL injection prevention via ORM

## 🆘 Troubleshooting

### "WebSocket is closed" Error
- **Cause**: Redis not running or ASGI server not running
- **Fix**: Start Redis and use Daphne instead of Django dev server

### Notifications not showing
- **Cause**: Signal not loaded or migrations not applied
- **Fix**: Run `python manage.py migrate` and restart server

### Bell icon not visible
- **Cause**: Not authenticated or static files not loaded
- **Fix**: Login first and run `python manage.py collectstatic`

### Toast notifications don't appear
- **Cause**: Toastr JS library not loaded
- **Fix**: Check browser console for JS errors

## 📚 Full Documentation

For comprehensive documentation, see:
- `NOTIFICATIONS_GUIDE.md` - Full system guide (400+ lines)
- `RBAC_GUIDE.md` - Role-based access control
- `IMPLEMENTATION_COMPLETE.md` - Implementation details

## 🎯 Next Steps

1. ✅ System installed and configured
2. ✅ Run migrations and collect static files
3. ✅ Start Daphne ASGI server
4. ✅ Test WebSocket connection
5. ✅ Create AI reports to trigger notifications
6. ✅ Monitor bell icon for real-time updates

## 💡 Tips & Tricks

### View Notifications Database
```bash
python manage.py dbshell
sqlite> SELECT * FROM users_notification;
```

### Clear Old Notifications
```python
# In Django shell
from django.utils import timezone
from datetime import timedelta
from users.models import Notification

cutoff = timezone.now() - timedelta(days=7)
Notification.objects.filter(
    is_read=True, 
    created_at__lt=cutoff
).delete()
```

### Monitor WebSocket
1. DevTools → Network tab → WS
2. Click on WebSocket connection
3. View Messages tab to see real-time communication

### Enable Debug Logging
```python
# In settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'users.consumers': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'users.signals': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## 📞 Support

- Check `NOTIFICATIONS_GUIDE.md` for detailed documentation
- Check browser console for JavaScript errors
- Check Django logs for backend errors
- Ensure Redis is running and accessible
- Verify ASGI server (Daphne) is running

---
**System Status**: ✅ Ready for Production

Start by running `daphne` and visiting the dashboard! 🎉
