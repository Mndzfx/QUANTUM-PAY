from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from joblib import load
import numpy as np
import csv
from datetime import datetime
from fastapi.responses import JSONResponse

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="Fraud Detection API",
    description="API untuk memprediksi apakah transaksi aman atau mencurigakan.",
    version="0.1.0"
)

# Setup CORS middleware agar frontend bisa mengakses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <- disesuaikan dengan port frontend kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = load("model.pkl")

# Schema input dari frontend
class TxData(BaseModel):
    amount: float
    is_foreign: int
    is_large_transaction: int
    tx_time: int
    user_history_score: float

# Fungsi log transaksi
def log_transaction(data: TxData, status: str, prediction: int, confidence: float):
    filename = "transaction_log.csv"
    file_exists = False
    try:
        with open(filename, mode='r', newline='') as f:
            file_exists = True
    except FileNotFoundError:
        file_exists = False

    transaction_data = [
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        data.amount,
        data.is_foreign,
        data.is_large_transaction,
        data.tx_time,
        data.user_history_score,
        status,
        prediction,
        confidence
    ]

    with open(filename, mode='a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow([
                "timestamp", "amount", "is_foreign", "is_large_transaction",
                "tx_time", "user_history_score", "status", "prediction", "confidence"
            ])
        writer.writerow(transaction_data)

# Endpoint prediksi
@app.post("/predict")
def predict_transaction(data: TxData):
    features = np.array([[
        data.amount,
        data.is_foreign,
        data.is_large_transaction,
        data.tx_time,
        data.user_history_score
    ]])

    prediction = model.predict(features)[0]

    if hasattr(model, "predict_proba"):
        probas = model.predict_proba(features)[0]
        confidence = round(max(probas), 2)
    else:
        confidence = None

    status = "Transaksi Aman" if prediction == 0 else "Transaksi Mencurigakan"
    log_transaction(data, status, int(prediction), confidence)

    return {
        "status": status,
        "prediction": int(prediction),
        "confidence": confidence
    }

# Endpoint untuk melihat log transaksi
@app.get("/logs")
def get_logs():
    try:
        with open("transaction_log.csv", mode="r") as file:
            csv_reader = csv.DictReader(file)
            logs = [row for row in csv_reader]
        return JSONResponse(content=logs)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error reading log file: {str(e)}"})