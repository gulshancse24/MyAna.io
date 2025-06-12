import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging
import asyncio
from concurrent.futures import TimeoutError

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ChatHandler:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found")

        genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel(
            'gemini-2.0-flash',
            generation_config={
                'temperature': 0.7,
                'top_p': 0.8,
                'top_k': 40,
                'max_output_tokens': 2048,
            }
        )
        
        self.initialize_chat()
        
    def initialize_chat(self, max_retries=3):
        for attempt in range(max_retries):
            try:
                self.chat = self.model.start_chat(history=[])
                # Set Ana's personality
                self.chat.send_message(
                    "You are Ana, a friendly AI assistant created by Team MyAna. " +
                    "Be engaging, use emojis naturally, and maintain conversations professionally."
                )
                return
            except Exception as e:
                logger.error(f"Chat initialization attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    raise
                asyncio.sleep(1)

    async def get_response_with_timeout(self, user_input):
        try:
            response = self.chat.send_message(user_input)
            return response
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise

    def get_response(self, user_input):
        max_retries = 3
        for attempt in range(max_retries):
            try:
                logger.debug(f"Processing message: {user_input}")
                
                if not user_input or not user_input.strip():
                    return {
                        'status': 'error',
                        'message': "I didn't catch that. Could you please try again? 😊"
                    }

                # Create event loop for async operation
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                # Run response generation with timeout
                try:
                    response = loop.run_until_complete(
                        asyncio.wait_for(
                            self.get_response_with_timeout(user_input),
                            timeout=30.0
                        )
                    )
                finally:
                    loop.close()

                if not response or not response.text:
                    raise ValueError("Empty response received")

                formatted_response = self.format_response(response.text)
                logger.debug(f"Response generated: {formatted_response}")
                
                return {
                    'status': 'success',
                    'message': formatted_response
                }

            except TimeoutError:
                logger.error(f"Response generation attempt {attempt + 1} timed out")
                if attempt == max_retries - 1:
                    return {
                        'status': 'error',
                        'message': "I'm taking too long to respond. Let's try again! 🕒"
                    }
                asyncio.sleep(1)
                self.initialize_chat()
                
            except Exception as e:
                logger.error(f"Response generation attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    return {
                        'status': 'error',
                        'message': "I'm having trouble processing that right now. Let's try again! 💫"
                    }
                asyncio.sleep(1)
                self.initialize_chat()

    def format_response(self, text):
        return f"""
{text}

"""