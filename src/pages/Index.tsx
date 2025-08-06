import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MainMenu } from '@/pages/MainMenu';
import { Declaration } from '@/pages/Declaration';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('menu');

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('menu');
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  switch (currentPage) {
    case 'declaration':
      return <Declaration onBack={handleBack} />;
    case 'photos':
      // TODO: Implementar página de fotos
      return <div>Fotos - Em breve!</div>;
    case 'bucket-list':
      // TODO: Implementar página de lista
      return <div>Lista de 50 Coisas - Em breve!</div>;
    case 'random':
      // TODO: Implementar página de indecisão
      return <div>Indecisão - Em breve!</div>;
    case 'music':
      // TODO: Implementar página de música
      return <div>Música - Em breve!</div>;
    default:
      return <MainMenu onNavigate={handleNavigate} />;
  }
};

export default Index;
