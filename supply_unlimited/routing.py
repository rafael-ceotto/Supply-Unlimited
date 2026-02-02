"""
WebSocket URL routing configuration for Django Channels.

This module defines all WebSocket routes and their corresponding consumers.
"""

from django.urls import re_path

from users.consumers import NotificationConsumer

websocket_urlpatterns = [
    # WebSocket endpoint for real-time notifications
    re_path(r'ws/notification/', NotificationConsumer.as_asgi()),
]
