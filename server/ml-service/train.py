import os

import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


DATA_PATH = os.path.join(
    "data",
    "fake_job_postings.csv"
)

MODEL_DIR = "model"

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "fraud_model.joblib"
)


def main():
    # ==================================================
    # CHECK DATASET
    # ==================================================

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    print(
        f"Loading dataset from: {DATA_PATH}"
    )

    df = pd.read_csv(DATA_PATH)

    print(
        f"Dataset loaded: {len(df)} rows"
    )

    print(
        "Columns:",
        df.columns.tolist()
    )


    # ==================================================
    # REQUIRED COLUMNS
    # ==================================================

    text_columns = [
        "title",
        "company_profile",
        "description",
        "requirements",
        "benefits",
        "location",
    ]

    available_columns = [
        column
        for column in text_columns
        if column in df.columns
    ]

    if not available_columns:
        raise ValueError(
            "No expected text columns were found in the dataset."
        )

    if "fraudulent" not in df.columns:
        raise ValueError(
            "The dataset must contain a 'fraudulent' column."
        )


    # ==================================================
    # COMBINE TEXT
    # ==================================================

    df[available_columns] = (
        df[available_columns]
        .fillna("")
        .astype(str)
    )

    df["combined_text"] = (
        df[available_columns]
        .agg(" ".join, axis=1)
        .str.strip()
    )


    # ==================================================
    # CLEAN TARGET
    # ==================================================

    df["fraudulent"] = pd.to_numeric(
        df["fraudulent"],
        errors="coerce"
    )

    df = df.dropna(
        subset=[
            "combined_text",
            "fraudulent",
        ]
    )

    df = df[
        df["combined_text"].str.len() > 0
    ]

    df["fraudulent"] = (
        df["fraudulent"]
        .astype(int)
    )


    # ==================================================
    # SHOW CLASS DISTRIBUTION
    # ==================================================

    print("\nClass distribution:")

    print(
        df["fraudulent"]
        .value_counts()
        .sort_index()
    )


    # ==================================================
    # FEATURES + TARGET
    # ==================================================

    X = df["combined_text"]

    y = df["fraudulent"]


    # ==================================================
    # TRAIN / TEST SPLIT
    # ==================================================

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.20,
            random_state=42,
            stratify=y,
        )
    )


    print(
        f"\nTraining samples: {len(X_train)}"
    )

    print(
        f"Testing samples: {len(X_test)}"
    )


    # ==================================================
    # TF-IDF + LOGISTIC REGRESSION
    # ==================================================

    pipeline = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    stop_words="english",
                    ngram_range=(1, 2),
                    min_df=2,
                    max_df=0.95,
                    sublinear_tf=True,
                ),
            ),

            (
                "classifier",
                LogisticRegression(
                    max_iter=1000,
                    class_weight="balanced",
                    random_state=42,
                ),
            ),
        ]
    )


    # ==================================================
    # TRAIN
    # ==================================================

    print(
        "\nTraining CareerShield fraud model..."
    )

    pipeline.fit(
        X_train,
        y_train
    )


    # ==================================================
    # EVALUATION
    # ==================================================

    predictions = pipeline.predict(
        X_test
    )


    print(
        "\n=============================="
    )

    print(
        "MODEL EVALUATION"
    )

    print(
        "=============================="
    )

    print(
        classification_report(
            y_test,
            predictions,
            digits=4,
        )
    )


    # ==================================================
    # SAVE MODEL
    # ==================================================

    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    joblib.dump(
        pipeline,
        MODEL_PATH
    )

    print(
        f"\nModel saved successfully:"
    )

    print(
        os.path.abspath(
            MODEL_PATH
        )
    )


if __name__ == "__main__":
    main()