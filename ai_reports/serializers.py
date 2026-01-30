"""
Django REST Framework Serializers para AI Reports
"""

from rest_framework import serializers
from .models import ChatSession, ChatMessage, GeneratedReport, AIAgentConfig


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message_type', 'content', 'status', 'created_at', 'processing_time_ms']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'updated_at', 'is_archived', 'messages', 'message_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()


class GeneratedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedReport
        fields = ['id', 'title', 'description', 'report_data', 'insights', 'created_at', 'exported_formats']
        read_only_fields = ['id', 'created_at']


class AIAgentConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAgentConfig
        fields = ['id', 'name', 'model_name', 'temperature', 'max_tokens', 'system_prompt', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatMessageCreateSerializer(serializers.Serializer):
    """Serializer para criar novas mensagens de chat"""
    content = serializers.CharField(max_length=5000)
    message_type = serializers.ChoiceField(choices=['user', 'ai'])


class AIReportRequestSerializer(serializers.Serializer):
    """Serializer para requisições de relatório IA"""
    message = serializers.CharField(max_length=5000, help_text="Descrição do relatório desejado")
    session_id = serializers.IntegerField(required=False, help_text="ID da sessão (opcional, cria nova se não informado)")
    
    def validate_message(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("A mensagem deve ter no mínimo 5 caracteres")
        return value


class AIReportResponseSerializer(serializers.Serializer):
    """Serializer para resposta de processamento de relatório"""
    session_id = serializers.IntegerField()
    message_id = serializers.IntegerField()
    stage = serializers.CharField()
    status = serializers.CharField()
    content = serializers.CharField()
    timestamp = serializers.DateTimeField()
    
    # Quando estágio é complete, incluir dados do relatório
    report_data = serializers.JSONField(required=False)
    insights = serializers.ListField(child=serializers.CharField(), required=False)
    recommendations = serializers.ListField(child=serializers.CharField(), required=False)


class AIReportStreamSerializer(serializers.Serializer):
    """Serializer para streaming de respostas (Server-Sent Events)"""
    event = serializers.CharField()  # 'stage_update', 'message', 'complete', 'error'
    stage = serializers.CharField(required=False)
    stage_progress = serializers.FloatField(required=False)
    content = serializers.CharField(required=False)
    data = serializers.JSONField(required=False)
    timestamp = serializers.DateTimeField()
