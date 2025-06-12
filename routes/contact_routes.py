import logging
from flask import Blueprint, request, jsonify
from utils.email_handler import send_contact_email

logger = logging.getLogger(__name__)
contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        logger.debug(f"Received contact form data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        if not all(field in data for field in required_fields):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400

        # Send email
        if send_contact_email(data):
            return jsonify({
                'status': 'success',
                'message': 'Message sent successfully!'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to send message. Please try again.'
            }), 500

    except Exception as e:
        logger.error(f"Error in contact route: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }), 500

@contact_bp.route('/api/test-email')
def test_email():
    try:
        test_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'subject': 'Test Email',
            'message': 'This is a test email to verify the configuration.'
        }
        
        if send_contact_email(test_data):
            return jsonify({
                'status': 'success',
                'message': 'Test email sent successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to send test email'
            }), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500