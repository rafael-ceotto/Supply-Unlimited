"""
Test user registration
Execute: python test_user_registration.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserRole, Role

def test_registration():
    """Test creating a new user and assigning role"""
    
    print('Testing user registration...')
    
    # Try to create a test user
    test_username = 'testuser123'
    test_email = 'testuser@example.com'
    test_password = 'TestPass123!'
    
    try:
        # Check if user already exists
        if User.objects.filter(username=test_username).exists():
            print(f'  ⚠ User {test_username} already exists')
            user = User.objects.get(username=test_username)
        else:
            # Create new user
            user = User.objects.create_user(
                username=test_username,
                email=test_email,
                password=test_password,
                first_name='Test',
                last_name='User'
            )
            print(f'  ✓ User created: {test_username}')
        
        # Check if user has role
        try:
            user_role = UserRole.objects.get(user=user)
            print(f'  ✓ User has role: {user_role.role.name}')
        except UserRole.DoesNotExist:
            print(f'  ⚠ User has NO role - assigning Analyst role manually')
            
            # Get or create analyst role
            analyst_role, created = Role.objects.get_or_create(
                name='Analyst',
                defaults={
                    'role_type': 'analyst',
                    'description': 'Data analyst with AI report access'
                }
            )
            
            if created:
                print(f'    ✓ Created Analyst role')
            
            # Assign role
            UserRole.objects.create(
                user=user,
                role=analyst_role,
                is_active=True
            )
            print(f'  ✓ Assigned Analyst role to user')
        
        print(f'\n✅ User registration test successful!')
        print(f'  Username: {user.username}')
        print(f'  Email: {user.email}')
        print(f'  First Name: {user.first_name}')
        print(f'  Last Name: {user.last_name}')
        
    except Exception as e:
        print(f'  ❌ Error during registration: {str(e)}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_registration()
