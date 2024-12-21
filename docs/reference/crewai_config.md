# CrewAI Configuration Reference

This document contains reference implementations for our CrewAI agent configurations and workflows.

## Agent Types

### 1. Research Agent
```python
class ResearchAgent(Agent):
    def __init__(self):
        super().__init__(
            role="Research Specialist",
            goal="Analyze topics and identify valuable content opportunities",
            backstory="Expert in SEO research and content strategy",
            tools=[
                KeywordResearchTool(),
                CompetitionAnalysisTool(),
                TopicMappingTool()
            ]
        )

    async def analyze_topic(self, topic: str) -> dict:
        """Analyze a topic for content opportunities"""
        pass

    async def find_keywords(self, topic: str) -> list:
        """Find relevant keywords for a topic"""
        pass
```

### 2. Content Planning Agent
```python
class ContentPlannerAgent(Agent):
    def __init__(self):
        super().__init__(
            role="Content Strategist",
            goal="Create optimal content structures and plans",
            backstory="Expert in content architecture and SEO",
            tools=[
                ContentStructureTool(),
                InternalLinkingTool(),
                TitleOptimizationTool()
            ]
        )

    async def plan_hub_spoke(self, topic: dict) -> dict:
        """Create hub and spoke content plan"""
        pass

    async def optimize_structure(self, content: dict) -> dict:
        """Optimize content structure for SEO"""
        pass
```

### 3. Content Writing Agent
```python
class ContentWriterAgent(Agent):
    def __init__(self):
        super().__init__(
            role="Content Creator",
            goal="Generate high-quality, SEO-optimized content",
            backstory="Expert writer with deep SEO knowledge",
            tools=[
                ContentGenerationTool(),
                SEOOptimizationTool(),
                SchemaGenerationTool()
            ]
        )

    async def generate_content(self, plan: dict) -> str:
        """Generate content from plan"""
        pass

    async def optimize_content(self, content: str) -> str:
        """Optimize content for SEO"""
        pass
```

## Workflows

### 1. Topic Research Workflow
```python
async def research_topic(topic: str):
    crew = Crew(
        agents=[
            ResearchAgent(),
            ContentPlannerAgent()
        ],
        tasks=[
            Task(
                description="Research topic and identify opportunities",
                agent=ResearchAgent()
            ),
            Task(
                description="Create content plan",
                agent=ContentPlannerAgent()
            )
        ]
    )
    return await crew.run()
```

### 2. Content Generation Workflow
```python
async def generate_content(plan: dict):
    crew = Crew(
        agents=[
            ContentPlannerAgent(),
            ContentWriterAgent()
        ],
        tasks=[
            Task(
                description="Optimize content structure",
                agent=ContentPlannerAgent()
            ),
            Task(
                description="Generate content",
                agent=ContentWriterAgent()
            )
        ]
    )
    return await crew.run()
```

## Astro Integration Points
- Edge function setup
- Content collection integration
- File system operations
- Git-based content updates
