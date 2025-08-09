import { useState } from 'react';
import { useCorisaStore } from '../stores/corisaStore';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Brain, 
  FileText, 
  Code, 
  Target, 
  Lightbulb,
  CheckCircle,
  Zap,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import PromptStarter from './PromptStarter';
import ThemeToggle from './ThemeToggle';

export default function LandingPage() {
  const { setCurrentView } = useCorisaStore();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Structured AI Context",
      description: "Insight Files act as the evolving mind of your project, providing deep, rich background for AI to work intelligently.",
      benefits: [
        "AI never guesses - it reads from your insights first",
        "Persistent context that grows with your project",
        "Transparent reasoning and suggestions"
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Intelligent Insight Files",
      description: "Human-readable structured context files that capture project knowledge, decisions, and requirements.",
      benefits: [
        "Project overview and goals",
        "Architectural decisions and patterns",
        "Feature specifications and requirements",
        "Current progress and next steps"
      ]
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Context-Driven Development",
      description: "Every AI interaction references relevant Insight Files automatically, ensuring consistent and informed code generation.",
      benefits: [
        "Consistent code style and patterns",
        "Informed architectural decisions",
        "Better feature implementation",
        "Reduced development time"
      ]
    }
  ];

  const problems = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI Tools Lack Context",
      description: "Most AI coding tools don't understand your project's history, decisions, or specific requirements."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communication Gap",
      description: "There's a disconnect between what you want and what AI generates, leading to iterations and frustration."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Inconsistent Results",
      description: "AI generates different styles and patterns each time, requiring manual alignment and refactoring."
    }
  ];

  const solutions = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Persistent Project Memory",
      description: "Insight Files maintain context across sessions and team members."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Transparent AI Reasoning",
      description: "See exactly which insights the AI is using and why."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Consistent Generation",
      description: "AI follows your established patterns and preferences consistently."
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo and Title */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-bold">
                Corisa AI
              </h1>
              <p className="text-xl text-white/80">AI-Native Development Platform</p>
            </div>
          </div>

          {/* Main Value Proposition */}
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Bridge the communication gap between humans and AI when building software
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Transform how you build software with structured, persistent context that evolves with your project. 
              AI tools that actually understand what you're building and why.
            </p>
            
            {/* Controls + Prompt */}
            <div className="max-w-4xl mx-auto mt-8 space-y-4">
              <div className="flex items-center justify-end">
                {/* @ts-ignore */}
                <ThemeToggle />
              </div>
              <div className="bg-card border border-border p-4 rounded-xl">
                <div className="mb-3 text-left text-muted-foreground font-medium">Start by describing your product</div>
                <PromptStarter />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-muted/50 dark:bg-white/5 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">The Problem</h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Current AI development tools lack the persistent, structured context needed to truly understand your project
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                    {problem.icon}
                  </div>
                  <CardTitle className="text-white">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">The Solution</h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Insight Files provide the structured context AI needs to deliver consistent, informed results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    {solution.icon}
                  </div>
                  <CardTitle className="text-white">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 dark:bg-white/5 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three core components work together to create a seamless AI-native development experience
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white/10 backdrop-blur-md border-white/20 text-white transition-all duration-300 ${
                  activeFeature === index ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl font-bold text-white">
              Ready to transform your development workflow?
            </h3>
            <p className="text-xl text-white/70">
              Join the future of AI-native development with structured context and transparent AI reasoning.
            </p>
                         <Button 
              size="lg"
              onClick={() => setCurrentView('chat')}
              className="text-white px-8 py-3 text-lg"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}