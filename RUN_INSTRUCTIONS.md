# Supply Unlimited - Simple Run Instructions

## What's Essential in This Repository

Everything you see here is **production-ready** and needed for the project to work:

✅ **Django Backend** - Main application logic  
✅ **PostgreSQL Database** - Persistent data storage  
✅ **Sample Data** - `populate_data.py` creates all test data  
✅ **AI Reports** - AI agent integration for analytics  
✅ **RBAC System** - Role-based access control  
✅ **Docker Setup** - Easy containerized deployment  

❌ **Removed** (not essential):
- Test scripts
- Temporary setup files
- Development-only configurations

---

## How to Run (3 Simple Steps)

### Step 1: Start the Application
```bash
docker-compose up -d
docker exec supply_unlimited_web python manage.py migrate
```

### Step 2: Load Sample Data
```bash
docker exec supply_unlimited_web python populate_data.py
```

This automatically:
- ✅ Creates 10 companies, 50 stores
- ✅ Adds 750 inventory items across 610 warehouse locations
- ✅ Sets up permissions for AI Reports
- ✅ Configures 4 AI agents
- ✅ Makes new users automatically get "Analyst" role with AI access

### Step 3: Access Dashboard
```
http://localhost:8000
Click "Register" → Create account → Login → Explore!
```

---

## What Users Will See

After registering and logging in:

| Tab | Features |
|-----|----------|
| **Companies** | 10 companies with ownership %, status, location |
| **Inventory** | 750 items (In Stock/Low Stock/Out-of-stock) + Warehouse view |
| **Analytics** | 4 interactive sales charts by country/category |
| **AI Reports** | Ask questions to AI agents, get instant analysis |

---

## Key Features Working

✅ User registration (auto gets AI access)  
✅ Company management  
✅ Inventory tracking with warehouse locations  
✅ Sales analytics with charts  
✅ AI-powered reports (natural language questions)  
✅ Role-based permissions  
✅ Responsive dashboard  

---

## Database Notes

- Data persists between restarts (in `postgres_data` volume)
- To reset: `docker-compose down -v` then repeat steps 1-2
- **Never** use `docker-compose down -v` unless you want to start fresh

---

## Compare With

- **QUICK_START.md** - Detailed step-by-step walkthrough
- **SETUP_VERIFICATION.md** - Expected output for each step
- **README.md** - Complete project documentation
- **ai_reports/README.md** - AI agent architecture

---

## Troubleshooting

**Port conflict on 8000?**
```bash
docker-compose down
docker-compose up -d
```

**Still questions?**  
Check SETUP_VERIFICATION.md for detailed output examples at each step.
