from flask import Flask, render_template, request
from config import Config
from extensions import db
from routes.testimonial_routes import testimonial_bp
from routes.contact_routes import contact_bp
from routes.chat_routes import chat_bp
from datetime import datetime
from utils.exceptions import ConnectionTerminated, PathNotFound

def create_app():
    app = Flask(__name__)
    
    # Ignore Chrome DevTools requests
    @app.before_request
    def ignore_chrome_devtools():
        if request.path.startswith('/.well-known/appspecific'):
            return '', 404
            
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Main routes
    @app.route('/')
    def home():
        return render_template('home.html')
        
    @app.route('/chat')
    def chat():
        return render_template('chat.html', now=datetime.now())
        
    @app.route('/about')
    def about():
        return render_template('about.html')
        
    @app.route('/contact')
    def contact():
        return render_template('contact.html')
        
    @app.route('/privacy')
    def privacy():
        return render_template('privacy.html')
        
    @app.route('/terms')
    def terms():
        return render_template('terms.html')
    
    @app.route('/test-625')
    def test_connection_error():
        raise ConnectionTerminated()

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('625.html', 
            error_code=625,
            error_name='Path Not Found',
            error_description='The requested path could not be found. Please check the URL and try again.'
        ), 625

    @app.errorhandler(ConnectionTerminated)
    def handle_connection_terminated(error):
        return render_template('625.html', 
            error_code=error.code,
            error_name=error.name,
            error_description=error.description
        ), error.code
    
    # Register blueprints
    app.register_blueprint(testimonial_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(chat_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
