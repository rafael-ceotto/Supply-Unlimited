# 🚀 Quick Setup Guide - Get Running in 5 Minutes

Copy and paste these commands to get the project running:

## 📋 Prerequisites
- Git installed
- Docker & Docker Compose installed
- About 2-3 minutes

---

## ✅ Step-by-Step Command

```bash
# 1️⃣ Clone the repository
git clone https://github.com/rafael-ceotto/Supply-Unlimited.git
cd supply_unlimited

# 2️⃣ Set up environment configuration
cp .env.example .env

# 3️⃣ Start Docker containers (PostgreSQL + Django)
docker compose up -d

# ⏳ Wait ~10 seconds for containers to start...

# 4️⃣ Run database migrations (creates tables)
docker exec supply_unlimited_web python manage.py migrate

# 5️⃣ Create admin user (superuser)
# Note: Run this and follow the prompts (set username, password, email)
docker exec -it supply_unlimited_web python manage.py createsuperuser

# 6️⃣ ⭐ LOAD SAMPLE DATA (ESSENTIAL!)
# This creates companies, products, inventory, etc.
docker exec supply_unlimited_web python populate_data.py

# ✅ DONE! Your project is ready!
```

---

## 🌐 Access Your Application

After running the commands above:

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
