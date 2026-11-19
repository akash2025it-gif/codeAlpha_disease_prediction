"""Pydantic schemas for authentication and user prediction history."""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
import re

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class UserRegisterInput(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name or clinician name")
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, max_length=128, description="Account password (min 6 characters)")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email format")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip()
        if len(clean) < 2:
            raise ValueError("Name must be at least 2 characters")
        return clean


class UserLoginInput(BaseModel):
    email: str = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")

    @field_validator("email")
    @classmethod
    def clean_email(cls, v: str) -> str:
        return v.strip().lower()


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class SaveHistoryInput(BaseModel):
    disease: str
    prediction: int
    result: str
    probability: float
    risk_category: str
    model: str
    inputs: Dict[str, Any] = Field(default_factory=dict)


class HistoryItemResponse(BaseModel):
    id: int
    user_id: int
    disease: str
    prediction: int
    result: str
    probability: float
    risk_category: str
    model: str
    inputs: Dict[str, Any]
    created_at: str
