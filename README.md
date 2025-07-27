# Corisa AI - AI-Native Development System

A revolutionary AI-native development system that transforms English descriptions into complete applications using React, TypeScript, and ShadCN UI components.

## Features

- 🤖 **AI-Powered Development**: Transform natural language descriptions into complete application schemas
- 🎨 **Modern UI**: Built with React, TypeScript, and ShadCN UI components
- 📝 **YAML Schema Editor**: Visual editor for application schemas
- 🔧 **Code Generator**: Generate complete applications from schemas
- 📊 **Schema Preview**: Visualize and validate application structures
- 💾 **Import/Export**: Save and load application schemas

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: ShadCN UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd corisa-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Deployment

The application is configured to deploy to Cloudflare Pages:

1. Build the application:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
npm run deploy
```

Or use the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # ShadCN UI components
│   ├── Header.tsx      # Application header
│   ├── ChatInterface.tsx
│   ├── YAMLEditor.tsx
│   ├── CodeGenerator.tsx
│   └── SchemaSummary.tsx
├── stores/             # Zustand state management
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.