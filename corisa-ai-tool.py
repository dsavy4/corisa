#!/usr/bin/env python3
"""
Corisa AI Tool - ChatGPT-like interface for AI-native development
A revolutionary tool that generates and evolves YAML schemas from English descriptions
"""

import yaml
import json
import os
import sys
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
import argparse
from pathlib import Path

class CorisaAI:
    def __init__(self, yaml_file: str = "corisa-app.yaml"):
        self.yaml_file = yaml_file
        self.app_schema = self.load_schema()
        self.conversation_history = []
        self.generation_rules = self.load_generation_rules()
        
    def load_schema(self) -> Dict[str, Any]:
        """Load existing YAML schema or create new one"""
        if os.path.exists(self.yaml_file):
            with open(self.yaml_file, 'r') as f:
                return yaml.safe_load(f)
        else:
            return self.create_initial_schema()
    
    def create_initial_schema(self) -> Dict[str, Any]:
        """Create initial empty schema"""
        return {
            "app": {
                "name": "New Corisa App",
                "version": "1.0.0",
                "description": "AI-generated application",
                "metadata": {
                    "created_at": datetime.now().isoformat(),
                    "last_modified": datetime.now().isoformat(),
                    "ai_agent_version": "1.0.0"
                }
            },
            "menus": [],
            "pages": [],
            "sections": [],
            "components": [],
            "buttons": [],
            "services": [],
            "repositories": [],
            "models": {},
            "ai_agent": {
                "capabilities": [
                    "yaml_generation",
                    "yaml_modification", 
                    "code_generation",
                    "feature_evolution",
                    "legacy_migration"
                ]
            }
        }
    
    def load_generation_rules(self) -> Dict[str, Any]:
        """Load AI generation rules and patterns"""
        return {
            "yaml_structure": [
                "Always maintain consistent indentation and formatting",
                "Use descriptive IDs and names for all entities",
                "Include comprehensive descriptions for AI understanding",
                "Define clear relationships between entities using refs",
                "Use consistent naming conventions (snake_case for IDs, PascalCase for types)"
            ],
            "entity_relationships": [
                "Pages contain sections and components",
                "Sections reference components and data sources",
                "Buttons trigger actions on services",
                "Services use repositories for data access",
                "Components can be reused across multiple sections"
            ],
            "ai_evolution": [
                "When adding features, identify all required entities",
                "Maintain referential integrity in YAML",
                "Update related entities when modifying existing ones",
                "Preserve existing functionality when evolving",
                "Document changes for future AI understanding"
            ],
            "patterns": {
                "add_page": "Create a [page] for [purpose] with sections: [list]",
                "add_section": "Create a [type] section for [purpose] with [features]",
                "add_service": "Create a service for [domain] with methods: [list]",
                "add_component": "Create a [type] component with [props] and [events]",
                "add_button": "Create a button that [action] when [trigger]"
            }
        }
    
    def display_logo(self):
        """Display Corisa logo and welcome message"""
        logo = """
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██████╗ ██████╗ ██████╗ ██╗███████╗ █████╗             ║
║   ██╔════╝██╔═══██╗██╔══██╗██║██╔════╝██╔══██╗            ║
║   ██║     ██║   ██║██████╔╝██║███████╗███████║            ║
║   ██║     ██║   ██║██╔══██╗██║╚════██║██╔══██║            ║
║   ╚██████╗╚██████╔╝██║  ██║██║███████║██║  ██║            ║
║    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝            ║
║                                                              ║
║              AI-Native Development System                    ║
║                                                              ║
║  Transform English descriptions into complete applications   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
        """
        print(logo)
        print("🤖 Welcome to Corisa AI Tool!")
        print("💡 Describe your app in English, and I'll generate the YAML schema and code.")
        print("🔄 I can evolve your app over multiple iterations.")
        print("📝 Type 'help' for commands, 'exit' to quit.\n")
    
    def save_schema(self):
        """Save current schema to YAML file"""
        with open(self.yaml_file, 'w') as f:
            yaml.dump(self.app_schema, f, default_flow_style=False, indent=2, sort_keys=False)
        print(f"💾 Schema saved to {self.yaml_file}")
    
    def analyze_prompt(self, prompt: str) -> Dict[str, Any]:
        """Analyze user prompt and determine required actions"""
        prompt_lower = prompt.lower()
        
        analysis = {
            "action_type": "unknown",
            "entities_needed": [],
            "modifications": [],
            "new_features": [],
            "priority": "medium"
        }
        
        # Detect action types
        if any(word in prompt_lower for word in ["add", "create", "new", "build"]):
            analysis["action_type"] = "add_feature"
        elif any(word in prompt_lower for word in ["modify", "change", "update", "edit"]):
            analysis["action_type"] = "modify_feature"
        elif any(word in prompt_lower for word in ["remove", "delete", "drop"]):
            analysis["action_type"] = "remove_feature"
        elif any(word in prompt_lower for word in ["show", "display", "view", "list"]):
            analysis["action_type"] = "show_info"
        
        # Detect entities
        if "page" in prompt_lower:
            analysis["entities_needed"].append("page")
        if "form" in prompt_lower or "input" in prompt_lower:
            analysis["entities_needed"].append("section")
        if "button" in prompt_lower or "action" in prompt_lower:
            analysis["entities_needed"].append("button")
        if "service" in prompt_lower or "api" in prompt_lower:
            analysis["entities_needed"].append("service")
        if "database" in prompt_lower or "data" in prompt_lower:
            analysis["entities_needed"].append("repository")
        if "component" in prompt_lower or "ui" in prompt_lower:
            analysis["entities_needed"].append("component")
        if "menu" in prompt_lower or "navigation" in prompt_lower:
            analysis["entities_needed"].append("menu")
        
        return analysis
    
    def generate_yaml_from_prompt(self, prompt: str) -> Dict[str, Any]:
        """Generate YAML modifications based on English prompt"""
        analysis = self.analyze_prompt(prompt)
        modifications = {}
        
        # Extract key information from prompt
        prompt_lower = prompt.lower()
        
        # Generate new entities based on prompt
        if analysis["action_type"] == "add_feature":
            modifications = self.generate_new_entities(prompt, analysis)
        elif analysis["action_type"] == "modify_feature":
            modifications = self.modify_existing_entities(prompt, analysis)
        elif analysis["action_type"] == "show_info":
            return self.show_current_schema()
        
        return modifications
    
    def generate_new_entities(self, prompt: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate new entities based on prompt"""
        prompt_lower = prompt.lower()
        new_entities = {}
        
        # Extract entity names and purposes
        entity_matches = re.findall(r'(\w+)\s+(?:page|form|service|component|button)', prompt_lower)
        
        for entity_name in entity_matches:
            if "page" in prompt_lower:
                new_entities["pages"] = new_entities.get("pages", [])
                new_entities["pages"].append(self.generate_page_entity(entity_name, prompt))
            
            if "form" in prompt_lower or "input" in prompt_lower:
                new_entities["sections"] = new_entities.get("sections", [])
                new_entities["sections"].append(self.generate_form_section(entity_name, prompt))
            
            if "service" in prompt_lower:
                new_entities["services"] = new_entities.get("services", [])
                new_entities["services"].append(self.generate_service_entity(entity_name, prompt))
            
            if "button" in prompt_lower:
                new_entities["buttons"] = new_entities.get("buttons", [])
                new_entities["buttons"].append(self.generate_button_entity(entity_name, prompt))
        
        return new_entities
    
    def generate_page_entity(self, entity_name: str, prompt: str) -> Dict[str, Any]:
        """Generate a new page entity"""
        page_id = f"{entity_name}_page"
        
        return {
            "id": page_id,
            "name": entity_name.title(),
            "route": f"/{entity_name}",
            "layout": "default",
            "title": f"{entity_name.title()}",
            "description": f"{entity_name.title()} page generated from prompt: {prompt}",
            "sections": [
                {
                    "ref": f"{entity_name}_content",
                    "order": 1,
                    "config": {
                        "title": f"{entity_name.title()} Content"
                    }
                }
            ],
            "components": [
                {
                    "ref": "header_component",
                    "order": 1
                }
            ]
        }
    
    def generate_form_section(self, entity_name: str, prompt: str) -> Dict[str, Any]:
        """Generate a new form section"""
        section_id = f"{entity_name}_form"
        
        return {
            "id": section_id,
            "name": f"{entity_name.title()} Form",
            "type": "form",
            "description": f"Form for {entity_name} generated from prompt: {prompt}",
            "data_source": f"{entity_name}_repository",
            "fields": [
                {
                    "name": "name",
                    "label": "Name",
                    "type": "text",
                    "required": True,
                    "validation": {
                        "min_length": 3,
                        "max_length": 100
                    }
                },
                {
                    "name": "description",
                    "label": "Description",
                    "type": "textarea",
                    "rows": 4
                }
            ],
            "actions": [
                {
                    "ref": f"save_{entity_name}_button",
                    "trigger": "form_submit"
                }
            ]
        }
    
    def generate_service_entity(self, entity_name: str, prompt: str) -> Dict[str, Any]:
        """Generate a new service entity"""
        service_id = f"{entity_name}_service"
        
        return {
            "id": service_id,
            "name": f"{entity_name.title()} Service",
            "description": f"Handles {entity_name}-related business logic",
            "repository_ref": f"{entity_name}_repository",
            "methods": [
                {
                    "name": f"get_{entity_name}s",
                    "description": f"Retrieve list of {entity_name}s",
                    "params": [
                        {
                            "name": "filters",
                            "type": "object",
                            "required": False
                        }
                    ],
                    "returns": f"{entity_name.title()}[]",
                    "business_logic": [
                        f"Apply filters if provided",
                        f"Retrieve {entity_name} data",
                        f"Transform for UI consumption"
                    ]
                },
                {
                    "name": f"create_{entity_name}",
                    "description": f"Create new {entity_name}",
                    "params": [
                        {
                            "name": f"{entity_name}_data",
                            "type": f"{entity_name.title()}Create",
                            "required": True
                        }
                    ],
                    "returns": f"{entity_name.title()}",
                    "business_logic": [
                        f"Validate {entity_name} data",
                        f"Set default values",
                        f"Create {entity_name} record"
                    ]
                }
            ]
        }
    
    def generate_button_entity(self, entity_name: str, prompt: str) -> Dict[str, Any]:
        """Generate a new button entity"""
        button_id = f"save_{entity_name}_button"
        
        return {
            "id": button_id,
            "name": f"Save {entity_name.title()}",
            "component_ref": "button_component",
            "variant": "primary",
            "size": "medium",
            "text": f"Save {entity_name.title()}",
            "icon": "save",
            "action": {
                "type": "service_call",
                "service": f"{entity_name}_service",
                "method": f"create_{entity_name}",
                "params": {
                    f"{entity_name}_data": "{{form}}"
                },
                "success": {
                    "type": "navigation",
                    "target": f"{entity_name}_page"
                },
                "error": {
                    "type": "show_message",
                    "message": f"Failed to save {entity_name}"
                }
            }
        }
    
    def modify_existing_entities(self, prompt: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Modify existing entities based on prompt"""
        # This would implement logic to modify existing entities
        # For now, return empty dict
        return {}
    
    def show_current_schema(self) -> Dict[str, Any]:
        """Show current schema information"""
        return {
            "type": "info",
            "message": "Current Schema Overview",
            "data": {
                "pages": len(self.app_schema.get("pages", [])),
                "sections": len(self.app_schema.get("sections", [])),
                "components": len(self.app_schema.get("components", [])),
                "services": len(self.app_schema.get("services", [])),
                "repositories": len(self.app_schema.get("repositories", [])),
                "buttons": len(self.app_schema.get("buttons", [])),
                "menus": len(self.app_schema.get("menus", []))
            }
        }
    
    def apply_modifications(self, modifications: Dict[str, Any]):
        """Apply generated modifications to the schema"""
        for entity_type, entities in modifications.items():
            if entity_type in self.app_schema:
                if isinstance(entities, list):
                    self.app_schema[entity_type].extend(entities)
                elif isinstance(entities, dict):
                    self.app_schema[entity_type].update(entities)
            else:
                self.app_schema[entity_type] = entities
        
        # Update metadata
        self.app_schema["app"]["metadata"]["last_modified"] = datetime.now().isoformat()
    
    def generate_code(self, entity_type: str = None) -> str:
        """Generate code from current YAML schema"""
        code_output = []
        
        if entity_type is None or entity_type == "frontend":
            code_output.append(self.generate_frontend_code())
        
        if entity_type is None or entity_type == "backend":
            code_output.append(self.generate_backend_code())
        
        if entity_type is None or entity_type == "database":
            code_output.append(self.generate_database_code())
        
        return "\n\n".join(code_output)
    
    def generate_frontend_code(self) -> str:
        """Generate frontend code (React/Vue) from YAML"""
        code = ["// Frontend Code Generated by Corisa AI\n"]
        
        # Generate page components
        for page in self.app_schema.get("pages", []):
            code.append(f"// {page['name']} Page Component")
            code.append(f"function {page['id'].replace('_', '')}() {{")
            code.append("  return (")
            code.append("    <div className='page'>")
            
            # Add sections
            for section in page.get("sections", []):
                code.append(f"      <{section['ref'].replace('_', '')} />")
            
            code.append("    </div>")
            code.append("  );")
            code.append("}\n")
        
        return "\n".join(code)
    
    def generate_backend_code(self) -> str:
        """Generate backend code from YAML"""
        code = ["// Backend Code Generated by Corisa AI\n"]
        
        # Generate services
        for service in self.app_schema.get("services", []):
            code.append(f"// {service['name']}")
            code.append(f"class {service['id'].replace('_', '')} {{")
            
            for method in service.get("methods", []):
                code.append(f"  async {method['name']}(params) {{")
                code.append(f"    // {method['description']}")
                code.append("    // Implementation here")
                code.append("  }")
            
            code.append("}\n")
        
        return "\n".join(code)
    
    def generate_database_code(self) -> str:
        """Generate database schema from YAML"""
        code = ["-- Database Schema Generated by Corisa AI\n"]
        
        # Generate tables from models
        for model_name, model in self.app_schema.get("models", {}).items():
            table_name = model_name.lower() + "s"
            code.append(f"CREATE TABLE {table_name} (")
            
            fields = []
            for field_name, field in model.get("fields", {}).items():
                field_type = self.map_field_type(field.get("type", "string"))
                nullable = "" if field.get("required", False) else "NULL"
                fields.append(f"  {field_name} {field_type} {nullable}")
            
            code.append(",\n".join(fields))
            code.append(");\n")
        
        return "\n".join(code)
    
    def map_field_type(self, yaml_type: str) -> str:
        """Map YAML field types to SQL types"""
        type_mapping = {
            "string": "VARCHAR(255)",
            "text": "TEXT",
            "number": "INTEGER",
            "float": "FLOAT",
            "boolean": "BOOLEAN",
            "datetime": "TIMESTAMP",
            "date": "DATE",
            "email": "VARCHAR(255)"
        }
        return type_mapping.get(yaml_type, "VARCHAR(255)")
    
    def process_command(self, command: str) -> str:
        """Process special commands"""
        command_lower = command.lower().strip()
        
        if command_lower == "help":
            return self.show_help()
        elif command_lower == "save":
            self.save_schema()
            return "Schema saved successfully!"
        elif command_lower == "show":
            return self.show_current_schema()
        elif command_lower.startswith("generate"):
            parts = command_lower.split()
            entity_type = parts[1] if len(parts) > 1 else None
            return self.generate_code(entity_type)
        elif command_lower == "clear":
            self.conversation_history = []
            return "Conversation history cleared!"
        else:
            return None
    
    def show_help(self) -> str:
        """Show help information"""
        return """
🤖 Corisa AI Tool Commands:

📝 General:
  help                    - Show this help message
  save                    - Save current schema to YAML file
  show                    - Show current schema overview
  clear                   - Clear conversation history
  exit                    - Exit the tool

🔧 Code Generation:
  generate                - Generate all code (frontend, backend, database)
  generate frontend       - Generate frontend code only
  generate backend        - Generate backend code only
  generate database       - Generate database schema only

💡 Examples:
  "Add a user profile page with avatar upload"
  "Create a payment form with Stripe integration"
  "Add search functionality to the projects page"
  "Modify the dashboard to show user statistics"

🔄 The AI will:
  - Analyze your request
  - Generate/modify YAML schema
  - Create corresponding code
  - Maintain relationships and consistency
        """
    
    def run(self):
        """Main interactive loop"""
        self.display_logo()
        
        while True:
            try:
                user_input = input("\n💬 You: ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() == "exit":
                    print("👋 Goodbye! Your schema has been saved.")
                    break
                
                # Check for special commands
                command_result = self.process_command(user_input)
                if command_result:
                    print(f"🤖 Corisa: {command_result}")
                    continue
                
                # Process as a prompt
                print("🤖 Corisa: Analyzing your request...")
                
                # Generate YAML modifications
                modifications = self.generate_yaml_from_prompt(user_input)
                
                if modifications:
                    # Apply modifications
                    self.apply_modifications(modifications)
                    
                    # Save automatically
                    self.save_schema()
                    
                    # Show what was added
                    print("✅ Generated and applied the following:")
                    for entity_type, entities in modifications.items():
                        if isinstance(entities, list):
                            print(f"  📄 {entity_type}: {len(entities)} new entities")
                        else:
                            print(f"  📄 {entity_type}: modified")
                    
                    # Offer to generate code
                    print("\n💻 Would you like me to generate code for these changes? (y/n)")
                    if input().lower().startswith('y'):
                        code = self.generate_code()
                        print("\n🔧 Generated Code:")
                        print("=" * 50)
                        print(code)
                        print("=" * 50)
                else:
                    print("❓ I couldn't understand that request. Try being more specific!")
                
                # Add to conversation history
                self.conversation_history.append({
                    "user": user_input,
                    "ai_response": modifications,
                    "timestamp": datetime.now().isoformat()
                })
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Your schema has been saved.")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                print("Please try again or type 'help' for assistance.")

def main():
    parser = argparse.ArgumentParser(description="Corisa AI Tool - AI-native development")
    parser.add_argument("--yaml", default="corisa-app.yaml", help="YAML schema file")
    parser.add_argument("--non-interactive", action="store_true", help="Run in non-interactive mode")
    parser.add_argument("--prompt", help="Single prompt to process")
    
    args = parser.parse_args()
    
    corisa = CorisaAI(args.yaml)
    
    if args.non_interactive and args.prompt:
        # Process single prompt
        modifications = corisa.generate_yaml_from_prompt(args.prompt)
        if modifications:
            corisa.apply_modifications(modifications)
            corisa.save_schema()
            print("✅ Schema updated successfully!")
        else:
            print("❌ No modifications generated")
    else:
        # Interactive mode
        corisa.run()

if __name__ == "__main__":
    main()