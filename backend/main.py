from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from collections import deque
import numpy as np
import cv2
import io
from PIL import Image
import base64
import uvicorn

from app import process_image, HISTORY_LENGTH

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow CORS for specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Shared state
point_history = deque(maxlen=HISTORY_LENGTH)
finger_gesture_history = deque(maxlen=HISTORY_LENGTH)

@app.get("/")
async def root():
    print("ROOT")
    return {"message": "Hand Gesture Classification API"}

@app.post("/classify/")
async def classify_image(file: UploadFile = File(...)):
    print("Received file", file.filename, file.content_type)

    # Read image file into OpenCV format
    contents = await file.read()
    print("File size: ", len(contents))
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    # Process image to get debug output
    debug_image, hand_sign_label, finger_gesture_label, handedness  = process_image(image, point_history, finger_gesture_history)

    # Encode the debug image to PNG for streaming response
    _, buffer = cv2.imencode(".png", cv2.cvtColor(debug_image, cv2.COLOR_RGB2BGR))
    image_base64 = base64.b64encode(buffer).decode("utf-8")
    # return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")

    return JSONResponse(content={
        "image": image_base64,
        "hand_sign_label": hand_sign_label or "None",
        "finger_gesture_label": finger_gesture_label or "None",
        "handedness": handedness or "None"
    })

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)  # Listen on all network interfaces
    uvicorn.run(app, host="172.23.27.203", port=8000)
