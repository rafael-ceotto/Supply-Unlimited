# Supply Unlimited - Inventory & Sales Management System

A complete inventory management, companies, stores, and sales system built with Django and PostgreSQL. Includes interactive dashboard, intelligent AI reports, sales analytics and user control.

## 🎯 Key Features

- **Interactive Dashboard**: Real-time visualization of sales metrics, inventory and performance
- **Company & Store Management**: Create, edit and monitor multiple companies and units
- **Inventory Control**: Product management, stock, warehouses and locations
- **Sales & Analytics**: Sales recording with detailed trend analysis
- **AI Reports**: Automatic report generation using artificial intelligence (LangChain + LangGraph)
- **User System**: Access control and role-based permissions (RBAC)
- **Integrated Database**: PostgreSQL for robust and reliable data

## 🛠️ Tech Stack

- **Backend**: Django 6.0.1
- **Database**: PostgreSQL 15
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Lucide Icons
- **Charts**: Chart.js
- **Container**: Docker & Docker Compose
- **APIs**: Django REST Framework
- **AI**: LangChain + LangGraph + OpenAI (optional)

## 🚀 Quick Start (With Docker - Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL and OpenAI credentials

# 3. Start containers
docker compose up -d

# 4. Run migrations
docker exec supply_unlimited_web python manage.py migrate

# 5. Create superuser
docker exec -it supply_unlimited_web python manage.py createsuperuser

# 6. ⭐ IMPORTANT: Load sample data (Required for dashboard to display data)
docker exec supply_unlimited_web python populate_data.py

# 7. Access the application
# Dashboard: http://localhost:8000
# Admin: http://localhost:8000/admin
```

**⚠️ Important**: Step 6 is ESSENTIAL! Without loading sample data, the dashboard will show no companies, products, or inventory. The database starts completely empty after migrations.

## 📥 Sample Data & Database Population

The project includes `populate_data.py` script that automatically creates:
- 5 Companies
- Multiple Stores/Locations
- 50+ Products with inventory
- Stock tracking across locations
- AI agent configurations

### Load Sample Data

**With Docker (Recommended):**
```bash
docker exec supply_unlimited_web python populate_data.py
```

**Locally (without Docker):**
```bash
python populate_data.py
```

### Alternative: Manual Data Entry
If you prefer to add data manually:
1. Visit: http://localhost:8000/admin
2. Login with your superuser credentials
3. Add Companies, Stores, Products, and Inventory manually

---

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

Visit: http://localhost:8000

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

## 📁 Project Structure

```
supply_unlimited/
├── supply_unlimited/        # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py             # URL routing
│   ├── wsgi.py
│   └── asgi.py
├── users/                   # Users & main models app
│   ├── models.py           # Company, Store, Product, Inventory, Sale
│   ├── views.py            # View logic
│   ├── forms.py            # Django forms
│   ├── admin.py            # Admin interface
│   └── migrations/
├── ai_reports/             # AI Reports module
│   ├── models.py           # ChatSession, ChatMessage, Report models
│   ├── views.py            # REST API views
│   ├── serializers.py      # DRF serializers
│   ├── agent.py            # LangChain AI agent with 5-stage pipeline
│   └── migrations/
├── sales/                  # Sales module
│   ├── models.py
│   └── views.py
├── templates/              # HTML templates
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── companies.html
│   ├── inventory.html
│   ├── reports.html
│   └── sales.html
├── static/                 # Static assets
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── auth.css
│   │   ├── ai-reports.css
│   │   └──...
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── ai-reports-new.js
│   │   ├── auth.js
│   │   └── ...
│   └── images/
├── docker-compose.yml      # Docker Compose orchestration
├── Dockerfile              # Docker image definition
├── manage.py               # Django CLI
├── requirements.txt        # Python dependencies
├── populate_data.py        # Sample data loader (run after setup)
└── .env.example            # Environment variables template
```

## 🔐 Authentication & Authorization

- **Login**: Username/password authentication
- **Registration**: New user registration with email and name
- **Authorization**: RBAC (Role-Based Access Control)
  - **Admin** (Rafael Ceotto): Full system access
  - **Staff**: Users, reports, and management access
  - **Regular Users**: Dashboard and assigned features only
- **Permissions**: Fine-grained permission system for AI features

## 🗄️ Database Models

### Core Models
- **Company** - Business entities with subsidiaries support
- **Store** - Physical/logical units within companies
- **Category** - Product categories
- **Product** - Items sold/managed
- **Warehouse** - Storage facilities
- **WarehouseLocation** - Specific shelf/aisle locations
- **Inventory** - Stock levels by store and product
- **Sale** - Sales transactions with details

### Analytics & AI
- **DashboardMetrics** - Daily aggregated metrics
- **ChatSession** - AI chat conversation sessions
- **ChatMessage** - Messages in chat sessions
- **GeneratedReport** - AI-generated reports
- **AIAgentConfig** - LLM model configurations

### RBAC
- **Role** - Role definitions (Admin, Staff, User)
- **Permission** - Fine-grained permissions
- **UserRole** - User role assignments

## 🤖 AI Reports Feature

Intelligent report generation pipeline powered by LangChain + LangGraph:

### 5-Stage Processing
1. **INTERPRETING** - Understand natural language requests
2. **PLANNING** - Identify required KPIs and data
3. **DATA_COLLECTION** - Fetch and validate data
4. **ANALYSIS** - Process ETL and extract insights
5. **GENERATING** - Create final report with recommendations

### Setup AI Reports
1. Get OpenAI API key from https://platform.openai.com
2. Set `OPENAI_API_KEY` in `.env`
3. Navigate to "AI Reports" in the dashboard
4. Specify analysis period and type
5. AI generates report with insights

## 🐳 Docker Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker logs -f supply_unlimited_web
docker logs -f supply_unlimited_db

# Run commands in container
docker exec supply_unlimited_web python manage.py <command>
docker exec -it supply_unlimited_db psql -U postgres

# Restart services
docker compose restart

# Remove everything (WARNING: deletes data)
docker compose down -v
```

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Test specific app
python manage.py test users
python manage.py test ai_reports

# Verbose output
python manage.py test -v 2

# With Docker
docker exec supply_unlimited_web python manage.py test
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

## 🐛 Troubleshooting

### Database is empty (No data appears)
**This is normal on first setup!** The database starts completely empty after migrations.

**Solution**: Load sample data (see Step 6 above):
```bash
# With Docker
docker exec supply_unlimited_web python populate_data.py

# Or locally
python populate_data.py
```

After running this, you'll have:
- Companies
- Stores/Locations
- Products
- Inventory/Stock
- Pre-configured AI agents

### Cannot connect to PostgreSQL
```bash
# Check PostgreSQL is running
docker logs supply_unlimited_db

# Verify credentials in .env
# Restart database
docker compose restart db
```

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

### Reset database (⚠️ WARNING - Deletes all data!)
```bash
# With Docker
docker compose down -v
docker compose up -d
docker exec supply_unlimited_web python manage.py migrate
docker exec supply_unlimited_web python populate_data.py

# Without Docker
python manage.py flush --no-input
python manage.py migrate
python populate_data.py
```

### Cache/Cookie Issues
Clear browser cache:
- **Chrome** - Ctrl+Shift+Delete (Cmd+Shift+Delete on macOS)
- **Firefox** - Ctrl+Shift+Delete
- **Safari** - Develop > Empty Web Caches

## 📦 Dependencies

Key Python packages:
- Django 6.0.1
- psycopg2-binary (PostgreSQL adapter)
- djangorestframework (REST API)
- langchain, langgraph (AI/LLM)
- channels, channels-redis (WebSockets)
- pandas (Data analysis)
- reportlab, openpyxl (Report generation)

See [requirements.txt](requirements.txt) for complete list.

## 🤝 Contributing

Contributions are welcome! This is a portfolio project.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit (`git commit -m 'Add YourFeature'`)
5. Push (`git push origin feature/YourFeature`)
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**Rafael Ceotto**
- GitHub: [@rafael-ceotto](https://github.com/rafael-ceotto)
- Portfolio: [https://rafaelceotto.dev](https://rafaelceotto.dev)

## 📞 Support

- **Bug Reports**: [GitHub Issues](https://github.com/rafael-ceotto/Supply-Unlimited/issues)
- **Documentation**: [Wiki](https://github.com/rafael-ceotto/Supply-Unlimited/wiki)

## 🙏 Acknowledgments

- Django community and documentation
- PostgreSQL for reliable data storage
- Chart.js for beautiful visualizations
- Lucide for pixel-perfect icons
- OpenAI for cutting-edge AI capabilities
- Docker for containerization
- Bootstrap 5 for responsive design

---

**Developed with ❤️ as a portfolio project**

**Last Updated**: February 2026
