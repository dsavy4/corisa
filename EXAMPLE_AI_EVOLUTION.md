# Example: AI Agent Evolution

## Scenario: "Add user authentication with login/logout functionality"

This example demonstrates how the AI agent would intelligently evolve the Corisa YAML schema when given a feature request.

## Step 1: AI Analysis

The AI agent analyzes the request and identifies required entities:

**New Pages Needed:**
- Login page
- Register page  
- Forgot password page

**New Services Needed:**
- Authentication service
- User service (if not exists)

**New Repositories Needed:**
- User repository (if not exists)
- Session repository

**New Components Needed:**
- Login form
- Register form
- Forgot password form

**New Buttons Needed:**
- Login button
- Logout button
- Register button

**Existing Entities to Modify:**
- Main navigation menu (add auth items)
- Header component (add user menu)
- Settings page (add logout option)

## Step 2: YAML Evolution

The AI agent would add these new entities to the YAML:

```yaml
# Add new pages
pages:
  - id: "login_page"
    name: "Login"
    route: "/login"
    layout: "auth"
    title: "Login"
    description: "User authentication login page"
    sections:
      - ref: "login_form"
        order: 1
    components:
      - ref: "auth_header"
        order: 1

  - id: "register_page"
    name: "Register"
    route: "/register"
    layout: "auth"
    title: "Create Account"
    description: "User registration page"
    sections:
      - ref: "register_form"
        order: 1
    components:
      - ref: "auth_header"
        order: 1

  - id: "forgot_password_page"
    name: "Forgot Password"
    route: "/forgot-password"
    layout: "auth"
    title: "Reset Password"
    description: "Password reset request page"
    sections:
      - ref: "forgot_password_form"
        order: 1
    components:
      - ref: "auth_header"
        order: 1

# Add new sections
sections:
  - id: "login_form"
    name: "Login Form"
    type: "form"
    description: "User login form with email and password"
    data_source: "auth_service"
    fields:
      - name: "email"
        label: "Email"
        type: "email"
        required: true
        validation:
          pattern: "^[^@]+@[^@]+\\.[^@]+$"
      - name: "password"
        label: "Password"
        type: "password"
        required: true
        validation:
          min_length: 8
    actions:
      - ref: "login_button"
        trigger: "form_submit"
      - ref: "forgot_password_link"
        trigger: "link_click"

  - id: "register_form"
    name: "Register Form"
    type: "form"
    description: "User registration form"
    data_source: "auth_service"
    fields:
      - name: "first_name"
        label: "First Name"
        type: "text"
        required: true
      - name: "last_name"
        label: "Last Name"
        type: "text"
        required: true
      - name: "email"
        label: "Email"
        type: "email"
        required: true
      - name: "password"
        label: "Password"
        type: "password"
        required: true
      - name: "confirm_password"
        label: "Confirm Password"
        type: "password"
        required: true
    actions:
      - ref: "register_button"
        trigger: "form_submit"

  - id: "forgot_password_form"
    name: "Forgot Password Form"
    type: "form"
    description: "Password reset request form"
    data_source: "auth_service"
    fields:
      - name: "email"
        label: "Email"
        type: "email"
        required: true
    actions:
      - ref: "send_reset_email_button"
        trigger: "form_submit"

# Add new components
components:
  - id: "auth_header"
    name: "Auth Header"
    type: "layout"
    description: "Header for authentication pages"
    template: "auth_header"
    props:
      show_logo: true
      show_back_link: true

  - id: "user_menu"
    name: "User Menu"
    type: "dropdown"
    description: "User account dropdown menu"
    template: "user_menu"
    props:
      show_avatar: true
      show_name: true
    items:
      - label: "Profile"
        action:
          type: "navigation"
          target: "user_profile_page"
      - label: "Settings"
        action:
          type: "navigation"
          target: "settings_page"
      - label: "Logout"
        action:
          type: "service_call"
          service: "auth_service"
          method: "logout"

# Add new buttons
buttons:
  - id: "login_button"
    name: "Login"
    component_ref: "button_component"
    variant: "primary"
    size: "large"
    text: "Sign In"
    icon: "login"
    action:
      type: "service_call"
      service: "auth_service"
      method: "login"
      params:
        email: "{{form.email}}"
        password: "{{form.password}}"
      success:
        type: "navigation"
        target: "dashboard_page"
      error:
        type: "show_message"
        message: "Invalid email or password"

  - id: "register_button"
    name: "Register"
    component_ref: "button_component"
    variant: "primary"
    size: "large"
    text: "Create Account"
    icon: "person_add"
    action:
      type: "service_call"
      service: "auth_service"
      method: "register"
      params:
        first_name: "{{form.first_name}}"
        last_name: "{{form.last_name}}"
        email: "{{form.email}}"
        password: "{{form.password}}"
      success:
        type: "navigation"
        target: "dashboard_page"
      error:
        type: "show_message"
        message: "Registration failed"

  - id: "logout_button"
    name: "Logout"
    component_ref: "button_component"
    variant: "secondary"
    size: "medium"
    text: "Logout"
    icon: "logout"
    action:
      type: "service_call"
      service: "auth_service"
      method: "logout"
      success:
        type: "navigation"
        target: "login_page"

  - id: "send_reset_email_button"
    name: "Send Reset Email"
    component_ref: "button_component"
    variant: "primary"
    size: "large"
    text: "Send Reset Email"
    icon: "email"
    action:
      type: "service_call"
      service: "auth_service"
      method: "send_reset_email"
      params:
        email: "{{form.email}}"
      success:
        type: "show_message"
        message: "Reset email sent successfully"

# Add new services
services:
  - id: "auth_service"
    name: "Authentication Service"
    description: "Handles user authentication and session management"
    repository_ref: "user_repository"
    methods:
      - name: "login"
        description: "Authenticate user with email and password"
        params:
          - name: "email"
            type: "string"
            required: true
          - name: "password"
            type: "string"
            required: true
        returns: "AuthResult"
        business_logic:
          - "Validate email format"
          - "Check password against stored hash"
          - "Create user session"
          - "Return user data and token"

      - name: "register"
        description: "Register new user account"
        params:
          - name: "first_name"
            type: "string"
            required: true
          - name: "last_name"
            type: "string"
            required: true
          - name: "email"
            type: "string"
            required: true
          - name: "password"
            type: "string"
            required: true
        returns: "AuthResult"
        business_logic:
          - "Validate email uniqueness"
          - "Hash password securely"
          - "Create user account"
          - "Send welcome email"
          - "Create initial session"

      - name: "logout"
        description: "Logout current user"
        params: []
        returns: "boolean"
        business_logic:
          - "Invalidate current session"
          - "Clear authentication tokens"
          - "Redirect to login page"

      - name: "send_reset_email"
        description: "Send password reset email"
        params:
          - name: "email"
            type: "string"
            required: true
        returns: "boolean"
        business_logic:
          - "Validate email exists"
          - "Generate reset token"
          - "Send reset email"
          - "Set token expiration"

      - name: "reset_password"
        description: "Reset password with token"
        params:
          - name: "token"
            type: "string"
            required: true
          - name: "new_password"
            type: "string"
            required: true
        returns: "boolean"
        business_logic:
          - "Validate reset token"
          - "Check token expiration"
          - "Update password"
          - "Invalidate token"

# Add new repositories
repositories:
  - id: "user_repository"
    name: "User Repository"
    description: "Handles data access for user entities"
    data_source: "database"
    table: "users"
    methods:
      - name: "find_by_email"
        description: "Find user by email address"
        sql: "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL"
        params:
          - name: "email"
            type: "string"
            required: true

      - name: "create_user"
        description: "Create new user account"
        sql: "INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
        params:
          - name: "first_name"
            type: "string"
            required: true
          - name: "last_name"
            type: "string"
            required: true
          - name: "email"
            type: "string"
            required: true
          - name: "password_hash"
            type: "string"
            required: true
          - name: "created_at"
            type: "datetime"
            required: true

      - name: "update_password"
        description: "Update user password"
        sql: "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?"
        params:
          - name: "password_hash"
            type: "string"
            required: true
          - name: "updated_at"
            type: "datetime"
            required: true
          - name: "id"
            type: "string"
            required: true

  - id: "session_repository"
    name: "Session Repository"
    description: "Handles user session data"
    data_source: "database"
    table: "user_sessions"
    methods:
      - name: "create_session"
        description: "Create new user session"
        sql: "INSERT INTO user_sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)"
        params:
          - name: "user_id"
            type: "string"
            required: true
          - name: "token"
            type: "string"
            required: true
          - name: "expires_at"
            type: "datetime"
            required: true
          - name: "created_at"
            type: "datetime"
            required: true

      - name: "find_by_token"
        description: "Find session by token"
        sql: "SELECT * FROM user_sessions WHERE token = ? AND expires_at > NOW()"
        params:
          - name: "token"
            type: "string"
            required: true

      - name: "delete_session"
        description: "Delete user session"
        sql: "DELETE FROM user_sessions WHERE token = ?"
        params:
          - name: "token"
            type: "string"
            required: true

# Add new models
models:
  AuthResult:
    fields:
      success:
        type: "boolean"
        description: "Authentication success status"
      user:
        type: "User"
        description: "User data if successful"
      token:
        type: "string"
        description: "Authentication token"
      message:
        type: "string"
        description: "Error message if failed"

  User:
    fields:
      id:
        type: "string"
      first_name:
        type: "string"
        required: true
      last_name:
        type: "string"
        required: true
      email:
        type: "string"
        required: true
      password_hash:
        type: "string"
        required: true
      avatar_url:
        type: "string"
      created_at:
        type: "datetime"
      updated_at:
        type: "datetime"

# Modify existing entities
menus:
  - id: "main_navigation"
    items:
      # ... existing items ...
      - id: "auth_menu"
        label: "Account"
        icon: "account_circle"
        type: "dropdown"
        items:
          - id: "login_menu"
            label: "Login"
            route: "/login"
            page_ref: "login_page"
            show_when: "!authenticated"
          - id: "register_menu"
            label: "Register"
            route: "/register"
            page_ref: "register_page"
            show_when: "!authenticated"
          - id: "logout_menu"
            label: "Logout"
            action:
              type: "service_call"
              service: "auth_service"
              method: "logout"
            show_when: "authenticated"

# Update header component to include user menu
components:
  - id: "header_component"
    slots:
      # ... existing slots ...
      - name: "user_menu"
        ref: "user_menu"
        show_when: "authenticated"
```

## Step 3: AI Validation

The AI agent validates the changes:

1. **Referential Integrity**: All `ref` relationships are valid
2. **Data Consistency**: New models are properly defined
3. **Business Logic**: Service methods have clear business logic
4. **UI Flow**: Navigation and user experience make sense
5. **Security**: Authentication patterns follow best practices

## Step 4: Code Generation

The AI agent would then generate:

- **Frontend**: React/Vue components for forms, pages, and navigation
- **Backend**: API endpoints for authentication services
- **Database**: Migration scripts for new tables
- **Middleware**: Authentication middleware for protected routes

## Result

The AI agent successfully evolved the application from a basic project management app to include full user authentication, maintaining all existing functionality while adding the new feature seamlessly.

This demonstrates how Corisa's YAML schema enables intelligent, systematic application evolution through AI-driven development.