from flask import Blueprint, request, jsonify
from models.testimonial import Testimonial
from extensions import db

testimonial_bp = Blueprint('testimonial', __name__)

@testimonial_bp.route('/api/testimonials', methods=['GET', 'POST'])
def testimonials():
    if request.method == 'POST':
        try:
            data = request.json
            testimonial = Testimonial(
                name=data['name'],
                message=data['message'],
                rating=data['rating']
            )
            db.session.add(testimonial)
            db.session.commit()
            
            return jsonify({
                'status': 'success',
                'message': 'Testimonial added successfully'
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500
    
    # GET request
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'message': t.message,
        'rating': t.rating,
        'created_at': t.created_at.isoformat()
    } for t in testimonials])