import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface MenuOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  gradient?: string;
}

export const MenuOption = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  gradient = "from-primary/10 to-primary/5"
}: MenuOptionProps) => {
  return (
    <button
      onClick={onClick}
      className="menu-card group w-full text-left"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};