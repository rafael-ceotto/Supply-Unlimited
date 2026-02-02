#!/bin/bash
cd /app
python manage.py shell << EOF
from users.populate_default_roles import create_default_roles
create_default_roles()
EOF
