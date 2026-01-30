from django.contrib import admin
from .models import ChatSession, ChatMessage, GeneratedReport, AIAgentConfig


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'created_at', 'updated_at', 'is_archived')
    list_filter = ('is_archived', 'created_at', 'user')
    search_fields = ('user__username', 'title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'message_type', 'content_preview', 'status', 'created_at')
    list_filter = ('message_type', 'status', 'created_at')
    search_fields = ('session__title', 'content')
    readonly_fields = ('created_at',)
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'


@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'session_user', 'created_at', 'export_count')
    list_filter = ('created_at', 'session__user')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at',)
    
    def session_user(self, obj):
        return obj.session.user.username
    session_user.short_description = 'User'
    
    def export_count(self, obj):
        return len(obj.exported_formats)
    export_count.short_description = 'Exports'


@admin.register(AIAgentConfig)
class AIAgentConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_name', 'temperature', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'model_name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'model_name', 'is_active')
        }),
        ('Parameters', {
            'fields': ('temperature', 'max_tokens')
        }),
        ('System Prompt', {
            'fields': ('system_prompt',),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
