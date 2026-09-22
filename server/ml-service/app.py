import os

import joblib

from fastapi import FastAPI
from pydantic import BaseModel


# ==================================================
# MODEL PATH
# ==================================================

MODEL_PATH = os.path.join(
    "model",
    "fraud_model.joblib"
)


# ==================================================
# FASTAPI APP
# ==================================================

app = FastAPI(
    title="CareerShield ML Service",
    description="Fraud detection service for CareerShield",
    version="1.0.0",
)


# ==================================================
# MODEL
# ==================================================

model = None


# ==================================================
# REQUEST MODEL
# ==================================================

class PredictionRequest(BaseModel):
    description: str


# ==================================================
# LOAD MODEL
# ==================================================

def load_model():
    global model

    if not os.path.exists(MODEL_PATH):
        print(
            f"WARNING: Model file not found: {MODEL_PATH}"
        )

        return

    try:
        model = joblib.load(
            MODEL_PATH
        )

        print(
            "CareerShield ML model loaded successfully."
        )

    except Exception as error:
        print(
            "MODEL LOAD ERROR:",
            error
        )

        model = None


# ==================================================
# STARTUP
# ==================================================

@app.on_event("startup")
def startup_event():
    load_model()


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():
    return {
        "service": "CareerShield ML Service",
        "status": "running",
        "model_loaded": model is not None,
    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


# ==================================================
# PREDICTION
# ==================================================

@app.post("/predict")
def predict(
    request: PredictionRequest
):
    # ----------------------------------------------
    # Check model
    # ----------------------------------------------

    if model is None:
        return {
            "status": "NOT_EVALUATED",
            "fraud_probability": None,
            "message": (
                "ML model is not loaded."
            ),
        }


    # ----------------------------------------------
    # Check description
    # ----------------------------------------------

    description = (
        request.description.strip()
    )

    if not description:
        return {
            "status": "NOT_EVALUATED",
            "fraud_probability": None,
            "message": (
                "Opportunity description is empty."
            ),
        }


    # ----------------------------------------------
    # Predict probability
    # ----------------------------------------------

    try:
        probabilities = model.predict_proba(
            [description]
        )[0]

        classes = model.classes_

    except Exception as error:

        print(
            "PREDICTION ERROR:",
            error
        )

        return {
            "status": "NOT_EVALUATED",
            "fraud_probability": None,
            "message": (
                "Unable to generate prediction."
            ),
        }


    # ----------------------------------------------
    # Find probability of class 1
    # ----------------------------------------------

    fraud_probability = 0.0

    for index, class_value in enumerate(
        classes
    ):
        if int(class_value) == 1:
            fraud_probability = float(
                probabilities[index]
            )
            break


    # ----------------------------------------------
    # Final response
    # ----------------------------------------------

    return {
        "status": "PASS",

        "fraud_probability": round(
            fraud_probability,
            4
        ),

        "model":
            "TF-IDF + Logistic Regression",
    }