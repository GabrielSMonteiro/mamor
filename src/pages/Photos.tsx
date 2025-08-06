import { useState } from 'react';
import { ArrowLeft, Camera, Plus, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotosProps {
  onBack: () => void;
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
  date: string;
}

export const Photos = ({ onBack }: PhotosProps) => {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: '/placeholder.svg',
      caption: 'Nosso primeiro encontro',
      date: '2024-01-01'
    },
    {
      id: '2', 
      url: '/placeholder.svg',
      caption: 'Jantar romântico',
      date: '2024-01-15'
    },
    {
      id: '3',
      url: '/placeholder.svg', 
      caption: 'Passeio no parque',
      date: '2024-02-01'
    }
  ]);

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleAddPhoto = () => {
    // Em um app real, abriria o seletor de arquivos
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: '/placeholder.svg',
      caption: 'Nova foto especial',
      date: new Date().toISOString().split('T')[0]
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8 pt-8">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Fotos</h1>
            <div className="w-10" />
          </div>

          <div className="text-center space-y-6 mt-20">
            <Camera className="w-20 h-20 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Nenhuma foto ainda</h3>
              <p className="text-muted-foreground">Adicione suas primeiras memórias especiais!</p>
            </div>
            <Button onClick={handleAddPhoto} className="btn-romantic">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Primeira Foto
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Fotos</h1>
          <Button variant="ghost" size="icon" onClick={handleAddPhoto} className="rounded-full hover:bg-primary/10">
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Photo Counter */}
        <div className="text-center mb-6">
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {currentPhotoIndex + 1} de {photos.length}
          </span>
        </div>

        {/* Main Photo Carousel */}
        <div className="relative mb-6">
          <div className="bg-card rounded-3xl p-4 shadow-lg border border-border/50">
            <div className="aspect-square bg-muted rounded-2xl mb-4 overflow-hidden relative group">
              <img 
                src={photos[currentPhotoIndex]?.url} 
                alt={photos[currentPhotoIndex]?.caption}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowFullscreen(true)}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Toque para ampliar</span>
              </div>
            </div>
            
            {photos[currentPhotoIndex]?.caption && (
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground">{photos[currentPhotoIndex].caption}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(photos[currentPhotoIndex].date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={prevPhoto}
                className="rounded-full shadow-lg pointer-events-auto"
              >
                ←
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={nextPhoto}
                className="rounded-full shadow-lg pointer-events-auto"
              >
                →
              </Button>
            </div>
          )}
        </div>

        {/* Photo Actions */}
        <div className="flex gap-3 mb-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleDeletePhoto(photos[currentPhotoIndex].id)}
          >
            <X className="w-4 h-4 mr-2" />
            Remover
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Todas as Fotos</h3>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentPhotoIndex 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Modal */}
        {showFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <img 
                src={photos[currentPhotoIndex]?.url} 
                alt={photos[currentPhotoIndex]?.caption}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button 
                variant="secondary" 
                size="icon"
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};