export interface ContextFile {
  id: string;
  name: string;
  displayName: string;
  description: string;
  content: string;
  type: ContextFileType;
  order: number;
  lastModified: Date;
  isDirty: boolean;
  metadata?: Record<string, any>;
}

export type ContextFileType = 
  | 'setup.context'
  | 'data.schema'
  | 'goals.plan'
  | 'ai_notes.ctx'
  | 'api.design'
  | 'business.logic'
  | 'ui.components'
  | 'custom';

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  files: ContextFile[];
  createdAt: Date;
  lastModified: Date;
  metadata: {
    source: 'import' | 'new';
    originalPath?: string;
    tags: string[];
  };
}

export interface ContextFileTemplate {
  type: ContextFileType;
  displayName: string;
  description: string;
  defaultContent: string;
  icon: string;
}

export const CONTEXT_FILE_TEMPLATES: Record<ContextFileType, ContextFileTemplate> = {
  'setup.context': {
    type: 'setup.context',
    displayName: 'Project Setup',
    description: 'Initial project configuration and environment setup',
    defaultContent: `# Project Setup Context

## Project Overview
- **Name**: [Project Name]
- **Type**: [Web App / API / Library / etc.]
- **Tech Stack**: [Technologies to use]

## Environment Setup
- Node.js version: [version]
- Package manager: [npm/yarn/pnpm]
- Database: [type and version]

## Development Tools
- IDE/Editor: [preferences]
- Linting: [ESLint/Prettier config]
- Testing: [Jest/Vitest/etc.]

## Deployment
- Platform: [Vercel/Netlify/AWS/etc.]
- Environment variables: [list needed]
`,
    icon: '⚙️'
  },
  'data.schema': {
    type: 'data.schema',
    displayName: 'Data Structure',
    description: 'Database models, relationships, and data flow',
    defaultContent: `# Data Schema Context

## Database Models

### User Model
- id: string (primary key)
- email: string (unique)
- name: string
- createdAt: Date
- updatedAt: Date

### [Other Models...]

## Relationships
- User has many [Related Models]
- [Model] belongs to User

## Data Validation Rules
- Email must be valid format
- [Other validation rules]

## Indexes
- email (unique)
- [Other indexes]
`,
    icon: '🗄️'
  },
  'goals.plan': {
    type: 'goals.plan',
    displayName: 'Business Goals',
    description: 'Project objectives, features, and success metrics',
    defaultContent: `# Business Goals Context

## Project Objectives
1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

## Core Features
- [Feature 1]: [Description]
- [Feature 2]: [Description]
- [Feature 3]: [Description]

## Success Metrics
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

## User Stories
- As a [user type], I want [feature] so that [benefit]

## Timeline
- Phase 1: [Features and timeline]
- Phase 2: [Features and timeline]
`,
    icon: '🎯'
  },
  'ai_notes.ctx': {
    type: 'ai_notes.ctx',
    displayName: 'AI Notes',
    description: 'AI-generated insights, patterns, and recommendations',
    defaultContent: `# AI Notes Context

## Generated Insights
- [Insight 1]
- [Insight 2]

## Recommended Patterns
- [Pattern 1]: [Description and usage]
- [Pattern 2]: [Description and usage]

## Code Quality Notes
- [Note about code structure]
- [Note about best practices]

## Performance Considerations
- [Performance note 1]
- [Performance note 2]

## Security Considerations
- [Security note 1]
- [Security note 2]
`,
    icon: '🤖'
  },
  'api.design': {
    type: 'api.design',
    displayName: 'API Design',
    description: 'API endpoints, request/response schemas, and documentation',
    defaultContent: `# API Design Context

## Base URL
- Development: http://localhost:3000/api
- Production: https://api.example.com

## Authentication
- Method: [JWT/Bearer/API Key]
- Headers: [Authorization: Bearer <token>]

## Endpoints

### GET /users
- Description: Get all users
- Query params: page, limit, search
- Response: { users: User[], total: number }

### POST /users
- Description: Create new user
- Body: { email, name, password }
- Response: { user: User }

### [Other endpoints...]

## Error Responses
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
`,
    icon: '🔌'
  },
  'business.logic': {
    type: 'business.logic',
    displayName: 'Business Logic',
    description: 'Core business rules, workflows, and domain logic',
    defaultContent: `# Business Logic Context

## Core Business Rules
1. [Rule 1]: [Description]
2. [Rule 2]: [Description]

## Workflows
### User Registration Flow
1. User submits registration form
2. Validate email format
3. Check if email exists
4. Hash password
5. Create user record
6. Send welcome email

### [Other workflows...]

## Domain Logic
- [Domain rule 1]
- [Domain rule 2]

## Validation Rules
- [Validation rule 1]
- [Validation rule 2]

## Business Constraints
- [Constraint 1]
- [Constraint 2]
`,
    icon: '🧠'
  },
  'ui.components': {
    type: 'ui.components',
    displayName: 'UI Components',
    description: 'Component library, design system, and UI patterns',
    defaultContent: `# UI Components Context

## Design System
- Primary color: [hex]
- Secondary color: [hex]
- Typography: [font family]
- Spacing: [8px grid system]

## Component Library
### Button
- Variants: primary, secondary, ghost
- Sizes: sm, md, lg
- States: default, hover, active, disabled

### Input
- Types: text, email, password, number
- Validation states: valid, invalid, loading

### [Other components...]

## Layout Patterns
- Header: [description]
- Sidebar: [description]
- Footer: [description]

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
`,
    icon: '🎨'
  },
  'custom': {
    type: 'custom',
    displayName: 'Custom File',
    description: 'Custom context file for specific needs',
    defaultContent: `# Custom Context File

## Description
[Describe what this file is for]

## Content
[Add your custom content here]

## Notes
[Any additional notes or context]
`,
    icon: '📄'
  }
};