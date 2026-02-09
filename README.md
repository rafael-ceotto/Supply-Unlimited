# Supply Unlimited - Inventory & Sales Management System

A complete inventory management, companies, stores, and sales system built with Django and PostgreSQL. Includes interactive dashboard, intelligent AI reports, sales analytics and user control. Thanks in advance for your support, time and feedback.

##  Key Features

- **Interactive Dashboard**: Real-time visualization of sales metrics, inventory and performance
- **Company & Store Management**: Create, edit and monitor multiple companies and units
- **Inventory Control**: Product management, stock, warehouses and locations
- **Sales & Analytics**: Sales recording with detailed trend analysis
- **AI Reports**: Automatic report generation using artificial intelligence (LangChain + LangGraph)
- **User System**: Access control and role-based permissions (RBAC)
- **Integrated Database**: PostgreSQL for robust and reliable data

## Tech Stack

- **Backend**: Django 6.0.1
- **Database**: PostgreSQL 15
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Lucide Icons
- **Charts**: Chart.js
- **Container**: Docker & Docker Compose
- **APIs**: Django REST Framework
- **AI**: LangChain + LangGraph + OpenAI (optional)

## Prerequisites

- **Git**
- **Docker & Docker Compose installed**

## Quick Start (With Docker - Recommended)

Follow this guide to see what to expect at each step:

- **Clone this repositry**
- **cd supply_unlimited**
- **cp .env.example .env** ## Edit .env with your PostgreSQL and OpenAI credentials
- **docker compose up -d** ## Wait 10 seconds
- **docker compose ps**
- **docker exec supply_unlimited_web python manage.py migrate**
- **docker exec supply_unlimited_web python populate_data.py**
- **ESSENTIAL! Without loading sample data, the dashboard will show no companies, products, or inventory. The database starts completely empty after migrations.**
- **URL: http://localhost:8000**
- **docker compose down**

## Try AI Reports Examples - In the AI Reports tab, ask questions like:
- **Analyze inventory by country**
- **Show me top selling products**
- **What's the supply chain risk**
- **Compare sales by region**
- **Inventory turnover analysis**


## 📖 Installation Without Docker

### Prerequisites
- Python 3.13+
- PostgreSQL 15+
- pip / virtual environment

### Setup

```bash
# Clone repository
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Create database and run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python populate_data.py

# Start development server
python manage.py runserver
```



## ⚙️ Environment Variables

Create `.env` file in project root with:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db:5432/supply_unlimited_db
DB_NAME=supply_unlimited_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=db
DB_PORT=5432

# OpenAI (Optional - for AI Reports)
OPENAI_API_KEY=sk-your-openai-api-key

# Redis (Optional - for WebSocket support)
REDIS_URL=redis://redis:6379
```


```

##  📊 API Endpoints

### Dashboard & Inventory
- `GET /api/inventory/` - Inventory list with filters
- `GET /api/companies/` - Companies list
- `GET /api/sales/` - Sales data with analytics
- `GET /api/warehouse-location/{sku}/` - Product warehouse location

### AI Reports (requires authentication & permissions)
- `GET /api/ai-reports/chat-sessions/` - List user's chat sessions
- `POST /api/ai-reports/chat-sessions/` - Create new session
- `POST /api/ai-reports/messages/send/` - Send message to AI
- `GET /api/ai-reports/generated-reports/` - List generated reports
- `POST /api/ai-reports/chat-sessions/{id}/archive/` - Archive session


### ModuleNotFoundError: daphne
```bash
# Install missing dependencies
pip install -r requirements.txt

# With Docker (rebuild)
docker compose build
docker compose up -d
```

### Static files not loading
```bash
# Collect static files
python manage.py collectstatic --noinput

# With Docker
docker exec supply_unlimited_web python manage.py collectstatic --noinput
```

## 📦 Dependencies

See [requirements.txt](requirements.txt) for complete list.

**Last Updated**: February 2026
