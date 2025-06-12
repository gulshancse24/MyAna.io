from flask_mail import Mail, Message
from flask import current_app
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

mail = Mail()

def send_contact_email(form_data):
    try:
        # Log configuration for debugging
        logger.debug(f"Mail username: {current_app.config['MAIL_USERNAME']}")
        logger.debug(f"Mail server: {current_app.config['MAIL_SERVER']}")
        logger.debug(f"Mail port: {current_app.config['MAIL_PORT']}")
        
        msg = Message(
            subject=f"Ana Contact Form Message: {form_data['subject']}",
            recipients=['gulshankumargaurav54@gmail.com'],
            reply_to=form_data['email']
        )
        
        msg.html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #4a90e2;">Ana Contact Form Message</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                <p><strong>From:</strong> {form_data['name']}</p>
                <p><strong>Email:</strong> {form_data['email']}</p>
                <p><strong>Subject:</strong> {form_data['subject']}</p>
                <hr style="border: 1px solid #ddd;">
                <div style="margin-top: 15px;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-line;">{form_data['message']}</p>
                </div>
            </div>
        </div>
        """
        
        mail.send(msg)
        logger.info('Email sent successfully')
        return True
        
    except Exception as e:
        logger.error(f'Error sending email: {str(e)}')
        return False