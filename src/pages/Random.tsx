import { useState } from 'react';
import { ArrowLeft, Shuffle, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RandomProps {
  onBack: () => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  suggestions: string[];
}

export const Random = ({ onBack }: RandomProps) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'food',
      name: 'Comida',
      icon: '🍽️',
      suggestions: [
        'Comida Árabe no Habibi',
        'Hamburgueria Gourmet no Madero',
        'Pizza na Bráz Pizzaria',
        'Sushi no Temakeria',
        'Churrascaria Fogo de Chão',
        'Tapioca na feira da Torre',
        'Açaí no Brasília Shopping',
        'Sorvete na Häagen-Dazs',
        'Pastel no Mercado Central',
        'Brigaderia no Brigadeiro'
      ]
    },
    {
      id: 'place',
      name: 'Lugar',
      icon: '📍',
      suggestions: [
        'Pontão do Lago Sul',
        'Parque Olhos D\'Água',
        'Torre de TV',
        'Memorial JK',
        'Jardim Botânico',
        'Parque da Cidade',
        'Lago Paranoá',
        'Catedral de Brasília',
        'Congresso Nacional',
        'Palácio da Alvorada',
        'Shopping Iguatemi',
        'Feira da Torre',
        'Setor de Diversões Sul'
      ]
    },
    {
      id: 'drink',
      name: 'Bebida',
      icon: '🥤',
      suggestions: [
        'Chopp gelado',
        'Caipirinha de limão',
        'Drink tropical',
        'Vinho tinto',
        'Mojito refrescante',
        'Café especial',
        'Smoothie de frutas',
        'Refrigerante artesanal',
        'Água de coco',
        'Suco natural'
      ]
    },
    {
      id: 'activity',
      name: 'Atividade',
      icon: '🎯',
      suggestions: [
        'Cinema no shopping',
        'Caminhada no parque',
        'Karaokê',
        'Boliche',
        'Museu Nacional',
        'Teatro Nacional',
        'Feira de artesanato',
        'Exposição de arte',
        'Show de música',
        'Passeio de bicicleta'
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomResult, setRandomResult] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [editingItem, setEditingItem] = useState<{categoryId: string, index: number, text: string} | null>(null);

  const handleRandomize = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.suggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * category.suggestions.length);
      setRandomResult(category.suggestions[randomIndex]);
      setSelectedCategory(categoryId);
    }
  };

  const handleAddSuggestion = (categoryId: string) => {
    if (newSuggestion.trim()) {
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, suggestions: [...cat.suggestions, newSuggestion.trim()] }
          : cat
      ));
      setNewSuggestion('');
      setShowAddForm(null);
    }
  };

  const handleEditSuggestion = (categoryId: string, index: number, newText: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            suggestions: cat.suggestions.map((suggestion, i) => 
              i === index ? newText : suggestion
            )
          }
        : cat
    ));
    setEditingItem(null);
  };

  const handleDeleteSuggestion = (categoryId: string, index: number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            suggestions: cat.suggestions.filter((_, i) => i !== index)
          }
        : cat
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Indecisão</h1>
          <div className="w-10" />
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Não sabem o que fazer? Deixem o destino escolher! 🎲
          </p>
        </div>

        {/* Random Result */}
        {randomResult && (
          <div className="bg-card rounded-3xl p-6 mb-8 shadow-lg border border-border/50 text-center animate-fade-in">
            <div className="space-y-4">
              <Shuffle className="w-12 h-12 text-primary mx-auto animate-pulse" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Sugestão do Destino:</h3>
                <p className="text-xl font-bold">{randomResult}</p>
              </div>
              <Button 
                onClick={() => handleRandomize(selectedCategory!)} 
                variant="outline"
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-3xl p-6 shadow-lg border border-border/50">
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {category.suggestions.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddForm(category.id)}
                    className="rounded-full hover:bg-primary/10"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                {/* Randomize Button */}
                <Button 
                  onClick={() => handleRandomize(category.id)}
                  className="btn-romantic w-full"
                  disabled={category.suggestions.length === 0}
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Sortear {category.name}
                </Button>

                {/* Add Form */}
                {showAddForm === category.id && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-2xl">
                    <Input
                      value={newSuggestion}
                      onChange={(e) => setNewSuggestion(e.target.value)}
                      placeholder={`Nova sugestão de ${category.name.toLowerCase()}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSuggestion(category.id)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddSuggestion(category.id)}
                        className="flex-1"
                      >
                        Adicionar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowAddForm(null)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Suggestions List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {category.suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      {editingItem?.categoryId === category.id && editingItem?.index === index ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editingItem.text}
                            onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleEditSuggestion(category.id, index, editingItem.text)}
                            className="text-sm"
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleEditSuggestion(category.id, index, editingItem.text)}
                          >
                            ✓
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm">{suggestion}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingItem({categoryId: category.id, index, text: suggestion})}
                              className="h-8 w-8"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSuggestion(category.id, index)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {category.suggestions.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      Nenhuma sugestão ainda. Adicione algumas!
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};