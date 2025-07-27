#!/usr/bin/env python3
"""
Corisa Web Interface - ChatGPT-like web interface for AI-native development
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import yaml
import json
import os
import sys
from datetime import datetime
from pathlib import Path
import re

# Import the CorisaAI class from the main tool
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from corisa_ai_tool import CorisaAI

app = Flask(__name__)
CORS(app)

# Initialize Corisa AI
corisa_ai = CorisaAI()

@app.route('/')
def index():
    """Main web interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Process the message
        modifications = corisa_ai.generate_yaml_from_prompt(user_message)
        
        if modifications:
            # Apply modifications
            corisa_ai.apply_modifications(modifications)
            corisa_ai.save_schema()
            
            # Generate response
            response = {
                'type': 'success',
                'message': 'Generated and applied modifications successfully!',
                'modifications': modifications,
                'schema_summary': corisa_ai.show_current_schema()
            }
        else:
            response = {
                'type': 'info',
                'message': "I couldn't understand that request. Try being more specific!",
                'modifications': {},
                'schema_summary': corisa_ai.show_current_schema()
            }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/schema', methods=['GET'])
def get_schema():
    """Get current schema"""
    try:
        return jsonify(corisa_ai.app_schema)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-code', methods=['POST'])
def generate_code():
    """Generate code from current schema"""
    try:
        data = request.get_json()
        code_type = data.get('type', 'all')  # all, frontend, backend, database
        
        code = corisa_ai.generate_code(code_type)
        
        return jsonify({
            'type': 'success',
            'code': code,
            'code_type': code_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/commands', methods=['POST'])
def execute_command():
    """Execute special commands"""
    try:
        data = request.get_json()
        command = data.get('command', '').strip()
        
        if not command:
            return jsonify({'error': 'No command provided'}), 400
        
        result = corisa_ai.process_command(command)
        
        if result:
            return jsonify({
                'type': 'success',
                'result': result
            })
        else:
            return jsonify({
                'type': 'error',
                'message': 'Unknown command'
            }), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save', methods=['POST'])
def save_schema():
    """Save current schema"""
    try:
        corisa_ai.save_schema()
        return jsonify({
            'type': 'success',
            'message': 'Schema saved successfully!'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)