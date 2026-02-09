# Supply Unlimited - Inventory & Sales Management System

A complete inventory management system for companies, stores, and sales built with Django and PostgreSQL. Features an interactive dashboard, intelligent AI reports, sales analytics, and role-based access control.

## Key Features

- **Interactive Dashboard**: Real-time visualization of companies, inventory, sales metrics and performance
- **Company & Store Management**: Monitor multiple companies and store locations
- **Inventory Control**: Product management, stock tracking, warehouses and precise warehouse locations (aisle/shelf/box)
- **Sales & Analytics**: Sales recording with interactive trend analysis charts
- **AI Reports**: Automatic report generation using artificial intelligence (LangChain + LangGraph)
- **User System**: Automatic role assignment and permission management (RBAC)
- **Integrated Database**: PostgreSQL for reliable data persistence

## Tech Stack

- **Backend**: Django 6.0.1
- **Database**: PostgreSQL 15
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Lucide Icons
- **Charts**: Chart.js
- **Container**: Docker & Docker Compose
- **APIs**: Django REST Framework
- **AI**: LangChain + LangGraph

## Prerequisites

- Git
- Docker & Docker Compose

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited
```

### 2. Start Docker Containers

The Docker setup automatically:
- Installs all Python dependencies from `requirements.txt`
- Configures environment variables with safe defaults
- Sets up PostgreSQL database

```bash
docker-compose up -d
```

Wait approximately 10 seconds for containers to initialize.

### 3. Run Database Migrations

```bash
docker-compose ps  # Verify containers are running

docker exec supply_unlimited_web python manage.py migrate
```

### 4. ⚠️ Load Sample Data (CRITICAL - Required for Dashboard)

**This step is ESSENTIAL!** Without loading sample data, the dashboard will be empty. This command creates:
- 10 Companies
- 50 Stores (5 per company)
- 50 Products
- 750 Inventory Records
- 50 Warehouses with 610 Warehouse Locations
- AI Permissions & Roles (automatic for new users)
- 4 AI Agents (GPT, Claude, Llama, Mistral)

```bash
docker exec supply_unlimited_web python populate_data.py
```

You should see output like:
```
Starting database population...
Creating companies...
✓ Tech Innovations Inc.
✓ Global Supplies Ltd.
...
✅ Sample data loaded successfully!
```

### 5. Access Your Application

Open your browser: **http://localhost:8000**

### 6. Register & Login

1. Click **"Register"** to create a new account
2. Fill in: Username, First Name, Last Name, Email, Password
3. Submit - your account is created with automatic AI Reports access
4. Click **"Login"** with your credentials

## Dashboard Tabs

### Companies
- View all 10 companies
- See status (active/pending/inactive), ownership percentage, location

### Inventory
- Browse 750 products across all stores
- Filter by: company, store, status (In Stock / Low Stock / Out-of-stock)
- **Click "View Warehouse"** to see exact location: Aisle → Shelf → Box

### Analytics
- Interactive sales charts
- Data visualized by country, category, and time period
- Real-time trend analysis

### AI Reports

Generate intelligent reports by asking questions in natural language. The AI analyzes your supply chain data and provides:
- Detailed KPIs (Key Performance Indicators)
- Strategic insights
- Actionable recommendations

#### Example Questions:
- "Analyze inventory turnover by country"
- "What are our top-selling products?"
- "What's the supply chain risk assessment?"
- "Compare sales performance by region"
- "Show inventory stockout analysis"
- "What's our warehouse utilization?"

The AI automatically:
- Interprets your question
- Collects relevant data from the database
- Performs analysis
- Generates visualizations
- Provides recommendations

## API Endpoints

### Dashboard & Inventory
- `GET /api/inventory/` - Inventory list with filters
- `GET /api/companies/` - Companies list
- `GET /api/sales/` - Sales data with analytics
- `GET /api/inventory/{id}/warehouse/` - Product warehouse location

### AI Reports (requires authentication & permissions)
- `GET /api/ai-reports/chat-sessions/` - List user's chat sessions
- `POST /api/ai-reports/chat-sessions/` - Create new session
- `POST /api/ai-reports/messages/send/` - Send message to AI
- `GET /api/ai-reports/generated-reports/` - List generated reports
- `POST /api/ai-reports/chat-sessions/{id}/archive/` - Archive session

## Troubleshooting

### Port 8000 Already in Use
```bash
docker-compose down
docker-compose up -d
```

### ModuleNotFoundError or Missing Dependencies
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Static Files Not Loading
Clear browser cache: `Ctrl + Shift + Delete` and refresh: `Ctrl + F5`

### Dashboard Shows Empty Data
**You must run `populate_data.py`!** This is not optional.
```bash
docker exec supply_unlimited_web python populate_data.py
```

### Permission Denied Errors with AI Reports
This is automatically fixed by `populate_data.py`. Re-run it if needed:
```bash
docker exec supply_unlimited_web python populate_data.py
```

## Stopping the Application

```bash
docker-compose down
```

**Note:** Your data persists in the PostgreSQL volume. Use `docker-compose down -v` only if you want to completely reset the database.

## Architecture

- **populate_data.py**: Initializes the database with realistic sample data and sets up RBAC roles and permissions
- **AI Reports Module**: LangChain + LangGraph powered agent that processes natural language queries
- **RBAC System**: Automatic role assignment - new users get "Analyst" role with AI access
- **Dashboard**: Real-time frontend with responsive design

Thanks in advance for your time and feedback!

**Last Updated**: February 2026

