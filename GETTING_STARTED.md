# Getting Started Guide

Complete step-by-step guide to clone and run Supply Unlimited locally.

## Prerequisites

### Option A: With Docker (Recommended)
- Docker Desktop installed ([download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- ~2GB free disk space

### Option B: Without Docker
- Python 3.13+ ([download](https://www.python.org/downloads/))
- PostgreSQL 15+ ([download](https://www.postgresql.org/download/))
- pip (included with Python)
- Git ([download](https://git-scm.com/))
- ~500MB free disk space

---

## Installation with Docker (Recommended)

### Step 1: Clone Repository
```bash
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and customize:
```env
DEBUG=False
SECRET_KEY=your-super-secret-key  # Generate: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
OPENAI_API_KEY=sk-your-key  # Get from https://platform.openai.com (optional)
```

### Step 3: Start Docker Containers
```bash
docker compose up -d
```

Monitor startup:
```bash
docker logs -f supply_unlimited_web
```

### Step 4: Run Database Migrations
```bash
docker exec supply_unlimited_web python manage.py migrate
```

### Step 5: Create Admin User
```bash
docker exec -it supply_unlimited_web python manage.py createsuperuser
```

Follow prompts to create your admin account.

### Step 6: Access Application

Open your browser:
- **Dashboard**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/

### Stopping the Application
```bash
docker compose down
```

---

## Installation Without Docker

### Step 1: Clone Repository
```bash
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited
```

### Step 2: Create Virtual Environment
```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Create PostgreSQL Database
```bash
# Using PostgreSQL cli (psql)
createdb supply_unlimited_db
createuser -P postgres  # Set password when prompted
```

### Step 5: Create Environment File
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/supply_unlimited_db
DEBUG=False
SECRET_KEY=your-generated-secret-key
OPENAI_API_KEY=sk-your-key  # Optional
```

### Step 6: Run Migrations
```bash
python manage.py migrate
```

### Step 7: Create Admin User
```bash
python manage.py createsuperuser
```

### Step 8: Start Development Server
```bash
python manage.py runserver
```

Open browser:
- **Dashboard**: http://localhost:8000
- **Admin**: http://localhost:8000/admin

---

## Quick Test

After installation, test the setup:

```bash
# With Docker
docker exec supply_unlimited_web python manage.py test users

# Without Docker
python manage.py test users
```

---

## Populate with Sample Data (Optional)

```bash
# With Docker
docker exec supply_unlimited_web python dev_tools/populate_data.py

# Without Docker
python dev_tools/populate_data.py
```

---

## Common Issues & Solutions

### Port 8000 Already in Use (Docker)
```bash
# Use different port
docker compose down
# Edit docker-compose.yml, change "8000:8000" to "8001:8000"
docker compose up -d
# Access at http://localhost:8001
```

### PostgreSQL Connection Error
```bash
# Verify database is running
docker logs supply_unlimited_db

# Check credentials in .env
# Create database if not exists:
docker exec supply_unlimited_db createdb -U postgres supply_unlimited_db
```

### ModuleNotFoundError
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Or with Docker
docker compose build
docker compose up -d
```

### Permission Denied (Linux/macOS)
```bash
chmod +x manage.py
```

### Database Migration Conflicts
```bash
# With Docker
docker exec supply_unlimited_web python manage.py migrate --fake-initial

# Without Docker
python manage.py migrate --fake-initial
```

---

## Project Structure

```
supply_unlimited/
├── users/              # Main app with models
├── ai_reports/         # AI reports module
├── sales/              # Sales module
├── templates/          # HTML templates
├── static/             # CSS, JS, images
├── dev_tools/          # Development scripts (not in production)
├── manage.py           # Django CLI
├── requirements.txt    # Dependencies
├── docker-compose.yml  # Docker configuration
├── README.md           # This file
└── .env.example        # Environment template
```

---

## Next Steps

1. **Configure OpenAI** (optional)
   - Get API key from https://platform.openai.com
   - Add to `.env` as `OPENAI_API_KEY`
   - Navigate to "AI Reports" in dashboard

2. **Explore Features**
   - Dashboard with metrics
   - Company & Store management
   - Inventory tracking
   - Sales analytics
   - AI Report generation

3. **Development**
   - See `dev_tools/README.md` for testing scripts
   - Check documentation in root README.md
   - Review code in individual app folders

---

## Documentation

- [Main README](README.md) - Full documentation
- [Docker Setup](docker-compose.yml) - Docker configuration
- [Environment Template](.env.example) - Configuration variables
- [Dev Tools](dev_tools/README.md) - Development scripts

---

## Support

- **Issues**: https://github.com/rafael-ceotto/Supply-Unlimited/issues
- **Documentation**: See main README.md
- **Troubleshooting**: See "Common Issues" section above

---

**Happy coding! 🚀**
