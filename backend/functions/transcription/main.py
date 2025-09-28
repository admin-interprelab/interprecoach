import functions_framework
from google.cloud import speech

# Initialize the Speech client once globally to be reused across function invocations
speech_client = speech.SpeechClient()

@functions_framework.http
def transcribe_audio(request):
    """
    HTTP Cloud Function to transcribe audio using Google Cloud Speech-to-Text.
    """
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*',
    }

    if request.method != 'POST':
        return ('Method not allowed', 405, headers)

    content = request.get_data()
    if not content:
        return ('No audio content provided.', 400, headers)

    audio = speech.RecognitionAudio(content=content)
    
    # This config should match the audio stream from the client.
    # Using the medical model as specified in the directives.
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
        sample_rate_hertz=48000,
        language_code="en-US",
        model="medical_dictation",
    )

    try:
        response = speech_client.recognize(config=config, audio=audio)
    except Exception as e:
        print(f"Error calling Speech-to-Text API: {e}")
        return ('Failed to process audio.', 500, headers)

    transcription = ""
    if response.results and response.results[0].alternatives:
        transcription = response.results[0].alternatives[0].transcript

    print(f"Transcription: {transcription}")
    
    response_data = {"transcription": transcription, "language_code": "en-US"}
    
    return (response_data, 200, headers)
