from extensions import db
from datetime import datetime

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    ana_response = db.Column(db.Text, nullable=False)
    feedback_score = db.Column(db.Integer, default=0)  # User feedback score
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50))  # Categorize conversations
    
class LearningPattern(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pattern = db.Column(db.Text, nullable=False)  # Identified pattern
    response_template = db.Column(db.Text, nullable=False)  # Template response
    success_count = db.Column(db.Integer, default=0)  # Times pattern worked well
    fail_count = db.Column(db.Integer, default=0)  # Times pattern failed
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
class DebugLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    error_type = db.Column(db.String(100))
    error_message = db.Column(db.Text)
    context = db.Column(db.Text)  # What was happening when error occurred
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved = db.Column(db.Boolean, default=False)