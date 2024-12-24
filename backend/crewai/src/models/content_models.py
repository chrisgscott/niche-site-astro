from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Union
from datetime import date

class ImageModel(BaseModel):
    """Schema for images with aspect ratio validation"""
    src: str = Field(..., description="URL of the image")
    width: int = Field(..., gt=0, description="Image width")
    height: int = Field(..., gt=0, description="Image height")
    alt: str = Field(..., description="Alternative text for the image")

    @validator('width', 'height')
    def validate_aspect_ratio(cls, v, values):
        """Validate landscape orientation"""
        if 'width' in values and 'height' in values:
            aspect_ratio = values['width'] / values['height']
            if not (0.5625 <= aspect_ratio <= 1.7778):  # Between 16:9 and 9:16
                raise ValueError("Image must be landscape orientation")
        return v

class FAQModel(BaseModel):
    """Schema for Frequently Asked Questions"""
    question: str
    answer: str

class BaseContentModel(BaseModel):
    """Base content schema for all content types"""
    title: str = Field(..., min_length=10, max_length=120)
    description: str = Field(..., min_length=50, max_length=160)
    date: Union[str, date]
    image: ImageModel
    keywords: List[str] = Field(..., min_items=3, max_items=10)
    draft: bool = Field(default=False)

class TopicModel(BaseContentModel):
    """Schema for topic content"""
    type: str = Field(default='topic', const=True)
    topic: str
    title_short: str
    featured: bool = Field(default=False)

class PostModel(BaseContentModel):
    """Schema for post content"""
    type: str = Field(default='post', const=True)
    parent_topic: Dict[str, str] = Field(..., description="Parent topic details")
    faq: Optional[List[FAQModel]] = None

class ArticleModel(BaseContentModel):
    """Schema for programmatic article content"""
    type: str = Field(default='article', const=True)
    parent_topic: Dict[str, str] = Field(..., description="Parent topic details")
    title_template: Optional[str] = None
    article_variables: Optional[Dict[str, str]] = None
    schema: Optional[str] = None
    faq: Optional[List[FAQModel]] = None
    variations: Optional[Dict[str, List[str]]] = None

# Alias models for CrewAI task outputs
NicheLandscapeAnalysis = TopicModel
ContentDraftModel = Union[PostModel, ArticleModel]
SEOMetadataModel = BaseContentModel
