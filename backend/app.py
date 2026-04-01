from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras import layers, models

import io

# ---------------------------
# 1. Initialize app
# ---------------------------
app = FastAPI()

# ---------------------------
# 2. Load trained model
# ---------------------------

CLASS_NAMES = ["Fresh", "Rotten"]

model = tf.keras.models.load_model("freshness_model.h5")


def build_model():
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None
    )

    base_model.trainable = False

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(2, activation="softmax")
    ])

    return model

# model = build_model()
# model.load_weights("model.weights.h5")


# ---------------------------
# 3. Image preprocessing
# ---------------------------
def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ---------------------------
# 4. Prediction API
# ---------------------------
@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    input_tensor = preprocess_image(image)
    predictions = model.predict(input_tensor)

    index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][index])

    return {
        "label": CLASS_NAMES[index],
        "confidence": round(confidence * 100, 2)
    }


# py -3.10 -m venv venv
# PS D:\BTECH\IV YEAR\FINAL_PROJECT\FoodExpiryVision\backend> venv\Scripts\activate
#  uvicorn app:app --reload