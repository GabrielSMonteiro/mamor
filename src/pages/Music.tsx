import { useState } from 'react';
import { ArrowLeft, Plus, Play, Pause, ExternalLink, Search, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MusicProps {
  onBack: () => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover: string;
  spotifyUrl: string;
  reason: string;
  dateAdded: string;
}

export const Music = ({ onBack }: MusicProps) => {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '1',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      cover: '/placeholder.svg',
      spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
      reason: 'Nossa música do primeiro encontro',
      dateAdded: '2024-01-01'
    },
    {
      id: '2', 
      title: 'All of Me',
      artist: 'John Legend',
      album: 'Love in the Future',
      cover: '/placeholder.svg',
      spotifyUrl: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a',
      reason: 'Me lembra do seu sorriso',
      dateAdded: '2024-01-15'
    },
    {
      id: '3',
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran', 
      album: 'x (Multiply)',
      cover: '/placeholder.svg',
      spotifyUrl: 'https://open.spotify.com/track/lp7lVi5SHSkTp4ep34s3y2',
      reason: 'Para quando dançamos juntos',
      dateAdded: '2024-02-01'
    }
  ]);

  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    reason: '',
    spotifyUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handlePlayPause = (songId: string) => {
    if (currentPlaying === songId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(songId);
      // Em um app real, integraria com a API do Spotify
    }
  };

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.reason) {
      const song: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
        album: newSong.album,
        cover: '/placeholder.svg',
        spotifyUrl: newSong.spotifyUrl || '#',
        reason: newSong.reason,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      
      setSongs([...songs, song]);
      setNewSong({ title: '', artist: '', album: '', reason: '', spotifyUrl: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteSong = (songId: string) => {
    setSongs(songs.filter(song => song.id !== songId));
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Música</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowAddForm(true)}
            className="rounded-full hover:bg-primary/10"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Músicas que me fazem lembrar de você 🎵
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar músicas..."
            className="pl-10 border-primary/20 focus:border-primary"
          />
        </div>

        {/* Stats */}
        <div className="bg-card rounded-2xl p-4 mb-6 shadow-lg border border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{songs.length}</div>
            <p className="text-sm text-muted-foreground">
              {songs.length === 1 ? 'música especial' : 'músicas especiais'}
            </p>
          </div>
        </div>

        {/* Add Song Form */}
        {showAddForm && (
          <div className="bg-card rounded-3xl p-6 mb-6 shadow-lg border border-border/50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adicionar Nova Música</h3>
              
              <div className="space-y-3">
                <Input
                  value={newSong.title}
                  onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                  placeholder="Nome da música"
                />
                <Input
                  value={newSong.artist}
                  onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                  placeholder="Artista"
                />
                <Input
                  value={newSong.album}
                  onChange={(e) => setNewSong({...newSong, album: e.target.value})}
                  placeholder="Álbum (opcional)"
                />
                <Input
                  value={newSong.reason}
                  onChange={(e) => setNewSong({...newSong, reason: e.target.value})}
                  placeholder="Por que essa música me lembra de você?"
                />
                <Input
                  value={newSong.spotifyUrl}
                  onChange={(e) => setNewSong({...newSong, spotifyUrl: e.target.value})}
                  placeholder="Link do Spotify (opcional)"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddSong} className="btn-romantic flex-1">
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

        {/* Songs List */}
        <div className="space-y-4">
          {filteredSongs.map((song) => (
            <div key={song.id} className="bg-card rounded-3xl p-4 shadow-lg border border-border/50">
              <div className="flex space-x-4">
                {/* Album Cover */}
                <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={song.cover} 
                    alt={`${song.album} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Song Info */}
                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                    {song.album && (
                      <p className="text-xs text-muted-foreground">{song.album}</p>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm italic text-muted-foreground">
                      "{song.reason}"
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePlayPause(song.id)}
                        className="h-8 w-8"
                      >
                        {currentPlaying === song.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      
                      {song.spotifyUrl && song.spotifyUrl !== '#' && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(song.spotifyUrl, '_blank')}
                          className="h-8 w-8"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(song.id)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSong(song.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Date Added */}
                  <div className="text-xs text-muted-foreground">
                    Adicionada em {new Date(song.dateAdded).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSongs.length === 0 && !showAddForm && (
          <div className="text-center space-y-4 mt-20">
            <div className="text-6xl">🎵</div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {searchQuery ? 'Nenhuma música encontrada' : 'Nenhuma música ainda'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Tente buscar por outro termo' 
                  : 'Adicione músicas que fazem você lembrar dela'
                }
              </p>
            </div>
            {!searchQuery && (
              <Button onClick={() => setShowAddForm(true)} className="btn-romantic">
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Primeira Música
              </Button>
            )}
          </div>
        )}

        {/* Spotify Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-2xl text-center">
          <p className="text-xs text-muted-foreground">
            💡 Dica: Cole o link do Spotify para reprodução direta
          </p>
        </div>
      </div>
    </div>
  );
};