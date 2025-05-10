"""
ASGI config for test1server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from dotenv import load_dotenv
from pathlib import Path

from django.core.asgi import get_asgi_application

dotenv_path = Path(__file__).resolve().parent.parent / '.envbackend'
load_dotenv(dotenv_path=dotenv_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'test1server.settings')

application = get_asgi_application()
