from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from collections import deque
import numpy as np
import cv2
import io

from app import process_image, HISTORY_LENGTH

app = FastAPI()

# Shared state
point_history = deque(maxlen=HISTORY_LENGTH)
finger_gesture_history = deque(maxlen=HISTORY_LENGTH)

@app.get("/")
async def root():
    return {"message": "Hand Gesture Classification API"}

@app.post("/classify/")
async def classify_image(file: UploadFile = File(...)):
    # Read image file into OpenCV format
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Process image to get debug output
    debug_image, hand_sign_label, finger_gesture_label  = process_image(image, point_history, finger_gesture_history)

    # Encode the debug image to JPEG for streaming response
    _, buffer = cv2.imencode(".jpg", cv2.cvtColor(debug_image, cv2.COLOR_RGB2BGR))
    return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")
