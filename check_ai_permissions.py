#!/usr/bin/env python
"""
Script para verificar permissões de AI Reports
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
sys.path.insert(0, '/app')
django.setup()

from users.models import UserRole, Permission, Role
from django.contrib.auth.models import User

print("=" * 60)
print("VERIFICAÇÃO DE PERMISSÕES - AI REPORTS")
print("=" * 60)

print("\n📋 ROLES DISPONÍVEIS:")
for role in Role.objects.all():
    print(f"  - {role.name}")

print("\n🔐 PERMISSÕES DE AI REPORTS:")
ai_perms = Permission.objects.filter(code__icontains='ai')
for perm in ai_perms:
    print(f"  - {perm.code}: {perm.description}")

print("\n👤 USUÁRIOS E SUAS PERMISSÕES:")
for user in User.objects.all()[:5]:
    print(f"\n  Usuário: {user.username} (ID: {user.id})")
    print(f"  Superuser: {user.is_superuser}")
    try:
        user_role = user.user_role
        if user_role.is_active:
            print(f"  Role: {user_role.role.name}")
            print(f"  Permissões AI:")
            ai_user_perms = user_role.role.permissions.filter(code__icontains='ai')
            if ai_user_perms.exists():
                for perm in ai_user_perms:
                    print(f"    ✅ {perm.code}")
            else:
                print(f"    ❌ Nenhuma permissão de AI")
        else:
            print(f"  Role inativo")
    except UserRole.DoesNotExist:
        print(f"  ❌ Sem UserRole atribuído")
        print(f"  ⚠️  PROBLEMA: Usuário sem role - vai ter erro 403!")

print("\n" + "=" * 60)
print("SOLUÇÃO:")
print("=" * 60)
print("""
Se usuário tem erro 403:
1. Usuário precisa de UserRole ativo
2. UserRole precisa ter Role (admin, manager, etc)
3. Role precisa ter permissões:
   - create_ai_reports
   - use_ai_agents

Para dar permissões ao admin:
  role = Role.objects.get(name='admin')
  perm1 = Permission.objects.get(code='create_ai_reports')
  perm2 = Permission.objects.get(code='use_ai_agents')
  role.permissions.add(perm1, perm2)
""")
