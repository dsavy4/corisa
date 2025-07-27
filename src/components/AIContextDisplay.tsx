import { useCorisaStore } from '../stores/corisaStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Brain, 
  FileText, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AIInsightReference } from '../types/insights';

export default function AIContextDisplay() {
  const { aiGenerationContext, insightFiles } = useCorisaStore();

  if (!aiGenerationContext) {
    return null;
  }

  const getInsightFile = (id: string) => {
    return insightFiles.find(f => f.id === id);
  };

  const getRelevanceColor = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30';
    }
  };

  const getRelevanceIcon = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return <CheckCircle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Context Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>AI Context Analysis</span>
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Here's what the AI is considering when processing your request:
          </p>
        </CardContent>
      </Card>

      {/* Referenced Insights */}
      {aiGenerationContext.referencedInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base">
              <FileText className="w-4 h-4" />
              <span>Referenced Insight Files</span>
              <Badge variant="secondary" className="ml-2">
                {aiGenerationContext.referencedInsights.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiGenerationContext.referencedInsights.map((reference, index) => {
              const insightFile = getInsightFile(reference.insightId);
              if (!insightFile) return null;

              return (
                <div 
                  key={index}
                  className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{insightFile.metadata.category === 'project' ? '🎯' : 
                        insightFile.metadata.category === 'technical' ? '⚙️' :
                        insightFile.metadata.category === 'design' ? '🎨' :
                        insightFile.metadata.category === 'business' ? '💼' : '🤖'}</span>
                      <span className="font-medium text-sm">{insightFile.displayName}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRelevanceColor(reference.relevance)}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getRelevanceIcon(reference.relevance)}
                        <span className="capitalize">{reference.relevance}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {insightFile.description}
                  </p>
                  <div className="text-xs bg-muted/50 p-2 rounded border-l-2 border-purple-500">
                    <strong>Relevant Context:</strong> {reference.context}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Missing Insights */}
      {aiGenerationContext.missingInsights.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base text-orange-700 dark:text-orange-300">
              <Lightbulb className="w-4 h-4" />
              <span>Suggested Insight Files</span>
              <Badge variant="outline" className="ml-2 border-orange-300 text-orange-700 dark:text-orange-300">
                {aiGenerationContext.missingInsights.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">
              The AI suggests creating these Insight Files to provide better context:
            </p>
            <div className="space-y-2">
              {aiGenerationContext.missingInsights.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-700 dark:text-orange-300">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context Summary */}
      {aiGenerationContext.contextSummary && (
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base text-blue-700 dark:text-blue-300">
              <Brain className="w-4 h-4" />
              <span>AI Context Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
              {aiGenerationContext.contextSummary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}