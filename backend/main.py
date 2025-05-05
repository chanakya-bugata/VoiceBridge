from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from google.cloud import translate_v2 as translate
import os
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set Google Cloud credentials
GOOGLE_CREDENTIALS = os.environ.get('GOOGLE_CREDENTIALS')
if GOOGLE_CREDENTIALS:
    # For production: Use credentials from environment variable
    credentials_dict = json.loads(GOOGLE_CREDENTIALS)
    # Write the credentials to a temporary file
    credentials_path = '/tmp/google-credentials.json'
    with open(credentials_path, 'w') as f:
        json.dump(credentials_dict, f)
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
else:
    # For local development: Use the credentials file
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 
        'speech-text-speech-458721-c0f451d72fc4.json'
    )

app = FastAPI(title="VoiceBridge API")

# TEMPORARY CORS FIX - For debugging only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

class TranslationRequest(BaseModel):
    text: str
    source_lang: str = None
    target_lang: str

@app.get("/")
async def root():
    return {"message": "Welcome to VoiceBridge API"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file to text
    """
    try:
        logger.info(f"Received audio file: {file.filename}")
        return {"text": "Sample transcription", "language": "en"}
    except Exception as e:
        logger.error(f"Error in transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    """
    Translate text from source language to target language
    """
    try:
        logger.info(f"Translation request: {request}")
        print("RAW REQUEST:", request)
        print("source_lang:", request.source_lang)
        print("target_lang:", request.target_lang)

        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        if not request.target_lang:
            raise HTTPException(status_code=400, detail="Target language must be specified")
        if request.source_lang and request.source_lang == request.target_lang:
            return {
                "translated_text": request.text,
                "source_lang": request.source_lang,
                "target_lang": request.target_lang
            }

        # Use Google Cloud Translate
        client = translate.Client()
        result = client.translate(
            request.text,
            target_language=request.target_lang
        )
        translated_text = result["translatedText"]
        detected_source = result.get("detectedSourceLanguage", request.source_lang)

        logger.info(f"Translation completed: {translated_text}")
        return {
            "translated_text": translated_text,
            "source_lang": detected_source,
            "target_lang": request.target_lang
        }

    except HTTPException as he:
        logger.error(f"HTTP error in translation: {str(he)}")
        raise
    except Exception as e:
        logger.error(f"Error in translation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/languages")
async def get_supported_languages():
    try:
        languages = [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "it", "name": "Italian"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "ru", "name": "Russian"},
            {"code": "zh", "name": "Chinese"},
            {"code": "ja", "name": "Japanese"},
            {"code": "ko", "name": "Korean"}
        ]
        return {"languages": languages}
    except Exception as e:
        logger.error(f"Error fetching languages: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
