from models.learning import Conversation, LearningPattern, DebugLog
from extensions import db
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class LearningHandler:
    def __init__(self):
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
            nltk.download('popular', quiet=True)
        except Exception as e:
            print(f"Error downloading NLTK data: {e}")
        self.vectorizer = TfidfVectorizer()
        
    def store_conversation(self, user_input, ana_response):
        try:
            conversation = Conversation(
                user_input=user_input,
                ana_response=ana_response
            )
            db.session.add(conversation)
            db.session.commit()
            
            # Analyze for patterns
            self.analyze_pattern(conversation)
            
        except Exception as e:
            self.log_error("store_conversation", str(e), {
                "user_input": user_input,
                "ana_response": ana_response
            })
    
    def analyze_pattern(self, conversation):
        try:
            # Tokenize and process input
            tokens = word_tokenize(conversation.user_input.lower())
            stop_words = set(stopwords.words('english'))
            tokens = [t for t in tokens if t not in stop_words]
            
            # Look for similar patterns
            patterns = LearningPattern.query.all()
            for pattern in patterns:
                similarity = self.calculate_similarity(
                    " ".join(tokens),
                    pattern.pattern
                )
                if similarity > 0.8:  # High similarity threshold
                    pattern.success_count += 1
                    db.session.commit()
                    return
                    
            # Create new pattern if none found
            new_pattern = LearningPattern(
                pattern=conversation.user_input,
                response_template=conversation.ana_response,
                success_count=1
            )
            db.session.add(new_pattern)
            db.session.commit()
            
        except Exception as e:
            self.log_error("analyze_pattern", str(e), {
                "conversation_id": conversation.id
            })
    
    def find_best_response(self, user_input):
        try:
            # Find similar patterns
            patterns = LearningPattern.query.all()
            if not patterns:
                return None
                
            similarities = []
            for pattern in patterns:
                similarity = self.calculate_similarity(
                    user_input,
                    pattern.pattern
                )
                similarities.append((similarity, pattern))
            
            # Get best match
            best_match = max(similarities, key=lambda x: x[0])
            if best_match[0] > 0.7:  # Confidence threshold
                pattern = best_match[1]
                pattern.success_count += 1
                db.session.commit()
                return pattern.response_template
                
            return None
            
        except Exception as e:
            self.log_error("find_best_response", str(e), {
                "user_input": user_input
            })
            return None
    
    def calculate_similarity(self, text1, text2):
        try:
            tfidf = self.vectorizer.fit_transform([text1, text2])
            return cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        except Exception:
            return 0
    
    def log_error(self, error_type, error_message, context):
        debug_log = DebugLog(
            error_type=error_type,
            error_message=error_message,
            context=str(context)
        )
        db.session.add(debug_log)
        db.session.commit()