import { TimeCounter } from "@/components/TimeCounter";
import { MenuOption } from "@/components/MenuOption";
import {
  Heart,
  MessageCircle,
  Camera,
  List,
  Shuffle,
  Music,
} from "lucide-react";
import { useState, useEffect } from "react";

const HeartsEffect = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {[...Array(20)].map((_, i) => (
      <Heart
        key={i}
        className={`absolute animate-float`}
        style={{
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 80}%`,
          color: "#e11d48",
          opacity: 0.7,
          width: 24,
          height: 24,
          animationDelay: `${Math.random() * 2}s`,
        }}
        fill="currentColor"
      />
    ))}
    <style>
      {`
        @keyframes float {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-100px) scale(1.2);}
        }
        .animate-float {
          animation: float 2.5s linear infinite;
        }
      `}
    </style>
  </div>
);

interface MainMenuProps {
  onNavigate: (page: string) => void;
}

export const MainMenu = ({ onNavigate }: MainMenuProps) => {
  // Data de início do relacionamento - você pode configurar isso
  const relationshipStart = new Date("2025-04-22T10:00:00"); // Altere para a data real

  const menuOptions = [
    {
      icon: MessageCircle,
      title: "Declaração",
      description: "Uma declaração especial que muda todos os dias",
      page: "declaration",
      gradient: "from-pink-500/20 to-rose-500/10",
    },
    {
      icon: Camera,
      title: "Fotos",
      description: "Nossa galeria de momentos especiais",
      page: "photos",
      gradient: "from-purple-500/20 to-pink-500/10",
    },
    {
      icon: List,
      title: "50 Coisas",
      description: "Lista de coisas que queremos fazer juntos",
      page: "bucket-list",
      gradient: "from-blue-500/20 to-purple-500/10",
    },
    {
      icon: Shuffle,
      title: "Indecisão",
      description: "Deixe o destino escolher por nós",
      page: "random",
      gradient: "from-green-500/20 to-blue-500/10",
    },
    {
      icon: Music,
      title: "Música",
      description: "Músicas que me fazem lembrar de você",
      page: "music",
      gradient: "from-orange-500/20 to-red-500/10",
    },
  ];

  const [showConfirm, setShowConfirm] = useState(false);
  const [datingStart, setDatingStart] = useState<Date | null>(null);
  const [showHearts, setShowHearts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedDatingStart = localStorage.getItem("mamor_dating_start");
        if (savedDatingStart) {
          setDatingStart(new Date(savedDatingStart));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  const handleSimClick = () => {
    // Só permite clicar se ainda não está namorando
    if (!datingStart) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    const now = new Date();
    setDatingStart(now);
    setShowConfirm(false);
    setShowHearts(true);

    // Salvar no localStorage para persistir
    try {
      localStorage.setItem("mamor_dating_start", now.toISOString());
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }

    setTimeout(() => setShowHearts(false), 3000);
  };

  // Mostrar loading enquanto carrega os dados
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
        <Heart
          className="w-8 h-8 text-primary animate-pulse"
          fill="currentColor"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 relative">
      {/* Header com título */}
      <div className="text-center pt-6 pb-4">
        <div className="flex items-center justify-center mb-2">
          <Heart
            className="w-6 h-6 text-primary mr-2 animate-pulse"
            fill="currentColor"
          />
          <h1 className="text-3xl font-bold text-gradient">Mamor</h1>
          <Heart
            className="w-6 h-6 text-primary ml-2 animate-pulse"
            fill="currentColor"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Nosso cantinho especial 💕
        </p>
      </div>

      {/* Time Counters - Mais delicados */}
      <div className="w-full px-4 mb-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/20">
          {/* Contador principal - Juntos */}
          <div
            className={datingStart ? "mb-3 pb-3 border-b border-white/30" : ""}
          >
            <div className="text-center font-medium text-primary mb-2 text-sm">
              Juntos há:
            </div>
            <div className="text-center">
              <TimeCounter startDate={relationshipStart} compact={true} />
            </div>
          </div>

          {/* Contador de namoro - se existir */}
          {datingStart && (
            <div>
              <div className="text-center font-medium text-pink-600 mb-2 text-sm">
                Namorando há:
              </div>
              <div className="text-center">
                <TimeCounter startDate={datingStart} compact={true} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Options - Centralizado */}
      <div className="flex-1 px-4">
        <div className="max-w-md mx-auto space-y-3">
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
      </div>

      {/* Footer com botão Sim pequeno */}
      <div className="text-center py-6">
        <p className="text-xs text-muted-foreground mb-3">
          Feito com 💖 para você
        </p>

        {/* Botão Sim? - Pequeno e só funciona uma vez */}
        {!datingStart && (
          <button
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-pink-100 text-pink-700 hover:bg-pink-200 hover:scale-105 shadow-sm"
            onClick={handleSimClick}
          >
            Sim? 💕
          </button>
        )}

        {datingStart && (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-pink-600 text-white shadow-sm">
            <Heart className="w-4 h-4 mr-1" fill="currentColor" />
            Namorando 💖
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-sm w-full">
            <div className="mb-4">
              <Heart
                className="w-12 h-12 text-pink-600 mx-auto mb-3"
                fill="currentColor"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Que pergunta especial! 💕
              </h3>
              <p className="text-gray-600">
                Tem certeza que quer começar essa jornada juntos?
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                className="flex-1 bg-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
                onClick={handleConfirm}
              >
                Sim, quero! 💖
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                Ainda não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Efeito de corações */}
      {showHearts && <HeartsEffect />}
    </div>
  );
};
