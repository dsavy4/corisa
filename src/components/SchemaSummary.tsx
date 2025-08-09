'use client';

import { useCorisaStore } from '../stores/corisaStore';
import { 
  FileText, 
  Code, 
  Database, 
  Settings, 
  Users, 
  Layers,
  Activity,
  Calendar
} from 'lucide-react';

export default function SchemaSummary() {
  const { schema, getSchemaSummary } = useCorisaStore();
  const summary = getSchemaSummary();

  const stats = [
    {
      title: 'Pages',
      count: summary.totalPages,
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Components',
      count: summary.totalComponents,
      icon: Code,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Services',
      count: summary.totalServices,
      icon: Settings,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Repositories',
      count: summary.totalRepositories,
      icon: Database,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      title: 'Models',
      count: summary.totalModels,
      icon: Layers,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10'
    },
    {
      title: 'Sections',
      count: summary.totalSections,
      icon: Activity,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10'
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'complex': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="ai-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Schema Overview</h2>
            <p className="text-white/60">
              Complete overview of your application structure and components.
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/60">Last Modified</div>
            <div className="text-white font-medium">
              {new Date(summary.lastModified).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Application</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/60">Name:</span>
                <span className="text-white ml-2">{schema.app.name}</span>
              </div>
              <div>
                <span className="text-white/60">Version:</span>
                <span className="text-white ml-2">{schema.app.version}</span>
              </div>
              <div>
                <span className="text-white/60">Complexity:</span>
                <span className={`ml-2 ${getComplexityColor(summary.complexity)}`}>
                  {summary.complexity}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Metadata</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/60">Author:</span>
                <span className="text-white ml-2">{schema.app.metadata.author}</span>
              </div>
              <div>
                <span className="text-white/60">Created:</span>
                <span className="text-white ml-2">
                  {new Date(schema.app.metadata.created).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-white/60">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {schema.app.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-foreground/70 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">AI Agent</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/60">Version:</span>
                <span className="text-white ml-2">{schema.ai_agent.metadata.version}</span>
              </div>
              <div>
                <span className="text-white/60">Accuracy:</span>
                <span className="text-white ml-2">
                  {(schema.ai_agent.metadata.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-white/60">Capabilities:</span>
                <span className="text-white ml-2">{schema.ai_agent.capabilities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="ai-card">
              <div className="text-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                <div className="text-white/60 text-sm">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages */}
        <div className="ai-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Pages ({schema.pages.length})</span>
          </h3>
          
          {schema.pages.length > 0 ? (
            <div className="space-y-3">
              {schema.pages.map((page, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{page.title}</span>
                    <span className="text-xs text-white/40">{page.layout}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{page.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/40">Route:</span>
                    <code className="text-xs bg-slate-700/50 px-1 rounded text-purple-300">
                      {page.route}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No pages defined yet</p>
          )}
        </div>

        {/* Services */}
        <div className="ai-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <span>Services ({schema.services.length})</span>
          </h3>
          
          {schema.services.length > 0 ? (
            <div className="space-y-3">
              {schema.services.map((service, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{service.name}</span>
                    <span className="text-xs text-white/40">{service.methods.length} methods</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{service.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {service.methods.slice(0, 3).map((method, methodIndex) => (
                      <span
                          key={methodIndex}
                          className="px-2 py-1 bg-muted text-foreground/70 rounded text-xs"
                        >
                        {method.name}
                      </span>
                    ))}
                    {service.methods.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/50 text-white/40 rounded text-xs">
                        +{service.methods.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No services defined yet</p>
          )}
        </div>

        {/* Models */}
        <div className="ai-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-pink-400" />
            <span>Models ({Object.keys(schema.models).length})</span>
          </h3>
          
          {Object.keys(schema.models).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(schema.models).map(([key, model], index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{model.name}</span>
                    <span className="text-xs text-white/40">{model.fields.length} fields</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.fields.slice(0, 3).map((field, fieldIndex) => (
                      <span
                        key={fieldIndex}
                        className="px-2 py-1 bg-pink-600/20 text-pink-300 rounded text-xs"
                      >
                        {field.name}: {field.type}
                      </span>
                    ))}
                    {model.fields.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/50 text-white/40 rounded text-xs">
                        +{model.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No models defined yet</p>
          )}
        </div>

        {/* Components */}
        <div className="ai-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Code className="w-5 h-5 text-green-400" />
            <span>Components ({schema.components.length})</span>
          </h3>
          
          {schema.components.length > 0 ? (
            <div className="space-y-3">
              {schema.components.map((component, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{component.name}</span>
                    <span className="text-xs text-white/40">{component.type}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{component.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {component.props.slice(0, 2).map((prop, propIndex) => (
                      <span
                        key={propIndex}
                        className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs"
                      >
                        {prop.name}
                      </span>
                    ))}
                    {component.props.length > 2 && (
                      <span className="px-2 py-1 bg-slate-700/50 text-white/40 rounded text-xs">
                        +{component.props.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No components defined yet</p>
          )}
        </div>
      </div>
    </div>
  );
}