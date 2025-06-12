import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///chat.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'gulshankumargaurav54@gmail.com'
    MAIL_PASSWORD = 'kvajwuopobmzsobi'  # Your App Password
    MAIL_DEFAULT_SENDER = ('MyAna Contact Form', 'gulshankumargaurav54@gmail.com')
    MAIL_DEBUG = True
    MAIL_USE_SSL = False
    MAIL_MAX_EMAILS = 5
    
    # Verify configuration
    if not MAIL_PASSWORD:
        raise ValueError("GMAIL_APP_PASSWORD not set in .env file")