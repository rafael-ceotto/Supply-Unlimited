"""
WebSocket consumers for real-time notification delivery.

Handles WebSocket connections and broadcasts notifications to connected users.
"""

import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time notifications.
    
    Connects users to a WebSocket channel and broadcasts notifications
    to them in real-time without requiring page refreshes.
    
    Methods:
    - connect(): Establishes WebSocket connection and joins user's group
    - disconnect(): Closes connection and removes user from group
    - receive(): Receives messages from client (typically keep-alives)
    - send_notification(): Broadcasts notification to client
    """

    async def connect(self):
        """
        Handle WebSocket connection.
        
        - Authenticates the user
        - Creates a unique channel group name for the user
        - Joins the user to their notification group
        """
        self.user = self.scope["user"]
        
        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Create unique group name for this user
        self.user_group_name = f"notifications_{self.user.id}"
        
        # Join the user's notification group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
        logger.info(f"User {self.user.username} connected to notifications")

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        
        - Removes user from their notification group
        - Logs the disconnection
        """
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
        logger.info(f"User {self.user.username if hasattr(self, 'user') else 'Unknown'} disconnected from notifications")

    async def receive(self, text_data=None, bytes_data=None):
        """
        Receive message from WebSocket client.
        
        This handles keep-alive pings or acknowledgments from the client.
        """
        if text_data:
            try:
                data = json.loads(text_data)
                # Handle keep-alive ping
                if data.get('type') == 'ping':
                    await self.send(text_data=json.dumps({'type': 'pong'}))
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received: {text_data}")

    async def send_notification(self, event):
        """
        Send notification to the WebSocket client.
        
        This method is called by the group_send() function to broadcast
        notifications to all connected WebSocket instances in a group.
        
        Args:
            event (dict): Contains:
                - notification_id: ID of the notification
                - title: Notification title
                - message: Notification message
                - notification_type: Type of notification (info, success, etc.)
                - is_read: Whether the notification has been read
                - created_at: Timestamp of creation
        """
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification_id': event['notification_id'],
            'title': event['title'],
            'message': event['message'],
            'notification_type': event['notification_type'],
            'is_read': event['is_read'],
            'created_at': event['created_at'],
            'redirect_url': event.get('redirect_url'),
        }))


# Helper function to send notification to a specific user
async def send_notification_to_user(user_id, notification_data):
    """
    Send a notification to a specific user via WebSocket.
    
    Args:
        user_id (int): ID of the user to notify
        notification_data (dict): Notification data containing:
            - notification_id
            - title
            - message
            - notification_type
            - is_read
            - created_at
            - redirect_url (optional)
    """
    channel_layer = get_channel_layer()
    user_group_name = f"notifications_{user_id}"
    
    await channel_layer.group_send(
        user_group_name,
        {
            'type': 'send_notification',
            'notification_id': notification_data['notification_id'],
            'title': notification_data['title'],
            'message': notification_data['message'],
            'notification_type': notification_data['notification_type'],
            'is_read': notification_data['is_read'],
            'created_at': notification_data['created_at'],
            'redirect_url': notification_data.get('redirect_url'),
        }
    )
