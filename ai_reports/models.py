from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json


class ChatSession(models.Model):
    """Armazena sessões de chat do AI Reports"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_chat_sessions')
    title = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%d/%m/%Y %H:%M')}"


class ChatMessage(models.Model):
    """Armazena mensagens individuais em uma sessão de chat"""
    MESSAGE_TYPES = [
        ('user', 'User Message'),
        ('ai', 'AI Response'),
    ]
    
    STATUS_CHOICES = [
        ('analyzing', 'Analyzing'),
        ('planning', 'Planning'),
        ('etl', 'ETL Processing'),
        ('generating', 'Generating'),
        ('complete', 'Complete'),
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES)
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processing_time_ms = models.IntegerField(null=True, blank=True)
    agent = models.ForeignKey('AIAgentConfig', on_delete=models.SET_NULL, null=True, blank=True, related_name='messages')
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.message_type.upper()}: {self.content[:50]}"


class GeneratedReport(models.Model):
    """Armazena relatórios gerados pela IA"""
    EXPORT_FORMATS = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('json', 'JSON'),
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='reports')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    report_data = models.JSONField(default=dict)  # Armazena KPIs, gráficos, tabelas, etc.
    insights = models.JSONField(default=dict)  # Armazena insights e recomendações
    created_at = models.DateTimeField(auto_now_add=True)
    exported_formats = models.JSONField(default=list)  # Rastreia em quais formatos foi exportado
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%d/%m/%Y')}"


class AIAgentConfig(models.Model):
    """Configurações do agente IA LangGraph"""
    name = models.CharField(max_length=100, unique=True)
    model_name = models.CharField(max_length=100, default='gpt-4')
    temperature = models.FloatField(default=0.7)
    max_tokens = models.IntegerField(default=2000)
    system_prompt = models.TextField(
        default="""Você é um assistente especializado em análise de supply chain e logística.
Sua função é:
1. Interpretar requisições de relatórios de usuários
2. Identificar KPIs relevantes para a análise solicitada
3. Acessar dados de estoque, vendas e logística
4. Gerar insights acionáveis
5. Criar recomendações baseadas em dados

Sempre estruture seus relatórios com:
- Executive Summary
- KPIs principais
- Análise detalhada
- Recomendações
- Próximos passos"""
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
