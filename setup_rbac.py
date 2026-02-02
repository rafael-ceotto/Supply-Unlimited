import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_unlimited.settings')
django.setup()

from users.populate_default_roles import create_default_roles

if __name__ == '__main__':
    create_default_roles()
