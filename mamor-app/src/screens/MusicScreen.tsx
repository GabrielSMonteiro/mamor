import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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

export default function MusicScreen({ navigation }: any) {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Perfect",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
      reason: "Nossa música do primeiro encontro",
      dateAdded: "2024-01-01",
    },
    {
      id: "2",
      title: "All of Me",
      artist: "John Legend",
      album: "Love in the Future",
      cover: "https://via.placeholder.com/150x150/9F7AEA/FFFFFF?text=♪",
      spotifyUrl: "https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a",
      reason: "Me lembra do seu sorriso",
      dateAdded: "2024-01-15",
    },
    {
      id: "3",
      title: "Thinking Out Loud",
      artist: "Ed Sheeran",
      album: "x (Multiply)",
      cover: "https://via.placeholder.com/150x150/4299E1/FFFFFF?text=♪",
      spotifyUrl: "https://open.spotify.com/track/lp7lVi5SHSkTp4ep34s3y2",
      reason: "Para quando dançamos juntos",
      dateAdded: "2024-02-01",
    },
  ]);

  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    reason: "",
    spotifyUrl: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handlePlayPause = (songId: string, spotifyUrl: string) => {
    if (currentPlaying === songId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(songId);

      // Tentar abrir no Spotify
      if (spotifyUrl && spotifyUrl !== "#") {
        Linking.canOpenURL(spotifyUrl)
          .then((supported) => {
            if (supported) {
              Linking.openURL(spotifyUrl);
            } else {
              Alert.alert("Erro", "Não foi possível abrir o Spotify");
            }
          })
          .catch(() => {
            Alert.alert("Erro", "Erro ao tentar abrir a música");
          });
      }
    }
  };

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.reason) {
      const song: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
        album: newSong.album,
        cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
        spotifyUrl: newSong.spotifyUrl || "#",
        reason: newSong.reason,
        dateAdded: new Date().toISOString().split("T")[0],
      };

      setSongs([...songs, song]);
      setNewSong({
        title: "",
        artist: "",
        album: "",
        reason: "",
        spotifyUrl: "",
      });
      setShowAddModal(false);

      Alert.alert(
        "Sucesso! 🎵",
        "Música adicionada à sua playlist do coração!"
      );
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos o título, artista e o motivo especial"
      );
    }
  };

  const handleEditSong = () => {
    if (
      editingSong &&
      editingSong.title &&
      editingSong.artist &&
      editingSong.reason
    ) {
      setSongs(
        songs.map((song) => (song.id === editingSong.id ? editingSong : song))
      );
      setShowEditModal(false);
      setEditingSong(null);

      Alert.alert("Sucesso! 🎵", "Música editada com sucesso!");
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos o título, artista e o motivo especial"
      );
    }
  };

  const handleDeleteSong = (songId: string, songTitle: string) => {
    Alert.alert(
      "Remover Música",
      `Tem certeza que deseja remover "${songTitle}" da sua playlist?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => setSongs(songs.filter((song) => song.id !== songId)),
        },
      ]
    );
  };

  const openEditModal = (song: Song) => {
    setEditingSong({ ...song });
    setShowEditModal(true);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSong = (song: Song) => (
    <View key={song.id} style={styles.songCard}>
      <View style={styles.songContent}>
        {/* Album Cover */}
        <View style={styles.albumCover}>
          <Image
            source={{ uri: song.cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <View style={styles.songDetails}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {song.artist}
            </Text>
            {song.album && (
              <Text style={styles.songAlbum} numberOfLines={1}>
                {song.album}
              </Text>
            )}
          </View>

          {/* Reason */}
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonText} numberOfLines={2}>
              "{song.reason}"
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.playControls}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  currentPlaying === song.id && styles.playingButton,
                ]}
                onPress={() => handlePlayPause(song.id, song.spotifyUrl)}
              >
                <Ionicons
                  name={currentPlaying === song.id ? "pause" : "play"}
                  size={16}
                  color={currentPlaying === song.id ? "#FFFFFF" : "#FF69B4"}
                />
              </TouchableOpacity>

              {song.spotifyUrl && song.spotifyUrl !== "#" && (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => Linking.openURL(song.spotifyUrl)}
                >
                  <Ionicons name="logo-spotify" size={16} color="#1DB954" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.actionControls}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(song)}
              >
                <Ionicons name="create-outline" size={14} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteSong(song.id, song.title)}
              >
                <Ionicons name="trash-outline" size={14} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Added */}
          <Text style={styles.dateAdded}>
            Adicionada em {new Date(song.dateAdded).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Música</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Músicas que me fazem lembrar de você 🎵
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar músicas..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{songs.length}</Text>
          <Text style={styles.statsText}>
            {songs.length === 1 ? "música especial" : "músicas especiais"}
          </Text>
        </View>

        {/* Songs List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredSongs.map(renderSong)}

          {/* Empty State */}
          {filteredSongs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎵</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery
                  ? "Nenhuma música encontrada"
                  : "Nenhuma música ainda"}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Tente buscar por outro termo"
                  : "Adicione músicas que fazem você lembrar dela"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>
                    Adicionar Primeira Música
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Spotify Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              💡 Dica: Cole o link do Spotify para reprodução direta
            </Text>
          </View>
        </ScrollView>

        {/* Add Song Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Nova Música</Text>

              <ScrollView style={styles.modalForm}>
                <TextInput
                  style={styles.modalInput}
                  value={newSong.title}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, title: text })
                  }
                  placeholder="Nome da música *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.artist}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, artist: text })
                  }
                  placeholder="Artista *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.album}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, album: text })
                  }
                  placeholder="Álbum (opcional)"
                />
                <TextInput
                  style={[styles.modalInput, styles.reasonInput]}
                  value={newSong.reason}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, reason: text })
                  }
                  placeholder="Por que essa música me lembra de você? *"
                  multiline
                  maxLength={150}
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.spotifyUrl}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, spotifyUrl: text })
                  }
                  placeholder="Link do Spotify (opcional)"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewSong({
                      title: "",
                      artist: "",
                      album: "",
                      reason: "",
                      spotifyUrl: "",
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton]}
                  onPress={handleAddSong}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Song Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Música</Text>

              <ScrollView style={styles.modalForm}>
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.title || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, title: text } : null
                    )
                  }
                  placeholder="Nome da música *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.artist || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, artist: text } : null
                    )
                  }
                  placeholder="Artista *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.album || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, album: text } : null
                    )
                  }
                  placeholder="Álbum (opcional)"
                />
                <TextInput
                  style={[styles.modalInput, styles.reasonInput]}
                  value={editingSong?.reason || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, reason: text } : null
                    )
                  }
                  placeholder="Por que essa música me lembra de você? *"
                  multiline
                  maxLength={150}
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.spotifyUrl || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, spotifyUrl: text } : null
                    )
                  }
                  placeholder="Link do Spotify (opcional)"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingSong(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton]}
                  onPress={handleEditSong}
                >
                  <Text style={styles.addButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  songContent: {
    padding: 16,
  },
  albumCover: {
    alignSelf: "center",
    marginBottom: 12,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  songInfo: {
    flex: 1,
  },
  songDetails: {
    marginBottom: 12,
    alignItems: "center",
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  reasonContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  playControls: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  playingButton: {
    backgroundColor: "#FF69B4",
    borderColor: "#FF69B4",
  },
  actionControls: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  dateAdded: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF69B4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalForm: {
    padding: 20,
    maxHeight: 400,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  reasonInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  addModalButton: {
    backgroundColor: "#FF69B4",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
