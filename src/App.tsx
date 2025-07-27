import { useEffect } from 'react';
import { useCorisaStore } from './stores/corisaStore';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import InsightSidebar from './components/InsightSidebar';
import InsightEditor from './components/InsightEditor';
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
    initializeSchema,
    isProjectLoaded
  } = useCorisaStore();

  useEffect(() => {
    // Initialize the schema when the component mounts
    initializeSchema();
  }, [initializeSchema]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'context':
        return (
          <div className="flex h-full">
            <InsightSidebar />
            <InsightEditor />
          </div>
        );
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
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        {/* Onboarding */}
        {!isProjectLoaded && <Onboarding />}
        
        {/* Main App */}
        {isProjectLoaded && (
          <>
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main className="flex-1 h-[calc(100vh-80px)]">
              <div className="fade-in h-full">
                {renderCurrentView()}
              </div>
            </main>
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <LoadingSpinner />
              <p className="text-center mt-4">Processing your request...</p>
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
    </ThemeProvider>
  );
}

export default App;