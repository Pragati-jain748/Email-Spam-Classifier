from fastapi import FastAPI
import joblib
from pydantic import BaseModel
import nltk
import string
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')


ps = PorterStemmer()
app = FastAPI()

@app.get('/')
def home():
    return {"message": "Welcome to the ML API!"}


model = joblib.load('Logistic_Regression_email.pkl')
vectorizer = joblib.load('vectorizer.pkl')

class EmailRequest(BaseModel):
    email:str

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)
    y = []
    for word in text:
        if word.isalnum():
            y.append(word)

    text = y.copy()
    y.clear()
    for word in text:
        if word not in stopwords.words("english") and word not in string.punctuation:
            y.append(word)

    text = y.copy()
    y.clear()
    for word in text:
        y.append(ps.stem(word))

    return " ".join(y)

@app.post('/predict')
def predict_email(request: EmailRequest):
     email = request.email
     processed_email = transform_text(email)
     vectorize_email = vectorizer.transform([processed_email])
     prediction = model.predict(vectorize_email)
     confidence = model.predict_proba(vectorize_email).max() * 100
     
     return {
    "prediction": "Spam" if prediction[0] == 1 else "Ham",
    "confidence": round(confidence, 2)
}
     

