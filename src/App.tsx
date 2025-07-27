import { useEffect } from 'react';
import { useCorisaStore } from './stores/corisaStore';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import YAMLEditor from './components/YAMLEditor';
import CodeGenerator from './components/CodeGenerator';
import SchemaSummary from './components/SchemaSummary';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorToast from './components/ErrorToast';

function App() {
  const { 
    currentView, 
    isLoading, 
    error, 
    setError,
    initializeSchema 
  } = useCorisaStore();

  useEffect(() => {
    // Initialize the schema when the component mounts
    initializeSchema();
  }, [initializeSchema]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'yaml':
        return <YAMLEditor />;
      case 'code':
        return <CodeGenerator />;
      case 'preview':
        return <SchemaSummary />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="fade-in">
          {renderCurrentView()}
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card">
            <LoadingSpinner />
            <p className="text-white text-center mt-4">Processing your request...</p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
}

export default App;