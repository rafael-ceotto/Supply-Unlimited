# 🔐 RBAC (Role-Based Access Control) System Guide

## Overview

O sistema de RBAC do Supply Unlimited permite controle granular de acesso aos features da aplicação através de Roles e Permissions.

### Componentes Principais

- **Permission**: Permissão individual (e.g., `view_ai_reports`, `create_ai_reports`)
- **Role**: Conjunto de permissões (e.g., Admin, Manager, Analyst, Viewer)
- **UserRole**: Associação entre User e Role (relação 1:1)
- **AuditLog**: Rastreamento de todas as ações (quem fez o quê, quando)

---

## 📋 Roles Padrão

### 1. **Admin** (role_type: admin)
Acesso total a todas as features.

**Permissões:**
- ✅ Todas as 17 permissões do sistema

**Caso de Uso:**
- Administradores do sistema
- Gestores corporativos

---

### 2. **Manager** (role_type: manager)
Gerenciador operacional com acesso a reports e dados.

**Permissões:**
- ✅ View Dashboard
- ✅ View/Edit Companies
- ✅ View/Edit Inventory
- ✅ View/Edit Sales
- ✅ View/Create AI Reports
- ✅ Use AI Agents
- ✅ Export Reports

**Caso de Uso:**
- Gerentes de unidade
- Supervisores operacionais

---

### 3. **Analyst** (role_type: analyst)
Acesso restrito apenas a AI Reports.

**Permissões:**
- ✅ View Dashboard
- ✅ View/Create AI Reports
- ✅ Use AI Agents
- ✅ Export Reports

**Caso de Uso:**
- Analistas de dados
- Consultores

---

### 4. **Viewer** (role_type: viewer)
Visualização apenas (read-only).

**Permissões:**
- ✅ View Dashboard
- ✅ View Companies
- ✅ View Inventory
- ✅ View Sales
- ✅ View AI Reports

**Caso de Uso:**
- Visualizadores de relatórios
- Stakeholders

---

## 🔧 Como Usar RBAC no Backend

### Verificar Permissão em Views

```python
from users.rbac_utils import user_has_permission, require_permission
from rest_framework.response import Response
from rest_framework import status

# Opção 1: Usar decorator
@require_permission('view_ai_reports')
def my_view(request):
    # Somente usuários com permissão 'view_ai_reports' chegam aqui
    return Response({'data': 'protected'})

# Opção 2: Verificar dentro da view
def another_view(request):
    if not user_has_permission(request.user, 'create_ai_reports'):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    # Continue com o código
    ...
```

### Verificar Role de um Usuário

```python
from users.rbac_utils import user_has_role, get_user_role

def admin_only_view(request):
    if not user_has_role(request.user, 'admin'):
        return Response({'error': 'Admin only'}, status=403)
    ...

def get_user_info(request):
    role = get_user_role(request.user)
    if role:
        print(f"Usuário tem role: {role.name}")
```

### Log de Auditoria

```python
from users.rbac_utils import log_audit

# Ao executar uma ação importante
log_audit(
    user=request.user,
    action='create',
    object_type='ChatSession',
    object_id='123',
    description='Usuário criou nova sessão de AI Reports',
    ip_address=get_client_ip(request)
)
```

---

## 🌐 API Endpoints RBAC

Todos os endpoints requerem autenticação (`Authorization: Bearer <token>`).

### Permissions
```
GET /api/rbac/permissions/              # Listar todas as permissions
GET /api/rbac/permissions/{code}/       # Detalhes de uma permission
```

### Roles
```
GET /api/rbac/roles/                    # Listar roles (qualquer usuário)
GET /api/rbac/roles/{id}/               # Detalhes de um role
POST /api/rbac/roles/                   # Criar role (requer manage_roles)
PUT /api/rbac/roles/{id}/               # Atualizar role (requer manage_roles)
DELETE /api/rbac/roles/{id}/            # Deletar role (requer manage_roles)
```

### User Roles
```
GET /api/rbac/user-roles/               # Listar user roles (requer manage_users)
GET /api/rbac/user-roles/my_role/       # Meu role
POST /api/rbac/user-roles/              # Atribuir role a usuário (requer manage_users)
PUT /api/rbac/user-roles/{id}/          # Atualizar role do usuário (requer manage_users)
```

### Users
```
GET /api/rbac/users/                    # Listar usuários (requer manage_users)
GET /api/rbac/users/me/                 # Meus detalhes
GET /api/rbac/users/{id}/               # Detalhes de um usuário
```

### Audit Logs
```
GET /api/rbac/audit-logs/               # Ver logs (requer view_audit_log)
GET /api/rbac/audit-logs/my_logs/       # Meus logs (qualquer usuário)
```

---

## 📝 Exemplo: Integração com AI Reports

```python
# Na view de send_message do AI Reports

from users.rbac_utils import user_has_permission, log_audit

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Enviar mensagem para AI Reports"""
    
    # Verificar se usuário pode criar relatórios
    if not user_has_permission(request.user, 'create_ai_reports'):
        log_audit(
            request.user,
            'permission_denied',
            'AIReport',
            description='Tentativa de criar relatório sem permissão'
        )
        return Response(
            {'error': 'You do not have permission to create AI reports'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar se pode usar agentes
    agent_id = request.data.get('agent_id')
    if not user_has_permission(request.user, 'use_ai_agents'):
        return Response(
            {'error': 'You cannot use AI agents'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Log da ação
    log_audit(
        request.user,
        'create',
        'ChatMessage',
        description=f'Criou mensagem com agente {agent_id}'
    )
    
    # Continue com a lógica normal...
```

---

## 🔄 Criar Nova Permission

1. **Adicione na choices do modelo Permission:**

```python
PERMISSION_CHOICES = [
    # ... existing ...
    ('new_permission', 'New Permission Description'),
]
```

2. **Rodar migration:**

```bash
python manage.py makemigrations users
python manage.py migrate users
```

3. **Adicionar a roles desejadas no admin**

---

## 🔄 Criar Nova Role

```python
# Via Django Shell
from users.models import Role, Permission

# Obter permissões
view_perm = Permission.objects.get(code='view_ai_reports')
create_perm = Permission.objects.get(code='create_ai_reports')

# Criar role
custom_role = Role.objects.create(
    name='Custom Analyst',
    role_type='custom',
    description='Analista customizado',
    is_active=True
)

# Adicionar permissões
custom_role.permissions.add(view_perm, create_perm)
```

---

## 👥 Atribuir Role a Usuário

```bash
# Via API
POST /api/rbac/user-roles/
{
    "user": 1,
    "role": 1,
    "is_active": true
}

# Via Django Shell
from users.models import UserRole, Role, User

user = User.objects.get(username='john')
role = Role.objects.get(name='Manager')

user_role, created = UserRole.objects.get_or_create(
    user=user,
    defaults={'role': role, 'is_active': True}
)
```

---

## 📊 Auditar Ações

Todas as ações são automaticamente registradas em `AuditLog`.

```bash
GET /api/rbac/audit-logs/?action=create&object_type=ChatSession
```

Exemplo de resposta:
```json
{
  "count": 42,
  "results": [
    {
      "id": 1,
      "user": "john",
      "action": "create",
      "action_display": "Create",
      "object_type": "ChatSession",
      "object_id": "123",
      "description": "Criou nova sessão",
      "ip_address": "192.168.1.1",
      "timestamp": "2026-02-02T10:30:00Z"
    }
  ]
}
```

---

## 🛡️ Boas Práticas

✅ **DO:**
- Sempre verificar permissões em endpoints sensíveis
- Registrar ações importantes em AuditLog
- Usar decorators `@require_permission()` para views
- Revisar AuditLog regularmente

❌ **DON'T:**
- Dar permissões `manage_users` levianamente
- Confiar apenas em frontend para validação
- Permitir usuários alterar sua própria role
- Deletar logs de auditoria

---

## 🔗 Middleware de Auditoria

Para auditar TODAS as requisições, adicione ao `settings.py`:

```python
MIDDLEWARE = [
    # ... outros middleware ...
    'users.rbac_utils.AuditLoggingMiddleware',
]
```

---

## 📞 Support

Para adicionar novas permissões ou roles, edite:
- `users/models.py` - Defina as permissões
- `users/populate_default_roles.py` - Configure roles padrão
- Rode migrations
