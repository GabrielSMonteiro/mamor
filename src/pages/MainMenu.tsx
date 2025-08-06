import { TimeCounter } from '@/components/TimeCounter';
import { MenuOption } from '@/components/MenuOption';
import { Heart, MessageCircle, Camera, List, Shuffle, Music } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
}

export const MainMenu = ({ onNavigate }: MainMenuProps) => {
  // Data de início do relacionamento - você pode configurar isso
  const relationshipStart = new Date('2024-01-01'); // Altere para a data real

  const menuOptions = [
    {
      icon: MessageCircle,
      title: "Declaração",
      description: "Uma declaração especial que muda todos os dias",
      page: "declaration",
      gradient: "from-pink-500/20 to-rose-500/10"
    },
    {
      icon: Camera,
      title: "Fotos",
      description: "Nossa galeria de momentos especiais",
      page: "photos",
      gradient: "from-purple-500/20 to-pink-500/10"
    },
    {
      icon: List,
      title: "50 Coisas",
      description: "Lista de coisas que queremos fazer juntos",
      page: "bucket-list",
      gradient: "from-blue-500/20 to-purple-500/10"
    },
    {
      icon: Shuffle,
      title: "Indecisão",
      description: "Deixe o destino escolher por nós",
      page: "random",
      gradient: "from-green-500/20 to-blue-500/10"
    },
    {
      icon: Music,
      title: "Música",
      description: "Músicas que me fazem lembrar de você",
      page: "music",
      gradient: "from-orange-500/20 to-red-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary mr-2 animate-pulse" fill="currentColor" />
            <h1 className="text-4xl font-bold text-gradient">Mamor</h1>
            <Heart className="w-8 h-8 text-primary ml-2 animate-pulse" fill="currentColor" />
          </div>
          <p className="text-muted-foreground">
            Nosso cantinho especial 💕
          </p>
        </div>

        {/* Time Counter */}
        <div className="flex justify-end">
          <div className="w-64">
            <TimeCounter startDate={relationshipStart} />
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-4">
          {menuOptions.map((option) => (
            <MenuOption
              key={option.page}
              icon={option.icon}
              title={option.title}
              description={option.description}
              gradient={option.gradient}
              onClick={() => onNavigate(option.page)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            Feito com 💖 para você
          </p>
        </div>
      </div>
    </div>
  );
};