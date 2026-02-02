from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'
    
    def ready(self):
        """
        Import signals when the app is ready to ensure they are registered.
        """
        import users.signals  # noqa: F401
