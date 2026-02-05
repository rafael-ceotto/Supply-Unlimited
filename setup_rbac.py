#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')

django.setup()

from django.contrib.auth.models import User
from users.models import Permission, Role, UserRole

print('\n' + '='*60)
print('🔐 Criando Roles e Atribuindo Permissões...')
print('='*60)

# Create permissions
permissions_data = [
    ('view_dashboard', 'View Dashboard'),
    ('view_companies', 'View Companies'),
    ('edit_companies', 'Edit Companies'),
    ('delete_companies', 'Delete Companies'),
    ('view_inventory', 'View Inventory'),
    ('edit_inventory', 'Edit Inventory'),
    ('delete_inventory', 'Delete Inventory'),
    ('view_sales', 'View Sales'),
    ('edit_sales', 'Edit Sales'),
    ('delete_sales', 'Delete Sales'),
    ('view_ai_reports', 'View AI Reports'),
    ('create_ai_reports', 'Create AI Reports'),
    ('use_ai_agents', 'Use AI Agents'),
    ('export_reports', 'Export Reports'),
    ('view_audit_log', 'View Audit Log'),
    ('manage_users', 'Manage Users'),
    ('manage_roles', 'Manage Roles'),
]

permissions = {}
print('\n📋 Criando Permissões...')
for code, description in permissions_data:
    perm, created = Permission.objects.get_or_create(
        code=code,
        defaults={'description': description}
    )
    permissions[code] = perm
    status = "✅" if created else "⏭️"
    print(f"  {status} {code}")

# Create admin role with all permissions
print('\n👑 Criando Role Admin...')
admin_role, created = Role.objects.get_or_create(
    name='Admin',
    defaults={
        'role_type': 'admin',
        'description': 'Full access to all features'
    }
)
admin_role.permissions.set(permissions.values())
print(f"  ✅ Admin role com {admin_role.permissions.count()} permissões")

# Ensure user 'rafa' exists and has admin role
print('\n👤 Atribuindo Role ao usuário...')
try:
    rafa = User.objects.get(username='rafa')
    print(f"  ✅ Usuário 'rafa' encontrado")
except User.DoesNotExist:
    rafa = User.objects.create_user(username='rafa', password='devrafa', email='rafa@example.com')
    rafa.is_staff = True
    rafa.save()
    print(f"  ✅ Usuário 'rafa' criado")

# Assign admin role to rafa
user_role, created = UserRole.objects.get_or_create(
    user=rafa,
    role=admin_role
)
status = "✅ Criado" if created else "⏭️ Já existe"
print(f"  {status}: {rafa.username} com role {admin_role.name}")

print('\n' + '='*60)
print('✨ Permissões e Roles configuradas com sucesso!')
print('='*60 + '\n')
