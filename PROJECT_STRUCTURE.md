# Project Organization Guide

This document describes the organizational structure of the Supply Unlimited project - both what goes to GitHub and what stays local.

---

## GitHub Repository Structure

Only **essential files for deployment** are in version control:

```
supply_unlimited/  (GitHub - ~50 MB)
├── supply_unlimited/           # Django settings
├── users/                      # Main app with all models
├── ai_reports/                 # AI Reports module
├── sales/                      # Sales module
├── templates/                  # HTML templates
├── static/                     # CSS, JS, images for frontend
├── manage.py
├── requirements.txt
├── docker-compose.yml          # Docker orchestration
├── Dockerfile                  # Docker image definition
├── .env.example                # Environment template
├── .gitignore
├── README.md                   # Main documentation
├── GETTING_STARTED.md          # Quick start guide
├── CONTRIBUTING.md             # Development guidelines
└── dev_tools/                  # Development scripts (documented)
    └── README.md
```

### Key Point
When someone clones the repository, they get **everything needed to run the project**.

---

## Local Development Structure

Your **local machine** has additional folders for development:

```
c:\Users\ceott\OneDrive\Desktop\Development\supply_unlimited/
│
├── [GitHub Files - Listed Above]
│
├── dev_tools/                  # LOCAL - Development & testing scripts
│   ├── README.md
│   ├── populate_data.py
│   ├── test_sales_api.py
│   ├── analyze_data.py
│   ├── check_inventory.py
│   └── [other test scripts]
│
├── venv/                       # LOCAL - Virtual environment (ignored)
│   └── [Python packages]
│
├── staticfiles/                # LOCAL - Collected static files (ignored)
│   ├── admin/
│   ├── css/
│   └── js/
│
├── postgres_data/              # LOCAL - PostgreSQL data (Docker volume, ignored)
│
├── .vscode/                    # LOCAL - VS Code settings (optional, ignored)
│   ├── settings.json
│   └── launch.json
│
└── .git/                       # LOCAL - Git repository metadata
```

---

## What Goes to GitHub vs. Local Only

### ✅ In GitHub (Version Control)

```
Requirements for running the project:
- Python source code (.py files)
- HTML templates (.html files)  
- CSS stylesheets (.css files)
- JavaScript files (.js files)
- Configuration files (docker-compose.yml, Dockerfile)
- Documentation (README.md, GETTING_STARTED.md)
- Environment template (.env.example)
- Development tools documentation (dev_tools/README.md)
```

### ❌ NOT in GitHub (Ignored via .gitignore)

```
Large files, sensitive data, generated files:
- venv/ - Virtual environment (~200+ MB)
- __pycache__/ - Python cache files
- *.pyc - Compiled Python files
- db.sqlite3 - Development database
- .env - Sensitive credentials
- staticfiles/ - Collected static files
- postgres_data/ - PostgreSQL Docker volume
- .vscode/ - Editor settings
- .idea/ - IDE settings
- .DS_Store - macOS system files
- *.log - Log files
- temp/ tmp/ - Temporary files
- node_modules/ - If using Node.js (not currently)
- Sales/, Reports/, Settings/ - Old development folders
- _archive/ - Archived development files
```

---

## Development & Deployment Scenarios

### Scenario 1: Someone Clones Your Repository

```bash
$ git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
$ cd supply_unlimited

# They get:
✓ All source code
✓ All templates & static assets
✓ docker-compose.yml to run the project
✓ requirements.txt to install dependencies
✓ Documentation to get started
✓ dev_tools/README.md explaining test scripts

# They DON'T get:
✗ Virtual environment (they create their own)
✗ Database data (starts fresh)
✗ Your local configuration (.env)
✗ IDE settings
✗ Development scripts (only docs about them)
```

---

## Best Practices for Local Organization

### 1. Development Scripts

**Location**: `dev_tools/` folder

Scripts for testing and debugging:
```bash
dev_tools/
├── README.md                 # How to use these scripts
├── populate_data.py          # Load sample data
├── test_agent.py             # Test AI features
├── check_inventory.py        # Verify data
└── [other utilities]
```

**Usage**:
```bash
# Load sample data
python dev_tools/populate_data.py

# Run tests
python dev_tools/test_agent.py
```

### 2. Virtual Environment

**Location**: `venv/` folder (in root)

```bash
# Create
python -m venv venv

# Activate
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# Deactivate
deactivate
```

### 3. Local Configuration

**Location**: `.env` (in root)

```bash
# Create from template
cp .env.example .env

# Edit with your values
DEBUG=False
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### 4. IDE Configuration

**Location**: `.vscode/` folder (in root - but ignored)

```
.vscode/
├── settings.json          # VS Code settings
├── launch.json           # Debug configuration
└── extensions.json       # Recommended extensions
```

### 5. Docker Volumes (Database)

**Location**: `postgres_data/` folder (created by Docker)

```bash
# View Docker volumes
docker volume ls

# Persist in named volume (recommended)
# See docker-compose.yml for 'supply_unlimited_db' volume
```

---

## File Size Reference

```
GitHub  repository:  ~50 MB
├── Source code:      ~10 MB
├── Templates:        ~1 MB  
├── Static assets:    ~30 MB
├── Documentation:    ~5 MB
└── Config files:     <1 MB

Local only (ignored):
├── venv/:           ~200-400 MB
├── postgres_data/:  ~50-500 MB (variable)
├── __pycache__/:    ~20-50 MB
├── staticfiles/:    ~30 MB
└── Other:           ~100 MB
```

---

## Daily Workflow

### Cloning for the First Time

```bash
# Clone
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# With Docker
docker compose up -d
docker exec supply_unlimited_web python manage.py migrate

# Or locally
python manage.py migrate
python manage.py runserver
```

### Making Changes

```bash
# Make sure venv is activated
source venv/bin/activate

# Make code changes
# Edit files in users/, templates/, static/, etc.

# Test locally
python manage.py test
python manage.py runserver

# Use development tools if needed
python dev_tools/test_agent.py

# Commit and push
git add .
git commit -m "Description of changes"
git push origin feature-branch
```

### Pulling Latest Changes

```bash
git pull origin main
pip install -r requirements.txt  # In case dependencies changed
python manage.py migrate         # In case models changed
```

---

## Managing Git Ignore

The `.gitignore` file ensures sensitive/large files stay local:

```bash
# View what's ignored
cat .gitignore

# Check if file is ignored
git check-ignore -v file.py

# Force add ignored file (not recommended)
git add -f file.py

# Remove ignored file from git history (advanced)
git rm --cached filename
git commit -m "Remove filename"
```

---

## Docker-Specific Notes

### Docker Volumes

```bash
# These are created and managed by Docker
# They're local to your machine and ignored by git:

supply_unlimited_db       # PostgreSQL database data
supply_unlimited_supply_network  # Docker network

# View volumes
docker volume ls

# Backup database
docker exec supply_unlimited_db pg_dump -U postgres supply_unlimited_db > backup.sql
```

### Rebuilding Docker

```bash
# If docker-compose.yml changes
docker compose down
docker images | grep supply_unlimited | awk '{print $3}' | xargs docker rmi -f
docker compose up -d --build
```

---

## Team Collaboration

### For New Team Members

```bash
1. Clone the repository
2. Copy .env.example to .env
3. Configure .env with their settings
4. Run: python -m venv venv
5. Run: pip install -r requirements.txt
6. Run: docker compose up -d  (or setup local PostgreSQL)
7. Run: python manage.py migrate
8. Read: GETTING_STARTED.md and CONTRIBUTING.md
9. Start coding!
```

### Preventing Accidental Commits

```bash
# Protect .env from being committed
git update-index --assume-unchanged .env

# If needed, to un-protect
git update-index --no-assume-unchanged .env
```

### Shared Development Database

```bash
# DON'T commit database files
# Instead, use migration files:
python manage.py makemigrations
git add app/migrations/
git commit -m "Add migration for new model"

# Others will run migrations
python manage.py migrate
```

---

## Cleanup & Maintenance

### Remove Local Artifacts

```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Clear Django cache
python manage.py clear_cache

# Remove database and start fresh
rm db.sqlite3
python manage.py migrate
```

### Monitor Disk Usage

```bash
# Check folder sizes
du -sh *        # Linux/macOS
ls -la          # Windows (use File Explorer)

# Clean up venv if needed
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

---

## Summary

```
GitHub = "Ready to Deploy" ✓
├── All source code ✓
├── Documentation ✓
├── Configuration templates ✓
└── 50 MB total ✓

Local = "Development Environment"
├── Virtual environment
├── Database data
├── IDE settings
├── Test/debug scripts
├── Environment configuration
└── ~400+ MB total
```

**Key Principle**: Everything needed to run the app is on GitHub. Everything else is local and customized per developer.

---

**Questions?** See [GETTING_STARTED.md](GETTING_STARTED.md) or [CONTRIBUTING.md](CONTRIBUTING.md)
