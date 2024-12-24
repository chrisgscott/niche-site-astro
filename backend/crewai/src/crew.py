from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import tools
from tools.unsplash_tool import unsplash_tool  # Import the new Unsplash tool
from models.content_models import (
    NicheLandscapeAnalysis,
    TopicHierarchyModel,
    ResearchBriefModel,
    ContentDraftModel,
    SEOMetadataModel,
    InternalLinkingModel,
    QualityAssuranceModel,
    ContentExportModel,
    TopicHubModel,
    FrontMatterSchemaValidationModel
)
from models.image_asset import ImageAsset
from tools.frontmatter_validator import frontmatter_validation_tool
from typing import List

@CrewBase
class CrewaiCrew():
    """crewai crew"""

    # Agent definitions
    @agent
    def keyword_research_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['keyword_research_specialist'],
            tools=[
                tools.query_perplexity,  # For advanced search queries
                tools.dir_search_tool,   # To search existing content directories
                tools.web_crawl,         # To crawl web for keyword research
                tools.search_and_contents # To analyze search results
            ],
            verbose=True,
        )

    @agent
    def content_topology_architect(self) -> Agent:
        return Agent(
            config=self.agents_config['content_topology_architect'],
            tools=[
                tools.code_interpreter,  # For structuring and analyzing content
                tools.query_perplexity,  # For semantic research
                tools.search_and_contents # To understand existing content landscape
            ],
            verbose=True,
        )

    @agent
    def content_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['content_writer'],
            tools=[
                tools.search_and_contents,  # To find and analyze reference content
                tools.code_interpreter,     # For markdown formatting and content generation
                tools.query_perplexity      # For additional research and context
            ],
            verbose=True,
        )

    @agent
    def seo_optimization_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['seo_optimization_specialist'],
            tools=[
                tools.query_perplexity,     # For SEO trend and keyword research
                tools.search_and_contents,  # To analyze existing content and metadata
                tools.web_crawl             # To understand SEO landscape
            ],
            verbose=True,
        )

    @agent
    def internal_linking_strategist(self) -> Agent:
        return Agent(
            config=self.agents_config['internal_linking_strategist'],
            tools=[
                tools.web_scrape,           # To analyze existing content structure
                tools.search_and_contents,  # To find relevant internal linking opportunities
                tools.query_perplexity      # For semantic understanding of content relationships
            ],
            verbose=True,
        )

    @agent
    def content_deployment_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['content_deployment_specialist'],
            tools=[
                tools.dir_search_tool,      # To manage content repository
                tools.code_interpreter,     # For file and content manipulation
                tools.search_and_contents   # To verify content organization
            ],
            verbose=True,
        )

    @agent
    def content_image_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['content_image_specialist'],
            tools=[
                unsplash_tool,        # Custom Unsplash image search tool
                tools.query_perplexity,     # For understanding image context
                tools.search_and_contents   # To find contextually relevant image descriptions
            ],
            verbose=True,
        )

    # Task definitions
    @task
    def niche_landscape_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['niche_landscape_analysis'],
            output_pydantic=NicheLandscapeAnalysis
        )

    @task
    def topic_hierarchy_construction(self) -> Task:
        return Task(
            config=self.tasks_config['topic_hierarchy_construction'],
            output_pydantic=TopicHierarchyModel
        )

    @task
    def spoke_topic_deep_research(self) -> Task:
        return Task(
            config=self.tasks_config['spoke_topic_deep_research'],
            output_pydantic=ResearchBriefModel
        )

    @task
    def content_drafting(self) -> Task:
        return Task(
            config=self.tasks_config['content_drafting'],
            output_pydantic=ContentDraftModel
        )

    @task
    def visual_asset_curation(self) -> Task:
        return Task(
            config=self.tasks_config['visual_asset_curation'],
            output_pydantic=List[ImageAsset]
        )

    @task
    def seo_metadata_optimization(self) -> Task:
        return Task(
            config=self.tasks_config['seo_metadata_optimization'],
            output_pydantic=SEOMetadataModel
        )

    @task
    def internal_linking_strategy(self) -> Task:
        return Task(
            config=self.tasks_config['internal_linking_strategy'],
            output_pydantic=InternalLinkingModel
        )

    @task
    def quality_assurance_review(self) -> Task:
        return Task(
            config=self.tasks_config['quality_assurance_review'],
            output_pydantic=QualityAssuranceModel
        )

    @task
    def content_export_and_organization(self) -> Task:
        return Task(
            config=self.tasks_config['content_export_and_organization'],
            output_pydantic=ContentExportModel
        )

    @task
    def topic_hub_markdown_generation(self) -> Task:
        return Task(
            config=self.tasks_config['topic_hub_markdown_generation'],
            output_pydantic=TopicHubModel
        )

    @task
    def frontmatter_schema_validation(self) -> Task:
        return Task(
            config=self.tasks_config['frontmatter_schema_validation'],
            tools=[frontmatter_validation_tool],
            output_pydantic=SEOMetadataModel  # Reuse SEO Metadata Model
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Test crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )