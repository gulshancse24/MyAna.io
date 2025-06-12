from flask import Blueprint, request, jsonify
from utils.chat_handler import ChatHandler, logger

chat_bp = Blueprint('chat', __name__)
chat_handler = ChatHandler()

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        logger.debug(f"Received request data: {data}")
        
        user_message = data.get('message', '')
        if not user_message:
            return jsonify({
                'status': 'error',
                'message': 'Message is required'
            }), 400
        
        response = chat_handler.get_response(user_message)
        logger.debug(f"Generated response: {response}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in chat route: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500