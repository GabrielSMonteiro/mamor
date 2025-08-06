import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MainMenu } from '@/pages/MainMenu';
import { Declaration } from '@/pages/Declaration';
import { Photos } from '@/pages/Photos';
import { BucketList } from '@/pages/BucketList';
import { Random } from '@/pages/Random';
import { Music } from '@/pages/Music';

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
      return <Photos onBack={handleBack} />;
    case 'bucket-list':
      return <BucketList onBack={handleBack} />;
    case 'random':
      return <Random onBack={handleBack} />;
    case 'music':
      return <Music onBack={handleBack} />;
    default:
      return <MainMenu onNavigate={handleNavigate} />;
  }
};

export default Index;
