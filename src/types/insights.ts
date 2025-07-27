export interface InsightFile {
  id: string;
  name: string;
  displayName: string;
  description: string;
  content: string;
  type: InsightFileType;
  order: number;
  lastModified: Date;
  isDirty: boolean;
  metadata: InsightMetadata;
  aiReferences: string[]; // Other insight files this one references
}

export type InsightFileType = 
  | 'project-overview'
  | 'features-spec'
  | 'current-progress'
  | 'architectural-decisions'
  | 'requirements-goals'
  | 'ai-conversations'
  | 'tech-stack'
  | 'design-system'
  | 'api-specification'
  | 'data-models'
  | 'custom';

export interface InsightMetadata {
  category: 'project' | 'technical' | 'design' | 'business' | 'ai';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  lastAIAccess?: Date;
  aiSuggestions?: string[];
  relatedFiles: string[]; // IDs of related insight files
}

export interface ProjectInsights {
  id: string;
  name: string;
  description: string;
  files: InsightFile[];
  createdAt: Date;
  lastModified: Date;
  metadata: {
    source: 'import' | 'new';
    originalPath?: string;
    tags: string[];
    aiContext: string; // Summary of all insights for AI
  };
}

export interface InsightTemplate {
  type: InsightFileType;
  displayName: string;
  description: string;
  defaultContent: string;
  icon: string;
  category: 'project' | 'technical' | 'design' | 'business' | 'ai';
  priority: 'high' | 'medium' | 'low';
  suggestedTags: string[];
}

export const INSIGHT_TEMPLATES: Record<InsightFileType, InsightTemplate> = {
  'project-overview': {
    type: 'project-overview',
    displayName: 'Project Overview',
    description: 'High-level project description, goals, and vision',
    category: 'project',
    priority: 'high',
    suggestedTags: ['overview', 'goals', 'vision'],
    icon: '🎯',
    defaultContent: `# Project Overview

## Project Name
[Your Project Name]

## Goal
[What is the main goal of this project?]

## Vision
[What is the long-term vision for this project?]

## Target Users
- [Primary users]
- [Secondary users]

## Key Success Metrics
- [Metric 1]
- [Metric 2]

## Timeline
- [Phase 1]: [Description]
- [Phase 2]: [Description]

## Notes
[Any additional context or notes]
`
  },
  'features-spec': {
    type: 'features-spec',
    displayName: 'Features Specification',
    description: 'Detailed feature requirements and specifications',
    category: 'business',
    priority: 'high',
    suggestedTags: ['features', 'requirements', 'specs'],
    icon: '📋',
    defaultContent: `# Features Specification

## Core Features

### Feature 1: [Feature Name]
**Priority**: High/Medium/Low
**Description**: [Detailed description]
**User Story**: As a [user type], I want [feature] so that [benefit]
**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

### Feature 2: [Feature Name]
**Priority**: High/Medium/Low
**Description**: [Detailed description]
**User Story**: As a [user type], I want [feature] so that [benefit]
**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Future Features
- [Future feature 1]
- [Future feature 2]

## Notes
[Any additional feature context]
`
  },
  'current-progress': {
    type: 'current-progress',
    displayName: 'Current Progress',
    description: 'What was last worked on and current status',
    category: 'project',
    priority: 'medium',
    suggestedTags: ['progress', 'status', 'current'],
    icon: '🚀',
    defaultContent: `# Current Progress

## Last Updated
[Date]

## Currently Working On
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

## Recently Completed
- [x] [Completed task 1]
- [x] [Completed task 2]

## Next Steps
1. [Next step 1]
2. [Next step 2]
3. [Next step 3]

## Blockers
- [Blocker 1]
- [Blocker 2]

## Notes
[Any progress-related notes]
`
  },
  'architectural-decisions': {
    type: 'architectural-decisions',
    displayName: 'Architectural Decisions',
    description: 'Key architectural patterns and decisions made',
    category: 'technical',
    priority: 'high',
    suggestedTags: ['architecture', 'decisions', 'patterns'],
    icon: '🏗️',
    defaultContent: `# Architectural Decisions

## Architecture Overview
[High-level architecture description]

## Key Decisions

### Decision 1: [Decision Name]
**Date**: [Date]
**Context**: [Why this decision was needed]
**Options Considered**:
- [Option 1]: [Pros/Cons]
- [Option 2]: [Pros/Cons]
**Decision**: [Chosen option]
**Rationale**: [Why this was chosen]
**Consequences**: [What this enables/constrains]

### Decision 2: [Decision Name]
**Date**: [Date]
**Context**: [Why this decision was needed]
**Options Considered**:
- [Option 1]: [Pros/Cons]
- [Option 2]: [Pros/Cons]
**Decision**: [Chosen option]
**Rationale**: [Why this was chosen]
**Consequences**: [What this enables/constrains]

## Patterns Used
- [Pattern 1]: [Description]
- [Pattern 2]: [Description]

## Notes
[Any architectural notes]
`
  },
  'requirements-goals': {
    type: 'requirements-goals',
    displayName: 'Requirements & Goals',
    description: 'Functional and non-functional requirements',
    category: 'business',
    priority: 'high',
    suggestedTags: ['requirements', 'goals', 'constraints'],
    icon: '📊',
    defaultContent: `# Requirements & Goals

## Functional Requirements

### FR1: [Requirement Name]
**Description**: [Detailed description]
**Priority**: High/Medium/Low
**Dependencies**: [Other requirements this depends on]

### FR2: [Requirement Name]
**Description**: [Detailed description]
**Priority**: High/Medium/Low
**Dependencies**: [Other requirements this depends on]

## Non-Functional Requirements

### Performance
- [Requirement 1]
- [Requirement 2]

### Security
- [Requirement 1]
- [Requirement 2]

### Scalability
- [Requirement 1]
- [Requirement 2]

## Business Goals
- [Goal 1]
- [Goal 2]

## Success Criteria
- [Criterion 1]
- [Criterion 2]

## Notes
[Any requirements notes]
`
  },
  'ai-conversations': {
    type: 'ai-conversations',
    displayName: 'AI Conversations',
    description: 'Important conversations and instructions given to AI',
    category: 'ai',
    priority: 'medium',
    suggestedTags: ['ai', 'conversations', 'instructions'],
    icon: '🤖',
    defaultContent: `# AI Conversations

## Key Conversations

### Conversation 1: [Topic]
**Date**: [Date]
**Context**: [What was being worked on]
**User**: [What the user asked]
**AI Response**: [What AI suggested]
**Outcome**: [What was implemented/decided]
**Insights**: [Key learnings from this conversation]

### Conversation 2: [Topic]
**Date**: [Date]
**Context**: [What was being worked on]
**User**: [What the user asked]
**AI Response**: [What AI suggested]
**Outcome**: [What was implemented/decided]
**Insights**: [Key learnings from this conversation]

## Important Instructions
- [Instruction 1]
- [Instruction 2]

## AI Preferences
- [Preference 1]
- [Preference 2]

## Notes
[Any AI-related notes]
`
  },
  'tech-stack': {
    type: 'tech-stack',
    displayName: 'Tech Stack',
    description: 'Technology choices and dependencies',
    category: 'technical',
    priority: 'high',
    suggestedTags: ['tech', 'stack', 'dependencies'],
    icon: '⚙️',
    defaultContent: `# Tech Stack

## Frontend
- **Framework**: [React/Vue/Angular/etc.]
- **Styling**: [Tailwind/Bootstrap/CSS-in-JS/etc.]
- **State Management**: [Redux/Zustand/Context/etc.]
- **Build Tool**: [Vite/Webpack/etc.]

## Backend
- **Runtime**: [Node.js/Python/Go/etc.]
- **Framework**: [Express/FastAPI/Gin/etc.]
- **Database**: [PostgreSQL/MongoDB/etc.]
- **ORM**: [Prisma/TypeORM/etc.]

## Infrastructure
- **Hosting**: [Vercel/AWS/GCP/etc.]
- **CI/CD**: [GitHub Actions/Jenkins/etc.]
- **Monitoring**: [Sentry/DataDog/etc.]

## Development Tools
- **Package Manager**: [npm/yarn/pnpm]
- **Linting**: [ESLint/Prettier]
- **Testing**: [Jest/Vitest/Cypress]
- **Version Control**: [Git]

## Dependencies
### Core Dependencies
- [Dependency 1]: [Version] - [Purpose]
- [Dependency 2]: [Version] - [Purpose]

### Development Dependencies
- [Dev Dependency 1]: [Version] - [Purpose]
- [Dev Dependency 2]: [Version] - [Purpose]

## Notes
[Any tech stack notes]
`
  },
  'design-system': {
    type: 'design-system',
    displayName: 'Design System',
    description: 'UI/UX design patterns and components',
    category: 'design',
    priority: 'medium',
    suggestedTags: ['design', 'ui', 'ux', 'components'],
    icon: '🎨',
    defaultContent: `# Design System

## Design Philosophy
[Overall design approach and principles]

## Color Palette
- **Primary**: [Color] - [Usage]
- **Secondary**: [Color] - [Usage]
- **Accent**: [Color] - [Usage]
- **Neutral**: [Color] - [Usage]

## Typography
- **Primary Font**: [Font family]
- **Secondary Font**: [Font family]
- **Heading Sizes**: [H1, H2, H3, etc.]
- **Body Text**: [Size and weight]

## Component Library
### Buttons
- **Primary**: [Description]
- **Secondary**: [Description]
- **Ghost**: [Description]

### Forms
- **Input Fields**: [Description]
- **Validation**: [Description]
- **Error States**: [Description]

### Layout
- **Grid System**: [Description]
- **Spacing**: [Description]
- **Breakpoints**: [Description]

## UI Patterns
- [Pattern 1]: [Description]
- [Pattern 2]: [Description]

## Accessibility
- [Accessibility requirement 1]
- [Accessibility requirement 2]

## Notes
[Any design notes]
`
  },
  'api-specification': {
    type: 'api-specification',
    displayName: 'API Specification',
    description: 'API endpoints, schemas, and documentation',
    category: 'technical',
    priority: 'high',
    suggestedTags: ['api', 'endpoints', 'schemas'],
    icon: '🔌',
    defaultContent: `# API Specification

## Base URL
- **Development**: [URL]
- **Production**: [URL]

## Authentication
- **Method**: [JWT/Bearer/API Key]
- **Headers**: [Required headers]

## Endpoints

### GET /api/[resource]
**Description**: [What this endpoint does]
**Parameters**:
- [Parameter 1]: [Type] - [Description]
- [Parameter 2]: [Type] - [Description]
**Response**: [Response format]
**Example**:
\`\`\`json
{
  "data": [],
  "meta": {}
}
\`\`\`

### POST /api/[resource]
**Description**: [What this endpoint does]
**Body**: [Request body format]
**Response**: [Response format]
**Example**:
\`\`\`json
{
  "field1": "value1",
  "field2": "value2"
}
\`\`\`

## Data Models
### [Model Name]
\`\`\`json
{
  "id": "string",
  "field1": "string",
  "field2": "number"
}
\`\`\`

## Error Responses
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

## Notes
[Any API notes]
`
  },
  'data-models': {
    type: 'data-models',
    displayName: 'Data Models',
    description: 'Database schemas and data relationships',
    category: 'technical',
    priority: 'high',
    suggestedTags: ['data', 'models', 'database', 'schema'],
    icon: '🗄️',
    defaultContent: `# Data Models

## Database Schema

### Table: [Table Name]
**Description**: [What this table represents]
**Fields**:
- **id**: UUID (Primary Key)
- **field1**: [Type] - [Description]
- **field2**: [Type] - [Description]
- **created_at**: Timestamp
- **updated_at**: Timestamp

**Indexes**:
- [Index 1]: [Purpose]
- [Index 2]: [Purpose]

**Constraints**:
- [Constraint 1]: [Description]
- [Constraint 2]: [Description]

### Table: [Table Name]
**Description**: [What this table represents]
**Fields**:
- **id**: UUID (Primary Key)
- **field1**: [Type] - [Description]
- **field2**: [Type] - [Description]
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Relationships
- [Table 1] has many [Table 2]
- [Table 2] belongs to [Table 1]

## Data Validation Rules
- [Rule 1]: [Description]
- [Rule 2]: [Description]

## Migration Strategy
- [Migration approach 1]
- [Migration approach 2]

## Notes
[Any data model notes]
`
  },
  'custom': {
    type: 'custom',
    displayName: 'Custom Insight',
    description: 'Custom insight file for specific needs',
    category: 'project',
    priority: 'medium',
    suggestedTags: ['custom'],
    icon: '📄',
    defaultContent: `# Custom Insight

## Description
[Describe what this insight file is for]

## Content
[Add your custom content here]

## Related Insights
- [Related insight 1]
- [Related insight 2]

## Notes
[Any additional notes or context]
`
  }
};

export interface AIInsightReference {
  insightId: string;
  insightName: string;
  relevance: 'high' | 'medium' | 'low';
  context: string; // What part of this insight is relevant
}

export interface AIGenerationContext {
  referencedInsights: AIInsightReference[];
  missingInsights: string[]; // Suggested insights that should be created
  contextSummary: string;
}