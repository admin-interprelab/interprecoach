from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import httpx
import os

app = FastAPI()

# The URL for the transcription function will be injected as an environment variable
TRANSCRIPTION_FUNCTION_URL = os.environ.get("TRANSCRIPTION_FUNCTION_URL")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established.")
    
    if not TRANSCRIPTION_FUNCTION_URL:
        print("Transcription function URL not configured.")
        await websocket.close(code=1011, reason="Server configuration error.")
        return

    try:
        while True:
            data = await websocket.receive_bytes()
            
            # Forward the audio data to the transcription Cloud Function
            async with httpx.AsyncClient() as client:
                try:
                    # Note: Cloud Functions are invoked via POST requests
                    response = await client.post(TRANSCRIPTION_FUNCTION_URL, content=data, headers={"Content-Type": "application/octet-stream"}, timeout=30)
                    response.raise_for_status()
                    transcription_data = response.json()
                    
                    if transcription_data and "transcription" in transcription_data:
                        await websocket.send_json(transcription_data)

                except httpx.RequestError as exc:
                    print(f"Error calling transcription function: {exc}")
                except Exception as e:
                    print(f"An unexpected error occurred: {e}")

    except WebSocketDisconnect:
        print("Client disconnected.")
    except Exception as e:
        print(f"An error occurred in the WebSocket connection: {e}")
