# Contributing to Supply Unlimited

Thank you for your interest in contributing to Supply Unlimited! This document explains how to set up your development environment and contribute code.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on ideas, not individuals
- Report issues responsibly

---

## Getting Started

### 1. Fork the Repository
Click "Fork" on GitHub to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR-USERNAME/Supply-Unlimited.git
cd supply_unlimited
git remote add upstream https://github.com/rafael-ceotto/Supply-Unlimited.git
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/YourFeatureName
```

Branch naming:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

### 4. Set Up Development Environment
```bash
# With Docker (recommended)
docker compose up -d

# Or without Docker
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 5. Make Changes
- Follow Python PEP 8 style guide
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

### 6. Run Tests
```bash
# With Docker
docker exec supply_unlimited_web python manage.py test

# Without Docker
python manage.py test
```

### 7. Commit Your Changes
```bash
git add .
git commit -m "Descriptive commit message"
```

### 8. Push to Your Fork
```bash
git push origin feature/YourFeatureName
```

### 9. Create a Pull Request
1. Visit https://github.com/rafael-ceotto/Supply-Unlimited
2. Click "New Pull Request"
3. Select your branch
4. Describe your changes
5. Submit!

---

## Development Guidelines

### Code Style
- Follow PEP 8 (Python Enhancement Proposal 8)
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use meaningful variable names

### Git Commits
```bash
# Good
git commit -m "Add inventory search filtering"
git commit -m "Fix warehouse location selection bug"

# Bad
git commit -m "Fixed stuff"
git commit -m "WIP"
```

### Commit Message Format
```
<type>: <short summary>

<longer description if needed>

Closes #123  # If related to issue
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Python Code Example
```python
"""Module docstring - describe what this module does."""

from django.db import models


class ExampleModel(models.Model):
    """Model docstring - describe the model."""
    
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def do_something(self):
        """Method docstring - describe what it does."""
        pass
```

### Comments & Docstrings
```python
# Use English for all comments and docstrings

def calculate_total(items):
    """
    Calculate the total sum of items.
    
    Args:
        items: List of item values
        
    Returns:
        float: Sum of all items
    """
    return sum(items)
```

---

## Testing

### Write Tests for Your Code
```python
# tests/test_models.py
from django.test import TestCase
from users.models import Company


class CompanyModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name="Test Company",
            country="Germany",
            city="Berlin"
        )
    
    def test_company_creation(self):
        self.assertEqual(self.company.name, "Test Company")
    
    def test_company_string_representation(self):
        self.assertEqual(str(self.company), "Test Company")
```

### Run Tests
```bash
# All tests
python manage.py test

# Specific app
python manage.py test users

# Specific test class
python manage.py test users.tests.CompanyModelTest

# Verbose output
python manage.py test -v 2
```

### Test Coverage
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

---

## Documentation

### Update README if you:
- Add new features
- Change configuration
- Modify API endpoints
- Add environment variables

### Documentation Format
```markdown
## Feature Name

### Description
Brief explanation of the feature.

### Usage
```bash
Example code or commands
```

### Configuration
Any required settings.
```

---

## Pull Request Guidelines

### Before Submitting
- [ ] Tests pass (`python manage.py test`)
- [ ] Code follows PEP 8 style
- [ ] Added/updated tests for new features
- [ ] Updated documentation
- [ ] No conflicts with `main` branch

### PR Description Template
```markdown
## Description
Brief explanation of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How to test the changes.

## Screenshots
Add if UI-related.

## Related Issues
Closes #123
```

---

## Common Development Tasks

### Add a New Model
1. Create model in `app/models.py`
2. Add admin registration in `app/admin.py`
3. Create migration: `python manage.py makemigrations`
4. Apply migration: `python manage.py migrate`
5. Write tests in `app/tests.py`

### Add a New API Endpoint
1. Create view in `app/views.py`
2. Create serializer in `app/serializers.py`
3. Register URL in `app/urls.py`
4. Test with curl or Postman
5. Document in README

### Update Database Schema
1. Modify `models.py`
2. Run: `python manage.py makemigrations`
3. Review the migration file
4. Run: `python manage.py migrate`
5. Commit the migration file

---

## Debugging

### Django Debug Toolbar
```bash
pip install django-debug-toolbar
# Add to INSTALLED_APPS in settings.py
```

### Django Shell
```bash
python manage.py shell
>>> from users.models import Company
>>> Company.objects.all()
```

### Database Queries
```python
from django.db import connection
from django.test.utils import CaptureQueriesContext

with CaptureQueriesContext(connection) as qs:
    Company.objects.all()
    print(qs.captured_queries)
```

---

## Issues & Discussions

### Reporting Bugs
1. Check if issue already exists
2. Provide reproduction steps
3. Include error messages
4. Specify Python and Django versions
5. Add screenshots if UI-related

### Feature Requests
1. Explain the use case
2. Describe desired behavior
3. Consider impact on other features
4. Provide examples if possible

---

## Development Workflow Checklist

```
[ ] Fork the repository
[ ] Clone your fork  
[ ] Create feature branch
[ ] Set up development environment
[ ] Make code changes
[ ] Write/update tests
[ ] Run tests locally
[ ] Update documentation
[ ] Commit with clear messages
[ ] Push to your branch
[ ] Create pull request
[ ] Respond to review comments
[ ] Celebrate when merged! 🎉
```

---

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Python PEP 8](https://pep8.org/)
- [Git Guide](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## Questions?

- Open a GitHub discussion
- Create an issue for clarification
- Check existing documentation

---

**Thank you for contributing! Your efforts help make Supply Unlimited better for everyone. 🚀**
