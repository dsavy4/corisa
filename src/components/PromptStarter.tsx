import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useCorisaStore } from '../stores/corisaStore';

export default function PromptStarter() {
  const { quickStartFromPrompt, isLoading } = useCorisaStore();
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || submitting || isLoading) return;
    try {
      setSubmitting(true);
      await quickStartFromPrompt(prompt.trim());
      setPrompt('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>Describe what you want to build</span>
        </CardTitle>
        <CardDescription>
          Write in plain English. We’ll create structured Insight Files and start planning your abstract YAML.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A project tracker with projects, tasks, statuses (todo/in_progress/done), and a Kanban board. Include user roles admin/user and authentication."
            rows={4}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!prompt.trim() || submitting || isLoading}>
              {submitting || isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start with AI
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}