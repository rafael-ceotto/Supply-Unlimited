"""
URLs para AI Reports API
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatSessionViewSet, ChatMessageViewSet, GeneratedReportViewSet,
    AIAgentConfigViewSet
)

router = DefaultRouter()
router.register(r'chat-sessions', ChatSessionViewSet, basename='chat-session')
router.register(r'messages', ChatMessageViewSet, basename='chat-message')
router.register(r'reports', GeneratedReportViewSet, basename='generated-report')
router.register(r'agent-config', AIAgentConfigViewSet, basename='agent-config')

urlpatterns = [
    path('', include(router.urls)),
]
