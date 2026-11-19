"""Database management for MedPredict AI using standard SQLite."""

import os
import sqlite3
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

# Determine database directory:
# On Vercel / serverless or read-only filesystems, use /tmp.
# In local development, place in backend directory.
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if os.environ.get("VERCEL") or not os.access(_backend_dir, os.W_OK):
    DB_DIR = "/tmp"
else:
    DB_DIR = _backend_dir

DB_PATH = os.path.join(DB_DIR, "medpredict.db")


def get_db_connection() -> sqlite3.Connection:
    """Create a SQLite database connection with row factory."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables for users and prediction history."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        # Prediction history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                disease TEXT NOT NULL,
                prediction INTEGER NOT NULL,
                result TEXT NOT NULL,
                probability REAL NOT NULL,
                risk_category TEXT NOT NULL,
                model TEXT NOT NULL,
                inputs TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)

        conn.commit()
        conn.close()
        logger.info(f"Database initialized successfully at {DB_PATH}")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")


# Initialize on import
init_db()


def create_user(email: str, name: str, password_hash: str) -> Dict[str, Any]:
    """Insert a new user and return the user record."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    try:
        cursor.execute(
            "INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (email.lower().strip(), name.strip(), password_hash, now),
        )
        conn.commit()
        user_id = cursor.lastrowid
        return {
            "id": user_id,
            "email": email.lower().strip(),
            "name": name.strip(),
            "created_at": now,
        }
    finally:
        conn.close()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Fetch user by email (case-insensitive)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, email, name, password_hash, created_at FROM users WHERE email = ?",
            (email.lower().strip(),),
        )
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Fetch user by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, email, name, created_at FROM users WHERE id = ?",
            (user_id,),
        )
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None
    finally:
        conn.close()


def save_prediction(
    user_id: int,
    disease: str,
    prediction: int,
    result: str,
    probability: float,
    risk_category: str,
    model: str,
    inputs: Dict[str, Any],
) -> Dict[str, Any]:
    """Save a prediction result to history for a user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    inputs_json = json.dumps(inputs)
    try:
        cursor.execute(
            """
            INSERT INTO prediction_history
            (user_id, disease, prediction, result, probability, risk_category, model, inputs, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                disease,
                prediction,
                result,
                probability,
                risk_category,
                model,
                inputs_json,
                now,
            ),
        )
        conn.commit()
        pred_id = cursor.lastrowid
        return {
            "id": pred_id,
            "user_id": user_id,
            "disease": disease,
            "prediction": prediction,
            "result": result,
            "probability": probability,
            "risk_category": risk_category,
            "model": model,
            "inputs": inputs,
            "created_at": now,
        }
    finally:
        conn.close()


def get_user_history(user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
    """Get prediction history for a user, sorted newest first."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, user_id, disease, prediction, result, probability, risk_category, model, inputs, created_at
            FROM prediction_history
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ?
            """,
            (user_id, limit),
        )
        rows = cursor.fetchall()
        result = []
        for r in rows:
            item = dict(r)
            try:
                item["inputs"] = json.loads(item["inputs"])
            except Exception:
                item["inputs"] = {}
            result.append(item)
        return result
    finally:
        conn.close()


def delete_history_item(user_id: int, history_id: int) -> bool:
    """Delete a specific history entry owned by user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM prediction_history WHERE id = ? AND user_id = ?",
            (history_id, user_id),
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def clear_user_history(user_id: int) -> int:
    """Clear all history for a user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM prediction_history WHERE user_id = ?",
            (user_id,),
        )
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()
