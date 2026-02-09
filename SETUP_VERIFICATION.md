# 📋 Setup Checklist & Expected Output

Follow this guide to see what to expect at each step.

---

## ✅ Step 1: Clone Repository

**Command:**
```bash
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited
```

**Expected Output:**
```
Cloning into 'Supply-Unlimited'...
remote: Enumerating objects: XXX, done.
remote: Counting objects: 100% (XXX/XXX), done.
...
```

**What you should see:**
- ✅ `supply_unlimited` folder created
- ✅ All source code files in place
- ✅ `.git` folder (version control)

---

## ✅ Step 2: Environment Setup

**Command:**
```bash
cp .env.example .env
```

**What you should see:**
- ✅ `.env` file created in project root
- ⚠️ Contains default credentials (change if needed for production)

**Optional - Edit credentials:**
```bash
# On Windows
notepad .env

# On macOS/Linux
nano .env
```

---

## ✅ Step 3: Start Docker Containers

**Command:**
```bash
docker compose up -d
```

**Expected Output:**
```
[+] Building 2.4s (15/15)
...
[+] Running 4/4
 ✔ Network supply_unlimited_supply_network  Created
 ✔ Volume supply_unlimited_postgres_data    Created
 ✔ Container supply_unlimited_db            Started
 ✔ Container supply_unlimited_web           Started
```

**What you should see:**
- ✅ PostgreSQL database container starting
- ✅ Django web container starting
- ✅ Creating network and volumes

**Check containers are running:**
```bash
docker ps
```

You should see:
- `supply_unlimited_web` - running on port 8000
- `supply_unlimited_db` - running on port 5432

---

## ✅ Step 4: Run Database Migrations

**Command:**
```bash
docker exec supply_unlimited_web python manage.py migrate
```

**Expected Output:**
```
Migrations loading...
Operations to perform:
  Apply all migrations: admin, auth, ai_reports, users, sales, contenttypes, sessions, ...
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying users.0003_notification... OK
  Applying sales.0002_alter_sale_options... OK
  Applying sessions.0001_initial... OK
Creating superuser...
Superuser created
```

**What you should see:**
- ✅ Database tables being created
- ✅ "OK" for each migration
- ✅ Migrations complete message

**Check database connection:**
```bash
docker logs supply_unlimited_web | tail -5
```

Should show:
```
Connection to db (172.18.0.2) 5432 port [tcp/postgresql] succeeded!
```

---

## ✅ Step 5: Create Superuser (Admin Account)

**Command:**
```bash
docker exec -it supply_unlimited_web python manage.py createsuperuser
```

**You will be prompted:**
```
Username: your_username
Email address: your_email@example.com
Password: ••••••••••
Password (again): ••••••••••
Superuser created successfully.
```

**What to do:**
- Enter a username (e.g., `admin` or your name)
- Enter an email
- Enter a secure password (will be hidden)
- Confirm password

**Keep these credentials safe!** You'll use them to login to the dashboard.

---

## ✅ Step 6: ⭐ Load Sample Data

**Command:**
```bash
docker exec supply_unlimited_web python populate_data.py
```

**Expected Output:**
```
Loading sample data...
Creating companies...
✓ Company 1: Tech Innovations Inc.
✓ Company 2: Global Supplies Ltd.
✓ Company 3: Digital Solutions
✓ Company 4: Enterprise Systems
✓ Company 5: Innovation Labs

Creating stores/locations...
✓ 15 stores created

Creating products...
✓ 50+ products created

Creating inventory...
✓ Inventory records created

Creating AI agents...
✓ AI agents configured

Sample data loaded successfully!
```

**What you should see:**
- ✅ Companies being created
- ✅ Stores/locations being setup
- ✅ Products with details
- ✅ Inventory items
- ✅ AI agent configurations

**This step is CRITICAL!** Without it, the dashboard will be empty.

---

## ✅ Step 7: Access the Application

**Your project is now ready!**

### Dashboard
```
URL: http://localhost:8000
Login with your superuser credentials
```

**You should see:**
- ✅ Login page (clean, modern interface)
- ✅ After login: Dashboard with all data
- ✅ Charts showing sales, inventory, companies
- ✅ Navigation menu with all features

### Admin Interface
```
URL: http://localhost:8000/admin
Same login credentials
```

**You should see:**
- ✅ Django admin panel
- ✅ All models: Companies, Stores, Products, Inventory, Sales, Users, etc.
- ✅ Full data management interface

---

## 🎯 Dashboard Features (After Step 6)

Once logged in, you should see:

### Left Sidebar Navigation
- 🏠 Home/Dashboard
- 🏢 Companies
- 📦 Inventory
- 💰 Sales
- 📊 Reports
- 🤖 AI Reports (if OpenAI key set)

### Main Dashboard
- 📈 Sales Charts (monthly/yearly trends)
- 📊 Inventory Status (low stock alerts)
- 🏪 Store Performance
- 💼 Company Overview
- 👥 User Management

### Sample Data You're Seeing
- **5 Companies** - Different business entities
- **15+ Stores** - Physical locations
- **50+ Products** - Various inventory items
- **Inventory Levels** - Stock by location
- **Sales Data** - Pre-populated transactions
- **AI Agents** - Ready for AI report generation

---

## 🔧 Verification Commands

If anything looks wrong, run these to verify things are working:

### Check Docker containers
```bash
docker ps
```
Should show both `supply_unlimited_web` and `supply_unlimited_db` as "Up"

### Check database
```bash
docker exec supply_unlimited_db psql -U postgres supply_unlimited -c "SELECT COUNT(*) FROM users_company;"
```
Should return `5` (5 companies) or similar number

### Check logs
```bash
docker logs supply_unlimited_web
docker logs supply_unlimited_db
```

### Check if server is responding
```bash
curl http://localhost:8000
```

---

## ❌ Common Issues & Solutions

### Issue: "Cannot connect to database"
```bash
docker compose restart db
docker exec supply_unlimited_web python manage.py migrate
```

### Issue: "populate_data.py not found"
Make sure you're in the project root:
```bash
ls populate_data.py  # Should show the file
```

### Issue: Docker containers not starting
```bash
docker compose down
docker compose up -d --build
```

### Issue: Port 8000 already in use
```bash
docker compose down
# Or, change port in docker-compose.yml and restart
```

### Issue: "Database is empty"
This means you skipped Step 6! Run:
```bash
docker exec supply_unlimited_web python populate_data.py
```

---

## 🎉 Success Indicators

Your setup is complete when:

✅ Docker containers are running (`docker ps`)
✅ Dashboard loads at http://localhost:8000
✅ You can login with your superuser credentials
✅ You see 5 companies in the dashboard
✅ You see products and inventory items
✅ Charts show sales data
✅ Admin panel works at http://localhost:8000/admin

---

## 🛑 To Stop the Project

```bash
docker compose down
```

To completely reset (delete database):
```bash
docker compose down -v
```

---

## 📚 What's Next?

- **Explore the Dashboard**: See your first project live!
- **Add More Data**: Use admin panel to add companies/products
- **Try AI Reports**: Set `OPENAI_API_KEY` in `.env` (optional)
- **Read Documentation**: See README.md for full feature details
- **Customize**: Modify templates, add features, etc.

---

**Once you see the dashboard with data, you're done! 🚀**

For questions, check [README.md](README.md) or [QUICK_START.md](QUICK_START.md)
