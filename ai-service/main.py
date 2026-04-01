# from fastapi import FastAPI, File, UploadFile
# import numpy as np
# from PIL import Image
# import tensorflow as tf
# import io

# app = FastAPI()

# # ✅ Load your trained model
# model = tf.keras.models.load_model("freshness_model.h5",
#     compile=False)
# # model = tf.keras.models.load_model("freshness_model.keras")
# # model = tf.keras.models.load_model(
# #     "freshness_model.keras",
# #     compile=False
# # )

# def preprocess(image):
#     image = image.resize((224, 224))
#     image = np.array(image) / 255.0
#     image = np.expand_dims(image, axis=0)
#     return image

# @app.get("/")
# def home():
#     return {"message": "AI Service Running"}

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     image_bytes = await file.read()
#     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

#     processed = preprocess(image)
#     prediction = model.predict(processed)[0][0]

#     label = "Fresh" if prediction > 0.5 else "Rotten"

#     return {
#         "freshness_score": float(prediction),
#         "label": label
#     }


from fastapi import FastAPI, File, UploadFile
import numpy as np
from PIL import Image
import tensorflow as tf
import io

# 🔥 ADD THESE IMPORTS
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

app = FastAPI()

@app.on_event("startup")
def startup_event():
    print("\n🚀 AI Server Ready!")
    print("👉 Open in browser: http://127.0.0.1:8000/docs\n")

# 🔥 REBUILD SAME MODEL ARCHITECTURE
base_model = MobileNetV2(weights='imagenet', include_top=False)

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# 🔥 LOAD ONLY WEIGHTS (IMPORTANT)
model.load_weights("freshness_model.h5")


def preprocess(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    processed = preprocess(image)
    prediction = model.predict(processed)[0][0]

    label = "Fresh" if prediction > 0.5 else "Rotten"

    return {
        "freshness_score": float(prediction),
        "label": label
    }