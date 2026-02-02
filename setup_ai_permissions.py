#!/usr/bin/env python
"""
Script para dar permissões de AI Reports aos usuários
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from users.models import UserRole, Permission, Role
from django.contrib.auth.models import User

print("=" * 70)
print("ATRIBUINDO PERMISSÕES DE AI REPORTS")
print("=" * 70)

# Pegar permissões necessárias
try:
    create_ai = Permission.objects.get(code='create_ai_reports')
    use_ai = Permission.objects.get(code='use_ai_agents')
    view_ai = Permission.objects.get(code='view_ai_reports')
    print(f"✅ Permissões encontradas")
except Permission.DoesNotExist as e:
    print(f"❌ Permissão não encontrada: {e}")
    sys.exit(1)

# Pegar role Admin
try:
    admin_role = Role.objects.get(name='Admin')
    print(f"✅ Role 'Admin' encontrada")
except Role.DoesNotExist:
    print(f"❌ Role 'Admin' não encontrada")
    sys.exit(1)

# Adicionar permissões ao role Admin
admin_role.permissions.add(create_ai, use_ai, view_ai)
print(f"✅ Permissões adicionadas ao role 'Admin'")

# Atribuir UserRole aos usuários
for user in User.objects.all():
    user_role, created = UserRole.objects.get_or_create(
        user=user,
        defaults={'role': admin_role, 'is_active': True}
    )
    
    if created:
        print(f"✅ UserRole criado para: {user.username} → {admin_role.name}")
    else:
        if not user_role.is_active:
            user_role.is_active = True
            user_role.save()
            print(f"✅ UserRole ativado para: {user.username}")
        else:
            print(f"✅ UserRole já existia para: {user.username}")

print("\n" + "=" * 70)
print("VERIFICAÇÃO FINAL:")
print("=" * 70)

for user in User.objects.all():
    try:
        user_role = user.user_role
        if user_role.is_active:
            has_create = user_role.role.permissions.filter(code='create_ai_reports').exists()
            has_use = user_role.role.permissions.filter(code='use_ai_agents').exists()
            print(f"✅ {user.username:15} | Role: {user_role.role.name:10} | create_ai_reports: {has_create} | use_ai_agents: {has_use}")
        else:
            print(f"❌ {user.username:15} | UserRole INATIVO")
    except UserRole.DoesNotExist:
        print(f"❌ {user.username:15} | SEM UserRole")

print("\n✨ Permissões configuradas! AI Reports deve funcionar agora.")
