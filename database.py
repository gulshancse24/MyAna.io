from app import create_app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
def init_db():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        # Add default testimonials if none exist
        if not Testimonial.query.first():
            default_testimonials = [
                {
                    'name': 'John Doe',
                    'message': 'Amazing AI chat experience! The responses are incredibly natural.',
                    'rating': 5
                },
                {
                    'name': 'Sarah Smith',
                    'message': 'Really impressed with the quick responses and helpful features.',
                    'rating': 4
                }
            ]
            
            for t in default_testimonials:
                testimonial = Testimonial(**t)
                db.session.add(testimonial)
            
            db.session.commit()
            print("Default testimonials added successfully!")

if __name__ == '__main__':
    init_db()