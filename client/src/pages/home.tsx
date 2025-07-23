import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Trash2, Plus, StickyNote } from "lucide-react";
import { useState } from "react";
import type { Topic as TopicType, InsertTopic } from "@shared/schema";

export default function Home() {
  const [newTopicText, setNewTopicText] = useState("");
  const { toast } = useToast();

  // Fetch topics
  const { data: topics = [], isLoading } = useQuery<TopicType[]>({
    queryKey: ["/api/topics"],
  });

  // Create topic mutation
  const createTopicMutation = useMutation({
    mutationFn: async (topic: InsertTopic) => {
      const response = await apiRequest("POST", "/api/topics", topic);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      setNewTopicText("");
      toast({
        title: "Tópico adicionado com sucesso!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar tópico",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Delete topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/topics?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      toast({
        title: "Tópico removido com sucesso!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover tópico",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim()) {
      toast({
        title: "Por favor, digite um tópico válido",
        variant: "destructive",
      });
      return;
    }
    createTopicMutation.mutate({ text: newTopicText.trim() });
  };

  const handleSearchTopic = (text: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    window.open(searchUrl, "_blank");
    toast({
      title: "Abrindo pesquisa no Google...",
      variant: "default",
    });
  };

  const handleRemoveTopic = (id: number) => {
    deleteTopicMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-medium text-center">Gerenciador de Tópicos</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Topics List */}
        <div className="space-y-3 mb-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-11 h-11 bg-muted rounded-full"></div>
                      <div className="w-11 h-11 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-muted-foreground mb-4">
                <StickyNote className="mx-auto" size={64} />
              </div>
              <p className="text-muted-foreground text-base">Nenhum tópico adicionado ainda</p>
              <p className="text-muted-foreground/70 text-sm mt-2">Adicione seu primeiro tópico abaixo</p>
            </div>
          ) : (
            topics.map((topic) => (
              <Card 
                key={topic.id} 
                className="p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-card border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <p className="text-card-foreground font-normal text-base leading-relaxed">
                      {topic.text}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm min-w-[44px] min-h-[44px] transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={() => handleSearchTopic(topic.text)}
                      title="Pesquisar no Google"
                    >
                      <Search size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full shadow-sm min-w-[44px] min-h-[44px] transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={() => handleRemoveTopic(topic.id)}
                      disabled={deleteTopicMutation.isPending}
                      title="Remover tópico"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Add StickyNote Form - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleAddTopic} className="flex space-x-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Digite um novo tópico..."
                value={newTopicText}
                onChange={(e) => setNewTopicText(e.target.value)}
                className="text-base py-3 px-4 border-input focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createTopicMutation.isPending || !newTopicText.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-medium shadow-sm transition-colors duration-200 min-w-[120px]"
            >
              <Plus className="mr-2" size={18} />
              Adicionar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
