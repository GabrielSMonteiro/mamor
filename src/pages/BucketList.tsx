import { useState } from 'react';
import { ArrowLeft, Plus, Check, Camera, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface BucketListProps {
  onBack: () => void;
}

interface BucketItem {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string;
  photoUrl?: string;
}

export const BucketList = ({ onBack }: BucketListProps) => {
  const [items, setItems] = useState<BucketItem[]>([
    { id: '1', text: 'Jantar no restaurante mais romântico de Brasília', completed: true, completedDate: '2024-01-15', photoUrl: '/placeholder.svg' },
    { id: '2', text: 'Assistir o pôr do sol no Pontão do Lago Sul', completed: true, completedDate: '2024-02-01' },
    { id: '3', text: 'Fazer um piquenique no Parque da Cidade', completed: false },
    { id: '4', text: 'Visitar todos os pontos turísticos de Brasília juntos', completed: false },
    { id: '5', text: 'Fazer uma viagem de fim de semana para Pirenópolis', completed: false }
  ]);

  const [newItemText, setNewItemText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: BucketItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false
      };
      setItems([...items, newItem]);
      setNewItemText('');
      setShowAddForm(false);
    }
  };

  const handleToggleComplete = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const isCompleting = !item.completed;
        return {
          ...item,
          completed: isCompleting,
          completedDate: isCompleting ? new Date().toISOString().split('T')[0] : undefined,
          photoUrl: isCompleting ? item.photoUrl : undefined
        };
      }
      return item;
    }));
  };

  const handleAddPhoto = (itemId: string) => {
    // Em um app real, abriria o seletor de arquivos
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, photoUrl: '/placeholder.svg' }
        : item
    ));
  };

  const handleEditItem = (itemId: string, newText: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, text: newText }
        : item
    ));
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">50 Coisas</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowAddForm(true)}
            className="rounded-full hover:bg-primary/10"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-card rounded-2xl p-4 mb-6 shadow-lg border border-border/50">
          <div className="text-center space-y-3">
            <div className="text-3xl font-bold text-primary">
              {completedCount}/{totalCount}
            </div>
            <p className="text-muted-foreground">
              {completedCount === 0 ? 'Vamos começar nossa jornada!' : 
               completedCount === totalCount ? 'Parabéns! Vocês completaram tudo!' :
               `${Math.round((completedCount / totalCount) * 100)}% concluído`}
            </p>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary-hover h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-card rounded-2xl p-4 mb-6 shadow-lg border border-border/50">
            <div className="space-y-4">
              <h3 className="font-semibold">Adicionar Nova Ideia</h3>
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="O que vocês querem fazer juntos?"
                className="border-primary/20 focus:border-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <div className="flex gap-3">
                <Button onClick={handleAddItem} className="btn-romantic flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-card rounded-2xl p-4 shadow-lg border border-border/50">
              <div className="space-y-3">
                {/* Item Header */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleComplete(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEditItem(item.id, editText)}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditItem(item.id, editText)}
                            className="h-7 px-3 text-xs"
                          >
                            Salvar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditText('');
                            }}
                            className="h-7 px-3 text-xs"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm leading-relaxed ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            <span className="text-xs text-muted-foreground mr-2">#{index + 1}</span>
                            {item.text}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditText(item.text);
                              }}
                              className="h-7 w-7"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-7 w-7 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Completed Info */}
                        {item.completed && (
                          <div className="space-y-3 pt-2 border-t border-border/50">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Check className="w-3 h-3 mr-1 text-primary" />
                              Concluído em {item.completedDate && new Date(item.completedDate).toLocaleDateString('pt-BR')}
                            </div>
                            
                            {item.photoUrl ? (
                              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={item.photoUrl} 
                                  alt="Foto de comprovação"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddPhoto(item.id)}
                                className="w-full"
                              >
                                <Camera className="w-4 h-4 mr-2" />
                                Adicionar Foto de Comprovação
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center space-y-4 mt-20">
            <div className="text-6xl">📝</div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Lista Vazia</h3>
              <p className="text-muted-foreground">Adicionem suas primeiras ideias de coisas para fazer juntos!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};