import os
import requests
from typing import List, Dict, Any
from crewai.tools.structured_tool import CrewStructuredTool
from pydantic import BaseModel, Field

class UnsplashSearchInput(BaseModel):
    """Input model for Unsplash image search"""
    query: str = Field(..., description="Search term for images")
    per_page: int = Field(default=10, ge=1, le=30, description="Number of images to return (1-30)")
    orientation: str = Field(default='landscape', description="Image orientation (landscape, portrait, squarish)")

class UnsplashTool:
    """Unsplash image search tool for CrewAI"""
    
    def __init__(self):
        self.application_id = os.getenv('UNSPLASH_APPLICATION_ID')
        self.access_key = os.getenv('UNSPLASH_ACCESS_KEY')
        self.base_url = 'https://api.unsplash.com'
        
        if not self.access_key:
            raise ValueError("Unsplash API key not found in environment variables")

    def search_images(self, query: str, per_page: int = 10, orientation: str = 'landscape') -> List[Dict[str, Any]]:
        """
        Search for images on Unsplash
        
        :param query: Search term for images
        :param per_page: Number of images to return (max 30)
        :param orientation: Image orientation (landscape, portrait, squarish)
        :return: List of image details
        """
        endpoint = f'{self.base_url}/search/photos'
        headers = {
            'Authorization': f'Client-ID {self.access_key}'
        }
        params = {
            'query': query,
            'per_page': per_page,
            'orientation': orientation
        }
        
        try:
            response = requests.get(endpoint, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            return [
                {
                    'id': result['id'],
                    'description': result.get('description', ''),
                    'alt_description': result.get('alt_description', ''),
                    'urls': result['urls'],
                    'user': result['user']['name'],
                    'link': result['links']['html']
                } 
                for result in data.get('results', [])
            ]
        except requests.RequestException as e:
            print(f"Error searching Unsplash: {e}")
            return []

def create_unsplash_tool():
    """
    Create a structured Unsplash image search tool
    
    :return: CrewAI Structured Tool for Unsplash image search
    """
    unsplash = UnsplashTool()
    
    def tool_wrapper(query: str, per_page: int = 10, orientation: str = 'landscape') -> List[Dict[str, Any]]:
        """
        Wrapper function for Unsplash image search
        
        :param query: Search term for images
        :param per_page: Number of images to return
        :param orientation: Image orientation
        :return: List of image details
        """
        return unsplash.search_images(query, per_page, orientation)
    
    return CrewStructuredTool.from_function(
        name='Unsplash Image Search',
        description='Search for high-quality, royalty-free images on Unsplash based on a given query. Useful for finding contextually relevant visual assets.',
        func=tool_wrapper,
        args_schema=UnsplashSearchInput
    )

# Create the tool for import
unsplash_tool = create_unsplash_tool()
