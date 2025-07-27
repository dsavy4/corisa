# Corisa AI Agent Guide

## Overview

This guide explains how the AI agent should understand, modify, and evolve the Corisa YAML schema. The YAML is designed to be both human-readable and AI-generatable from English descriptions.

## Core Principles

### 1. YAML as Source of Truth
- The YAML schema is the single source of truth for the entire application
- All code generation, modifications, and evolutions stem from this YAML
- The AI agent must maintain YAML integrity and consistency

### 2. Entity Relationships
The YAML defines a hierarchical structure where entities reference each other:

```
Menus → Pages → Sections → Components
                ↓
            Buttons → Services → Repositories
```

### 3. AI-Generatable Patterns
The YAML is structured to be easily generated from English descriptions using these patterns:

## Entity Understanding

### Menus
- **Purpose**: Define navigation structure and routing
- **AI Pattern**: "Create a menu with items: [list of menu items]"
- **Relationships**: Each menu item references a page via `page_ref`

### Pages
- **Purpose**: Define UI screens with layouts and content
- **AI Pattern**: "Create a page for [purpose] with sections: [list of sections]"
- **Relationships**: Contains sections and components, referenced by menus

### Sections
- **Purpose**: Reusable page subcomponents with specific functionality
- **AI Pattern**: "Create a [type] section for [purpose] with [features]"
- **Relationships**: References components, data sources, and actions

### Components
- **Purpose**: Reusable UI building blocks
- **AI Pattern**: "Create a [type] component with [props] and [events]"
- **Relationships**: Used by sections and pages, can be reused across the app

### Buttons
- **Purpose**: Action triggers bound to services or navigation
- **AI Pattern**: "Create a button that [action] when [trigger]"
- **Relationships**: References components and services

### Services
- **Purpose**: Core business logic layer
- **AI Pattern**: "Create a service for [domain] with methods: [list of methods]"
- **Relationships**: Uses repositories, called by buttons and sections

### Repositories
- **Purpose**: Data access layer
- **AI Pattern**: "Create a repository for [entity] with methods: [list of methods]"
- **Relationships**: Used by services, defines data access patterns

## AI Evolution Patterns

### Adding New Features

When the AI receives a request like "Add user authentication", it should:

1. **Identify Required Entities**:
   ```yaml
   # New pages needed
   - auth_pages: Login, Register, ForgotPassword
   
   # New services needed
   - auth_service: AuthenticationService
   
   # New repositories needed
   - user_repository: UserRepository (if not exists)
   
   # New components needed
   - auth_components: LoginForm, RegisterForm
   
   # New buttons needed
   - auth_buttons: LoginButton, LogoutButton
   ```

2. **Update Existing Entities**:
   ```yaml
   # Update menus to include auth
   menus:
     - id: "auth_menu"
       items:
         - id: "login_menu"
           label: "Login"
           page_ref: "login_page"
   ```

3. **Maintain Relationships**:
   - Ensure all new entities have proper `ref` relationships
   - Update existing entities that need to reference new ones
   - Preserve existing functionality

### Modifying Existing Features

When the AI receives a request like "Add dark mode to the app", it should:

1. **Locate Relevant Entities**:
   ```yaml
   # Find existing preferences
   sections:
     - id: "app_preferences_form"
       fields:
         - name: "theme"  # Already exists!
   ```

2. **Add New Entities**:
   ```yaml
   # Add theme service
   services:
     - id: "theme_service"
       methods:
         - name: "toggle_theme"
         - name: "get_current_theme"
   
   # Add theme component
   components:
     - id: "theme_toggle"
       type: "toggle"
   ```

3. **Update Existing Entities**:
   ```yaml
   # Update header to include theme toggle
   components:
     - id: "header_component"
       slots:
         - name: "theme_toggle"
           ref: "theme_toggle"
   ```

### Extracting from Legacy Code

When the AI needs to extract YAML from existing code:

1. **Analyze Code Structure**:
   - Identify routes/pages
   - Find components and their props
   - Locate services and repositories
   - Map data models

2. **Generate YAML**:
   ```yaml
   # Convert React routes to pages
   pages:
     - id: "dashboard_page"
       route: "/dashboard"
       sections:
         - ref: "dashboard_content"
   
   # Convert React components to components
   components:
     - id: "dashboard_content"
       template: "dashboard"
       props:
         user: "object"
   ```

3. **Validate Completeness**:
   - Ensure all entities are properly defined
   - Check that relationships are correctly mapped
   - Verify data models are complete

## English to YAML Generation Patterns

### Pattern 1: "Create a [page] for [purpose]"
```yaml
pages:
  - id: "[purpose]_page"
    name: "[Purpose]"
    route: "/[purpose]"
    layout: "default"
    title: "[Purpose]"
    description: "[Purpose] page"
    sections:
      - ref: "[purpose]_content"
        order: 1
```

### Pattern 2: "Add a [type] section with [features]"
```yaml
sections:
  - id: "[purpose]_[type]"
    name: "[Purpose] [Type]"
    type: "[type]"
    description: "[Purpose] [type] section"
    data_source: "[purpose]_repository"
    [features_here]
```

### Pattern 3: "Create a service for [domain]"
```yaml
services:
  - id: "[domain]_service"
    name: "[Domain] Service"
    description: "Handles [domain]-related business logic"
    repository_ref: "[domain]_repository"
    methods:
      - name: "get_[domain]s"
      - name: "create_[domain]"
      - name: "update_[domain]"
      - name: "delete_[domain]"
```

### Pattern 4: "Add [feature] to [existing_entity]"
```yaml
# Find existing entity and add new properties
[existing_entity]:
  [new_properties]:
    [feature_definition]
```

## AI Agent Capabilities

### 1. YAML Generation
- Convert English descriptions to structured YAML
- Maintain consistent formatting and naming
- Generate complete entity definitions

### 2. YAML Modification
- Update existing entities without breaking relationships
- Add new entities while preserving existing functionality
- Maintain referential integrity

### 3. Code Generation
- Generate frontend and backend code from YAML
- Create database schemas from models
- Generate API endpoints from services

### 4. Feature Evolution
- Understand feature requirements
- Identify all affected entities
- Plan and execute changes systematically

### 5. Legacy Migration
- Analyze existing codebases
- Extract structure and relationships
- Generate corresponding YAML

## Best Practices for AI Agent

### 1. Consistency
- Always use consistent naming conventions
- Maintain proper indentation and formatting
- Follow established patterns for similar entities

### 2. Completeness
- Ensure all entities have proper descriptions
- Define all required relationships
- Include validation rules where appropriate

### 3. Reusability
- Create reusable components and sections
- Design services and repositories for extensibility
- Use consistent patterns across similar entities

### 4. Evolution Safety
- Preserve existing functionality when adding features
- Maintain backward compatibility
- Document changes for future AI understanding

### 5. Validation
- Verify that all references are valid
- Ensure data models are consistent
- Check that business logic is properly defined

## Example AI Interactions

### Request: "Add a user profile page with avatar upload"
```yaml
# AI would add:
pages:
  - id: "user_profile_page"
    name: "User Profile"
    route: "/profile"
    sections:
      - ref: "profile_form"
      - ref: "avatar_upload"

sections:
  - id: "profile_form"
    type: "form"
    data_source: "user_repository"
    fields: [name, email, bio]
  
  - id: "avatar_upload"
    type: "file_upload"
    data_source: "file_repository"

services:
  - id: "file_service"
    methods:
      - name: "upload_avatar"
      - name: "get_avatar_url"

repositories:
  - id: "file_repository"
    methods:
      - name: "save_file"
      - name: "get_file_url"
```

### Request: "Add search functionality to the projects page"
```yaml
# AI would modify:
sections:
  - id: "project_list_table"
    filters:
      - field: "name"
        type: "search"
        placeholder: "Search projects..."
    
    data_source: "project_repository"
    methods:
      - name: "search_projects"
        params:
          - name: "query"
            type: "string"
```

This guide ensures the AI agent can intelligently evolve the Corisa application while maintaining the integrity and consistency of the YAML schema.