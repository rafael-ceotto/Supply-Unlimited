# Development Tools & Scripts

This folder contains development, testing, and administrative scripts for the Supply Unlimited project. These files are NOT part of the production deployment.

## Scripts Included

### Data Management
- `populate_data.py` - Populate database with sample data
- `full_populate.py` - Full dataset population with all models
- `simple_populate.py` - Simple populate script

### Verification & Testing
- `test_sales_api.py` - Test sales API endpoints
- `test_agent.py` - Test AI agent functionality
- `verification_final.py` - Final verification checks
- `analyze_data.py` - Data analysis utilities

### Database Checking
- `check_db.py` - Check database integrity
- `check_inventory.py` - Verify inventory consistency
- `check_ai_permissions.py` - Check AI feature permissions
- `final_summary.py` - Print system summary

## Utilities
- `create_templates.py` - Create HTML templates
- `setup_supply_unlimited.py` - Initial setup helper
- `install_supply_unlimited.py` - Installation script

## Documentation (Development)
- `INVENTORY_FIX.md` - Inventory troubleshooting
- `TROUBLESHOOTING_SETTINGS.md` - Settings issues
- `TEST_SETTINGS.py` - Test configuration

## Running Development Scripts

These scripts are meant for local development only:

```bash
# With Docker
docker exec supply_unlimited_web python dev_tools/populate_data.py

# Without Docker
cd dev_tools/
python populate_data.py
```

## Notes

- Scripts in this folder are excluded from git (see `.gitignore`)
- Use these for local testing, debugging, and development
- Never commit changes to these files for production
- Always backup your database before running population scripts
- Some scripts may modify your database - use caution!

## Environment

When running these scripts locally:
1. Ensure `.env` is properly configured
2. Database must be running (Docker container or local PostgreSQL)
3. Virtual environment should be activated
4. Django settings should be properly configured

## Development Workflow

```bash
# Start fresh
python dev_tools/populate_data.py

# Test specific functionality
python dev_tools/test_sales_api.py

# Verify setup
python dev_tools/check_db.py
python dev_tools/check_inventory.py

# Analyze data
python dev_tools/analyze_data.py
```

---

**Important**: These development tools are for administrative and troubleshooting purposes only. The main application code is in the root directory.
