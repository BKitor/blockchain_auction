from django.apps import AppConfig
from test_app.blockchain import init_blockchain


class TestAppConfig(AppConfig):
    name = 'test_app'

    def ready(self):
        init_blockchain()
