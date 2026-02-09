"""
Setup AI Report permissions and roles
Execute: python setup_ai_permissions.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.models import Permission, Role, UserRole, User

def setup_permissions():
    """Create necessary permissions for AI Reports"""
    
    print('Setting up AI Report permissions...')
    
    # Create or ensure permissions exist
    ai_permissions = [
        ('view_ai_reports', 'View AI Reports'),
        ('create_ai_reports', 'Create AI Reports'),
        ('use_ai_agents', 'Use AI Agents'),
    ]
    
    for code, description in ai_permissions:
        perm, created = Permission.objects.get_or_create(
            code=code,
            defaults={'description': description}
        )
        if created:
            print(f'  ✓ Created permission: {code}')
        else:
            print(f'  ✓ Permission already exists: {code}')
    
    print('\nSetting up roles...')
    
    # Create Analyst role with AI permissions
    analyst_role, created = Role.objects.get_or_create(
        name='Analyst',
        defaults={
            'role_type': 'analyst',
            'description': 'Data analyst with AI report access'
        }
    )
    
    if created:
        print(f'  ✓ Created role: Analyst')
    else:
        print(f'  ✓ Role already exists: Analyst')
    
    # Assign AI permissions to Analyst role
    analyst_permissions = [
        'view_dashboard',
        'view_companies',
        'view_inventory',
        'view_sales',
        'view_ai_reports',
        'create_ai_reports',
        'use_ai_agents',
        'export_reports',
    ]
    
    for perm_code in analyst_permissions:
        try:
            perm = Permission.objects.get(code=perm_code)
            analyst_role.permissions.add(perm)
        except Permission.DoesNotExist:
            print(f'  ⚠ Permission not found: {perm_code}')
    
    print(f'  ✓ Assigned {len(analyst_permissions)} permissions to Analyst role')
    
    # Create Admin role with ALL permissions
    admin_role, created = Role.objects.get_or_create(
        name='Admin',
        defaults={
            'role_type': 'admin',
            'description': 'Administrator with full access'
        }
    )
    
    if created:
        print(f'  ✓ Created role: Admin')
    else:
        print(f'  ✓ Role already exists: Admin')
    
    # Add ALL permissions to Admin role
    admin_role.permissions.set(Permission.objects.all())
    print(f'  ✓ Assigned all permissions to Admin role')
    
    # Assign existing users to roles if they don't have one
    print('\nAssigning roles to users...')
    users_without_role = User.objects.filter(user_role__isnull=True)
    
    for user in users_without_role:
        # Assign admin role to superusers, analyst role to regular users
        if user.is_superuser:
            role = admin_role
        else:
            role = analyst_role
        
        UserRole.objects.create(
            user=user,
            role=role,
            is_active=True
        )
        print(f'  ✓ Assigned {role.name} role to {user.username}')
    
    if not users_without_role.exists():
        print(f'  ✓ All users already have roles assigned')
    
    print('\n✅ AI Report permissions setup complete!')

if __name__ == '__main__':
    setup_permissions()
