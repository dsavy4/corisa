#!/usr/bin/env python3
"""
Corisa AI Tool Startup Script
Choose between CLI and Web interface modes
"""

import sys
import os
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Corisa AI Tool - AI-native development")
    parser.add_argument("--mode", choices=["cli", "web"], default="web", 
                       help="Interface mode: cli or web (default: web)")
    parser.add_argument("--port", type=int, default=5000, 
                       help="Port for web interface (default: 5000)")
    parser.add_argument("--host", default="0.0.0.0", 
                       help="Host for web interface (default: 0.0.0.0)")
    parser.add_argument("--yaml", default="corisa-app.yaml", 
                       help="YAML schema file (default: corisa-app.yaml)")
    parser.add_argument("--non-interactive", action="store_true", 
                       help="Run CLI in non-interactive mode")
    parser.add_argument("--prompt", help="Single prompt to process (CLI mode)")
    
    args = parser.parse_args()
    
    if args.mode == "cli":
        # Import and run CLI version
        try:
            from corisa_ai_tool import CorisaAI, main as cli_main
            sys.argv = [sys.argv[0]]
            if args.yaml != "corisa-app.yaml":
                sys.argv.extend(["--yaml", args.yaml])
            if args.non_interactive:
                sys.argv.append("--non-interactive")
            if args.prompt:
                sys.argv.extend(["--prompt", args.prompt])
            cli_main()
        except ImportError as e:
            print(f"❌ Error importing CLI module: {e}")
            print("Make sure corisa_ai_tool.py is in the same directory")
            sys.exit(1)
    
    elif args.mode == "web":
        # Import and run web version
        try:
            from corisa_web import app
            print("🚀 Starting Corisa AI Web Interface...")
            print(f"🌐 Open your browser to: http://localhost:{args.port}")
            print("📝 Press Ctrl+C to stop the server")
            app.run(debug=True, host=args.host, port=args.port)
        except ImportError as e:
            print(f"❌ Error importing web module: {e}")
            print("Make sure corisa_web.py and all dependencies are installed")
            print("Run: pip install -r requirements.txt")
            sys.exit(1)

if __name__ == "__main__":
    main()