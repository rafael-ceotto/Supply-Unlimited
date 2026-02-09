# 🚀 Quick Setup Guide - Get Running in 5 Minutes

Copy and paste these commands to get the project running with sample data.

## 📋 Prerequisites
- Git installed
- Docker & Docker Compose installed
- ~3 minutes setup time

---

## ✅ Step-by-Step

```bash
# 1️⃣ Clone the repository
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited

# 2️⃣ Start Docker containers (PostgreSQL + Django)
docker-compose up -d

# ⏳ Wait ~10 seconds for containers to be ready...

# 3️⃣ Run database migrations
docker exec supply_unlimited_web python manage.py migrate

# 4️⃣ ⭐ LOAD SAMPLE DATA (Essential for testing)
# Creates: 10 companies, 50 stores, 50 products, 750 inventory records, AI roles & permissions
docker exec supply_unlimited_web python populate_data.py

# ✅ DONE! Your application is ready!
```

---

## 🌐 Access Your Application

**Dashboard:** http://localhost:8000

### Getting Started:

1. **Click "Register"** to create your account
   - Username, First Name, Last Name, Email, Password
2. **Click "Login"** with your new credentials
3. **Explore these tabs:**
   - 📊 **Companies** - View all 10 companies with details
   - 📦 **Inventory** - Browse 750 products, see status, click "View Warehouse" for exact location
   - 📈 **Analytics** - See interactive sales charts
   - 🤖 **AI Reports** - Ask questions in natural language to AI agents

### Admin Panel:
**URL:** http://localhost:8000/admin  
**User:** Use the superuser credentials you create with `createsuperuser` (optional)

---

## 📝 Sample Data Includes:

✅ 10 Companies (Tech Innovations, Global Supplies, Digital Solutions, etc.)  
✅ 50 Stores across 5 locations per company  
✅ 50 Products (cables, keyboards, monitors, etc. - $9.99 to $99.99)  
✅ 750 Inventory Records (20% out-of-stock, 30% low-stock, 50% in-stock)  
✅ 50 Warehouses with 610 warehouse locations  
✅ 4 AI Agents (GPT-4, Claude, Llama, Mistral)  
✅ RBAC Permissions configured automatically  

---

## 🤖 Try AI Reports Examples

In the AI Reports tab, ask questions like:
- "Analyze inventory by country"
- "Show me top selling products"
- "What's the supply chain risk"
- "Compare sales by region"
- "Inventory turnover analysis"

---

## 🛑 Stop the Application

```bash
docker-compose down
```

**Note:** Your data persists. Use `docker-compose down -v` only to completely reset (not recommended).

---

## ❓ Troubleshooting

**Error: "Address already in use"**
```bash
docker-compose down
docker-compose up -d
```

**Blank dashboard:**  
Clear browser cache (Ctrl+Shift+Delete) and refresh (Ctrl+F5)

**Permission errors when registering:**  
This is automatically fixed by `populate_data.py` - run it again if needed

---

## 📚 Documentation

- Full setup: [README.md](README.md)
- Verify installation: [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md)
- Full API docs: [AI Reports README](ai_reports/README.md)

| URL | Purpose | Login |
|-----|---------|-------|
| **http://localhost:8000** | 📊 Dashboard | Username/Password you created |
| **http://localhost:8000/admin** | 🔧 Admin Panel | Same credentials |

---

## 🔑 Default Test Credentials

After running `populate_data.py`, you can test with:
- **Admin URL**: http://localhost:8000/admin
- **Username**: Your created superuser
- **Password**: Your created password

---

## ❓ Troubleshooting

### Docker containers won't start?
```bash
docker compose down
docker compose up -d
```

### Database needs reset?
```bash
docker compose down -v          # -v removes database volume
docker compose up -d
docker exec supply_unlimited_web python manage.py migrate
docker exec supply_unlimited_web python populate_data.py
```

### Container errors?
```bash
docker logs supply_unlimited_web
docker logs supply_unlimited_db
```

### Permission denied on superuser?
Use `-it` flag (already in step 5 above):
```bash
docker exec -it supply_unlimited_web python manage.py createsuperuser
```

---

## 🎯 What You Get

After running all steps, the project includes:

✅ **5 Sample Companies**
✅ **Multiple Store Locations**
✅ **50+ Products**
✅ **Inventory by Location**
✅ **User Management System**
✅ **AI Reports Feature** (requires OpenAI API key)
✅ **Sales Analytics Dashboard**
✅ **Admin Interface**

---

## 📚 Next Steps

- **Dashboard**: http://localhost:8000 - See all data visually
- **Admin**: http://localhost:8000/admin - Manage data
- **AI Reports** (optional): Set `OPENAI_API_KEY` in `.env` and try AI features
- **Detailed Docs**: See README.md for full documentation

---

## ⏹️ Stop the Project

When done:
```bash
docker compose down
```

To completely reset (deletes database):
```bash
docker compose down -v
```

---

**That's it! Your Supply Unlimited project is now running!** 🎉

For more details, see [README.md](README.md) or [CONTRIBUTING.md](documentation/CONTRIBUTING.md)
