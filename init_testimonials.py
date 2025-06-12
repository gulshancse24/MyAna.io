from app import create_app
from extensions import db
from models.testimonial import Testimonial
from datetime import datetime, UTC  # Update import to include UTC

def init_testimonials():
    app = create_app()
    
    with app.app_context():
        try:
            # Clear existing testimonials
            Testimonial.query.delete()
            
            # Add sample testimonials
            testimonials = [
                {
                    'name': 'Sarah Johnson',
                    'message': 'MyAna has been incredibly helpful! The responses are quick and accurate.',
                    'rating': 5,
                    'created_at': datetime.now(UTC)  # Updated to use timezone-aware datetime
                },
                {
                    'name': 'Michael Chen',
                    'message': 'Great AI assistant. Helps me with various tasks throughout the day.',
                    'rating': 4,
                    'created_at': datetime.now(UTC)
                },
                {
                    'name': 'Emma Wilson',
                    'message': 'The natural conversation flow makes it feel like chatting with a real person.',
                    'rating': 5,
                    'created_at': datetime.now(UTC)
                }
            ]
            
            for t in testimonials:
                testimonial = Testimonial(**t)
                db.session.add(testimonial)
            
            db.session.commit()
            print('Sample testimonials initialized successfully!')
            
        except Exception as e:
            print(f'Error initializing testimonials: {e}')
            db.session.rollback()

if __name__ == '__main__':
    init_testimonials()