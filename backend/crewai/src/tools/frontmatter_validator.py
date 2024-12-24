import yaml
from pydantic import BaseModel, Field, ValidationError
from typing import Dict, Any, Optional, List
import re

class FrontmatterSchema(BaseModel):
    """
    Comprehensive Frontmatter Validation Schema for Niche Site Content
    """
    title: str = Field(..., min_length=10, max_length=120, description="SEO-optimized title")
    description: str = Field(..., min_length=50, max_length=160, description="Meta description")
    keywords: List[str] = Field(default_factory=list, min_items=3, max_items=10, description="Target keywords")
    
    # Optional but recommended fields
    date: Optional[str] = Field(None, description="Publication date in YYYY-MM-DD format")
    draft: Optional[bool] = Field(default=False, description="Draft status")
    
    # SEO and Structural Fields
    canonical_url: Optional[str] = Field(None, description="Canonical URL if different from default")
    schema_type: Optional[str] = Field(default="Article", description="Schema.org type")
    
    # Content Relationship Fields
    parent_topic: Optional[str] = Field(None, description="Parent topic for hierarchical content")
    related_topics: Optional[List[str]] = Field(default_factory=list, description="Related topic links")
    
    # Advanced SEO Fields
    priority: Optional[float] = Field(None, ge=0.0, le=1.0, description="Sitemap priority")
    changefreq: Optional[str] = Field(None, description="Sitemap change frequency")
    
    # Validation methods
    def validate_date(self):
        if self.date and not re.match(r'^\d{4}-\d{2}-\d{2}$', self.date):
            raise ValueError("Date must be in YYYY-MM-DD format")
        return self.date

def validate_frontmatter(frontmatter_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and potentially modify frontmatter to match required schema
    
    :param frontmatter_dict: Input frontmatter dictionary
    :return: Validated and potentially modified frontmatter
    """
    try:
        validated_frontmatter = FrontmatterSchema(**frontmatter_dict)
        return validated_frontmatter.dict(exclude_unset=True)
    except ValidationError as e:
        # Provide detailed validation errors
        errors = e.errors()
        error_messages = [f"{err['loc'][0]}: {err['msg']}" for err in errors]
        raise ValueError(f"Frontmatter validation failed:\n" + "\n".join(error_messages))

def frontmatter_validation_tool(frontmatter: Dict[str, Any]) -> Dict[str, Any]:
    """
    CrewAI compatible tool for frontmatter validation
    
    :param frontmatter: Frontmatter dictionary to validate
    :return: Validated frontmatter
    """
    return validate_frontmatter(frontmatter)
