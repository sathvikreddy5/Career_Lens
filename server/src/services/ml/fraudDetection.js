const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const analyzeWithML = async ({ description = "" }) => {
  if (!description.trim()) {
    return {
      status: "NOT_EVALUATED",
      fraudProbability: null,
      message: "No opportunity description was provided.",
    };
  }

  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        description: description.trim(),
      }),

      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        status: "NOT_EVALUATED",

        fraudProbability: null,

        message: "The ML fraud detection service is currently unavailable.",
      };
    }

    const data = await response.json();

    const probability = Number(data.fraud_probability ?? data.fraudProbability);

    if (!Number.isFinite(probability)) {
      return {
        status: "NOT_EVALUATED",

        fraudProbability: null,

        message: "The ML service returned an invalid prediction.",
      };
    }

    const normalizedProbability =
      probability > 1 ? probability / 100 : probability;

    return {
      status: "PASS",

      fraudProbability: Number(
        Math.max(0, Math.min(1, normalizedProbability)).toFixed(4),
      ),

      model: data.model || "CareerShield ML model",

      message: "The opportunity was analyzed using the fraud detection model.",
    };
  } catch (error) {
    console.error("ML FRAUD DETECTION ERROR:", error.message);

    return {
      status: "NOT_EVALUATED",

      fraudProbability: null,

      message: "ML fraud analysis could not be completed.",
    };
  }
};
