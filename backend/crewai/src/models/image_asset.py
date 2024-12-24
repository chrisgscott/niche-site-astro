from pydantic import BaseModel, Field
from typing import List, Optional

class ImageAsset(BaseModel):
    """
    Structured model for a curated image asset
    """
    id: str = Field(..., description="Unique identifier for the image")
    url: str = Field(..., description="Direct URL to the image")
    thumbnail_url: Optional[str] = Field(None, description="URL to a thumbnail version of the image")
    description: Optional[str] = Field(None, description="Descriptive text about the image")
    alt_text: Optional[str] = Field(None, description="Alternative text for accessibility")
    source: str = Field(..., description="Source platform of the image (e.g., Unsplash)")
    attribution: Optional[str] = Field(None, description="Credit to the original creator")
    keywords: List[str] = Field(default_factory=list, description="Relevant keywords for the image")
    
    class Config:
        """Pydantic model configuration"""
        schema_extra = {
            "example": {
                "id": "abc123",
                "url": "https://example.com/image.jpg",
                "thumbnail_url": "https://example.com/thumbnail.jpg",
                "description": "A beautiful landscape with mountains",
                "alt_text": "Mountain landscape with snow-capped peaks",
                "source": "Unsplash",
                "attribution": "Photographer Name",
                "keywords": ["landscape", "mountains", "nature"]
            }
        }
