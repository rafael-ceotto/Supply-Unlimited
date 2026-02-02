"""
Populate default RBAC roles and permissions into the database.

Run with: python manage.py shell < users/populate_default_roles.py
Or:      python -c "from users.populate_default_roles import create_default_roles; create_default_roles()"
"""

from users.models import Permission, Role


def create_default_roles():
    """Create default roles with predefined permissions"""
    
    print("🔐 Creating RBAC Roles and Permissions...\n")
    
    # ============================================
    # Create Permissions
    # ============================================
    
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
    for code, description in permissions_data:
        perm, created = Permission.objects.get_or_create(
            code=code,
            defaults={'description': description}
        )
        permissions[code] = perm
        status = "✅ Created" if created else "⏭️  Exists"
        print(f"  {status}: {code}")
    
    print("\n")
    
    # ============================================
    # Create Roles
    # ============================================
    
    roles_config = {
        'admin': {
            'role_type': 'admin',
            'description': 'Full access to all features and data',
            'permissions': list(permissions.values())  # All permissions
        },
        'manager': {
            'role_type': 'manager',
            'description': 'Can view and manage reports, inventory, and sales',
            'permissions': [
                permissions['view_dashboard'],
                permissions['view_companies'],
                permissions['edit_companies'],
                permissions['view_inventory'],
                permissions['edit_inventory'],
                permissions['view_sales'],
                permissions['edit_sales'],
                permissions['view_ai_reports'],
                permissions['create_ai_reports'],
                permissions['use_ai_agents'],
                permissions['export_reports'],
            ]
        },
        'analyst': {
            'role_type': 'analyst',
            'description': 'Can only access AI Reports and create analyses',
            'permissions': [
                permissions['view_dashboard'],
                permissions['view_ai_reports'],
                permissions['create_ai_reports'],
                permissions['use_ai_agents'],
                permissions['export_reports'],
            ]
        },
        'viewer': {
            'role_type': 'viewer',
            'description': 'Read-only access to all data',
            'permissions': [
                permissions['view_dashboard'],
                permissions['view_companies'],
                permissions['view_inventory'],
                permissions['view_sales'],
                permissions['view_ai_reports'],
            ]
        }
    }
    
    for role_name, config in roles_config.items():
        role, created = Role.objects.get_or_create(
            name=role_name.capitalize(),
            defaults={
                'role_type': config['role_type'],
                'description': config['description'],
            }
        )
        
        # Add permissions
        role.permissions.set(config['permissions'])
        
        status = "✅ Created" if created else "⏭️  Updated"
        print(f"  {status}: {role.name}")
        print(f"     Permissions: {role.permissions.count()}")
    
    print("\n✨ RBAC setup complete!")
    print("\nAvailable Roles:")
    for role in Role.objects.all():
        print(f"  • {role.name} ({role.role_type}): {role.permissions.count()} permissions")


if __name__ == '__main__':
    create_default_roles()
