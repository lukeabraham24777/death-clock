"""
Death Clock Prediction Service

Flask microservice that calculates life expectancy predictions
based on lifestyle questionnaire responses.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict, adjust_for_blood_tests

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "prediction-service"})


@app.route("/predict", methods=["POST"])
def predict_endpoint():
    """
    Calculate life expectancy prediction.

    Expects JSON body:
    {
        "responses": [{"questionId": "...", "answer": "...", "impact": 0}],
        "birth_date": "YYYY-MM-DD"
    }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    responses = data.get("responses", [])
    birth_date = data.get("birth_date", "1990-01-01")

    if not responses:
        return jsonify({"error": "responses array is required"}), 400

    # Validate birth_date format
    try:
        from datetime import datetime

        datetime.strptime(birth_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "birth_date must be YYYY-MM-DD format"}), 400

    result = predict(responses, birth_date)
    return jsonify(result)


@app.route("/adjust", methods=["POST"])
def adjust_endpoint():
    """
    Adjust an existing prediction with blood test data.

    Expects JSON body:
    {
        "prediction": { ... existing prediction ... },
        "hdl": 55,
        "ldl": 120,
        "cholesterol": 190,
        "glucose": 95
    }
    """
    data = request.get_json()

    if not data or "prediction" not in data:
        return jsonify({"error": "prediction object is required"}), 400

    prediction = data["prediction"]
    result = adjust_for_blood_tests(
        prediction,
        hdl=data.get("hdl"),
        ldl=data.get("ldl"),
        cholesterol=data.get("cholesterol"),
        glucose=data.get("glucose"),
    )

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
