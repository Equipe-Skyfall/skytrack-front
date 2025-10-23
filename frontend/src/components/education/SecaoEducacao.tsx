import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SecaoEducacaoProps {
  icone: LucideIcon;
  titulo: string;
  children: React.ReactNode;
  className?: string;
}

const SecaoEducacao: React.FC<SecaoEducacaoProps> = ({ 
  icone: Icone, 
  titulo, 
  children, 
  className = "" 
}) => {
  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <Icone className="h-6 w-6 text-zinc-700" />
        <h2 className="text-2xl font-bold text-zinc-800">{titulo}</h2>
      </div>
      {children}
    </section>
  );
};

export default SecaoEducacao;