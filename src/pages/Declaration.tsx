import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeclarationProps {
  onBack: () => void;
}

export const Declaration = ({ onBack }: DeclarationProps) => {
  const [currentDeclaration, setCurrentDeclaration] = useState('');
  const [dayNumber, setDayNumber] = useState(1);

  // Exemplo de declarações - em um app real, isso viria de um banco de dados
  const declarations = [
    "Você é a razão do meu sorriso todos os dias. Cada momento ao seu lado é um presente que guardo no coração. 💕",
    "Quando penso em você, meu coração se enche de uma felicidade que não consigo explicar. Você é minha paz e minha alegria. 🌸",
    "Seus olhos são como estrelas que iluminam meus dias mais escuros. Obrigado por ser minha luz. ✨",
    "Cada dia ao seu lado é uma nova aventura cheia de amor e descobertas. Você torna tudo mais especial. 🦋",
    "Seu sorriso tem o poder de transformar qualquer dia ruim em algo maravilhoso. Você é minha felicidade. 😊"
  ];

  useEffect(() => {
    // Calcula qual declaração mostrar baseado no dia atual
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const declarationIndex = (dayOfYear - 1) % declarations.length;
    const currentDay = ((dayOfYear - 1) % 30) + 1; // Ciclo de 30 dias
    
    setCurrentDeclaration(declarations[declarationIndex]);
    setDayNumber(currentDay);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Declaração</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full hover:bg-primary/10"
          >
            <Edit3 className="w-5 h-5" />
          </Button>
        </div>

        {/* Day Counter */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2">
            <Heart className="w-4 h-4 text-primary mr-2" fill="currentColor" />
            <span className="text-sm font-medium text-primary">
              Dia {dayNumber} de 30
            </span>
          </div>
        </div>

        {/* Declaration Card */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 mb-8">
          <div className="text-center space-y-6">
            <Heart 
              className="w-16 h-16 text-primary mx-auto animate-heart-pulse" 
              fill="currentColor" 
            />
            
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground font-medium">
                {currentDeclaration}
              </p>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground italic">
                  Com todo meu amor ❤️
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Uma nova declaração aparece a cada dia, em um ciclo de 30 mensagens especiais.
          </p>
        </div>
      </div>
    </div>
  );
};