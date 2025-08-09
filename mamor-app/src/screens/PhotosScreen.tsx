import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NavigationProps } from "../types/navigation";

const { width } = Dimensions.get("window");

interface Photo {
  id: string;
  url: any;
  caption?: string;
  date: string;
  isDefault?: boolean;
  type: "image" | "video";
}

const STORAGE_KEY = "mamor_photos";

const DEFAULT_IMAGES = {
  1: { source: require("../image/1.jpeg"), type: "image" as const },
  2: { source: require("../image/2.jpeg"), type: "image" as const },
  3: { source: require("../image/4.jpeg"), type: "image" as const },
  4: { source: require("../image/5.jpeg"), type: "image" as const },
  5: { source: require("../image/7.jpeg"), type: "image" as const },
  6: { source: require("../image/8.jpeg"), type: "image" as const },
};

const INITIAL_PHOTOS: Photo[] = Object.entries(DEFAULT_IMAGES).map(
  ([key, { source, type }]) => ({
    id: `default_${key}`,
    url: source,
    caption: `Os dias mais felizes da minha vida`,
    date: "2024-01-01",
    isDefault: true,
    type: type,
  })
);

export default function PhotosScreen({ navigation }: NavigationProps) {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current && photos.length > 1) {
      const thumbnailWidth = 60 + 8;
      const scrollOffset =
        currentIndex * thumbnailWidth - width / 2 + thumbnailWidth / 2;
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollOffset),
        animated: true,
      });
    }
  }, [currentIndex]);

  const savePhotos = useCallback(async (photosToSave: Photo[]) => {
    try {
      const userPhotos = photosToSave.filter((photo) => !photo.isDefault);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userPhotos));
      console.log(
        "✅ Fotos do usuário salvas no AsyncStorage:",
        userPhotos.length
      );
    } catch (error) {
      console.error("❌ Erro ao salvar fotos:", error);
    }
  }, []);

  const loadPhotos = async () => {
    try {
      console.log("📱 Carregando fotos do AsyncStorage...");
      const savedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPhotos) {
        const parsedPhotos: Photo[] = JSON.parse(savedPhotos);
        console.log(`✅ ${parsedPhotos.length} fotos do usuário carregadas`);
        setPhotos([...INITIAL_PHOTOS, ...parsedPhotos]);
      } else {
        console.log(
          "📝 Nenhuma foto do usuário encontrada, usando apenas fotos padrão"
        );
        setPhotos(INITIAL_PHOTOS);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar fotos:", error);
      setPhotos(INITIAL_PHOTOS);
    }
  };

  const pickImage = async () => {
    try {
      console.log("📸 Iniciando seleção de imagem...");

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("🔐 Status da permissão:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para adicionar fotos."
        );
        return;
      }

      console.log("🖼️ Abrindo galeria...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        videoMaxDuration: 30,
      });

      console.log("📋 Resultado da seleção:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        console.log("✅ Mídia selecionada:", selectedUri);
        setSelectedImageUri(selectedUri);
        setShowAddModal(true);
      } else {
        console.log("❌ Seleção cancelada");
      }
    } catch (error) {
      console.error("❌ Erro ao selecionar mídia:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const addPhotoWithCaption = async () => {
    if (!selectedImageUri) {
      console.log("❌ Nenhuma mídia selecionada");
      return;
    }

    setIsLoading(true);

    try {
      console.log("💾 Copiando mídia para diretório local...");

      const isVideo =
        selectedImageUri.toLowerCase().includes(".mp4") ||
        selectedImageUri.toLowerCase().includes(".mov");

      const extension = isVideo ? "mp4" : "jpg";
      const fileName = `mamor_media_${Date.now()}.${extension}`;
      const newUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: selectedImageUri,
        to: newUri,
      });

      console.log("✅ Mídia copiada para:", newUri);

      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: newUri,
        caption: newPhotoCaption.trim() || "Momento especial",
        date: new Date().toISOString().split("T")[0],
        isDefault: false,
        type: isVideo ? "video" : "image",
      };

      console.log("📷 Nova mídia criada:", newPhoto);

      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos, newPhoto];
        console.log(`✅ Total de mídias após adição: ${updatedPhotos.length}`);
        savePhotos(updatedPhotos);
        return updatedPhotos;
      });

      setCurrentIndex(photos.length);
      setSelectedImageUri(null);
      setNewPhotoCaption("");
      setShowAddModal(false);

      Alert.alert(
        "Sucesso! 📸",
        `${isVideo ? "Vídeo" : "Foto"} adicionado com sucesso!`
      );
    } catch (error) {
      console.error("❌ Erro ao adicionar mídia:", error);
      Alert.alert("Erro", "Não foi possível adicionar a mídia: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const VideoComponent = ({
    source,
    style,
    onPress,
    showControls = false,
  }: {
    source: any;
    style: any;
    onPress?: () => void;
    showControls?: boolean;
  }) => {
    const player = useVideoPlayer(source, (player) => {
      player.loop = true;
      player.muted = true;
    });

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[style, { backgroundColor: "#000", borderRadius: 16 }]}>
          <VideoView
            style={style}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            showsTimecodes={showControls}
          />
          {!showControls && (
            <View style={styles.playIconContainer}>
              <Ionicons
                name="play-circle"
                size={48}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const MediaComponent = ({
    photo,
    style,
    onPress,
    resizeMode = "cover",
    showVideoControls = false,
  }: {
    photo: Photo;
    style: any;
    onPress?: () => void;
    resizeMode?: any;
    showVideoControls?: boolean;
  }) => {
    const [loading, setLoading] = useState(true);

    if (photo.type === "video") {
      return (
        <VideoComponent
          source={
            typeof photo.url === "string" ? { uri: photo.url } : photo.url
          }
          style={style}
          onPress={onPress}
          showControls={showVideoControls}
        />
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={!onPress}
      >
        <Image
          source={
            typeof photo.url === "string" ? { uri: photo.url } : photo.url
          }
          style={style}
          resizeMode={resizeMode}
          onLoad={() => setLoading(false)}
          onError={() => {
            console.error("❌ Erro ao carregar imagem:", photo.url);
            setLoading(false);
          }}
        />
        {loading && (
          <View style={[style, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#FF69B4" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const deletePhoto = (photoId: string) => {
    const photoToDelete = photos.find((p) => p.id === photoId);

    if (photoToDelete?.isDefault) {
      Alert.alert("Aviso", "Não é possível remover mídias padrão do app.");
      return;
    }

    Alert.alert("Remover Mídia", "Tem certeza que deseja remover esta mídia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("🗑️ Removendo mídia:", photoId);

            if (
              photoToDelete &&
              typeof photoToDelete.url === "string" &&
              photoToDelete.url.startsWith("file://")
            ) {
              await FileSystem.deleteAsync(photoToDelete.url, {
                idempotent: true,
              });
              console.log("✅ Arquivo deletado:", photoToDelete.url);
            }

            setPhotos((prevPhotos) => {
              const newList = prevPhotos.filter((p) => p.id !== photoId);
              console.log(`✅ ${newList.length} mídias restantes`);
              savePhotos(newList);
              return newList;
            });

            setCurrentIndex((prev) => {
              const newList = photos.filter((p) => p.id !== photoId);
              return prev >= newList.length ? newList.length - 1 : prev;
            });
          } catch (error) {
            console.error("❌ Erro ao deletar mídia:", error);
          }
        },
      },
    ]);
  };

  const downloadPhoto = async (photoUrl: any, photoCaption: string) => {
    try {
      console.log("💾 Iniciando download da mídia:", photoCaption);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para salvar mídias."
        );
        return;
      }

      if (typeof photoUrl !== "string") {
        Alert.alert("Aviso", "Mídias padrão não podem ser baixadas.");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(photoUrl);
      await MediaLibrary.createAlbumAsync("Mamor", asset, false);

      console.log("✅ Mídia salva na galeria");
      Alert.alert("Sucesso! 💾", `Mídia "${photoCaption}" salva na galeria!`);
    } catch (error) {
      console.error("❌ Erro ao salvar mídia:", error);
      Alert.alert("Erro", "Não foi possível salvar a mídia na galeria.");
    }
  };

  const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  if (photos.length === 0) {
    return (
      <LinearGradient
        colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Fotos & Vídeos</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.emptyState}>
            <Ionicons name="camera" size={80} color="#FFFFFFAA" />
            <Text style={styles.emptyTitle}>Nenhuma mídia ainda</Text>
            <Text style={styles.emptyText}>
              Adicione suas primeiras memórias especiais!
            </Text>
            <TouchableOpacity
              style={[
                styles.addFirstButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addFirstText}>
                {isLoading ? "Processando..." : "Adicionar Primeira Mídia"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentPhoto = photos[currentIndex];

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
          <Text style={styles.title}>Fotos & Vídeos</Text>
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.disabledButton]}
            onPress={pickImage}
            disabled={isLoading}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Photo Counter */}
        <Text style={styles.counter}>
          {currentIndex + 1} de {photos.length}
        </Text>

        {/* Main Media */}
        <View style={styles.photoCard}>
          <MediaComponent
            photo={currentPhoto}
            style={styles.mainImage}
            onPress={() => setShowFullscreen(true)}
          />
          {currentPhoto.caption && (
            <View style={styles.captionBox}>
              <Text style={styles.caption}>{currentPhoto.caption}</Text>
              {/* ✅ CORRIGIDO: Só mostra data se NÃO for foto padrão */}
              {!currentPhoto.isDefault && (
                <Text style={styles.date}>
                  {new Date(currentPhoto.date).toLocaleDateString("pt-BR")}
                </Text>
              )}
              {currentPhoto.isDefault && (
                <Text style={styles.defaultBadge}>
                  {currentPhoto.type === "video" ? "🎬" : "📷"} Mídia padrão
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.navButton} onPress={prevPhoto}>
              <Ionicons name="chevron-back" size={24} color="#FF69B4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={nextPhoto}>
              <Ionicons name="chevron-forward" size={24} color="#FF69B4" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              currentPhoto.isDefault && styles.disabledActionButton,
            ]}
            onPress={() => deletePhoto(currentPhoto.id)}
            disabled={currentPhoto.isDefault}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={currentPhoto.isDefault ? "#CCC" : "#F44336"}
            />
            <Text
              style={[
                styles.actionText,
                currentPhoto.isDefault && styles.disabledActionText,
              ]}
            >
              {currentPhoto.isDefault ? "Padrão" : "Remover"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              currentPhoto.isDefault && styles.disabledActionButton,
            ]}
            onPress={() =>
              downloadPhoto(currentPhoto.url, currentPhoto.caption || "Mídia")
            }
            disabled={currentPhoto.isDefault}
          >
            <Ionicons
              name="download-outline"
              size={20}
              color={currentPhoto.isDefault ? "#CCC" : "#4CAF50"}
            />
            <Text
              style={[
                styles.actionText,
                currentPhoto.isDefault && styles.disabledActionText,
              ]}
            >
              {currentPhoto.isDefault ? "Padrão" : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            style={styles.thumbsContainer}
            contentContainerStyle={styles.thumbsContent}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={68}
            snapToAlignment="start"
          >
            {photos.map((photo, idx) => (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.thumbWrapper,
                  idx === currentIndex && styles.thumbActive,
                  photo.isDefault && styles.thumbDefault,
                ]}
                onPress={() => setCurrentIndex(idx)}
              >
                <MediaComponent photo={photo} style={styles.thumbImage} />
                {photo.type === "video" && (
                  <View style={styles.thumbVideoIcon}>
                    <Ionicons name="play" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Add Photo Modal */}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Mídia</Text>

              {selectedImageUri && (
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.previewImage}
                />
              )}

              <TextInput
                style={styles.captionInput}
                value={newPhotoCaption}
                onChangeText={setNewPhotoCaption}
                placeholder="Adicione uma legenda especial..."
                placeholderTextColor="#999"
                multiline
                maxLength={100}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setSelectedImageUri(null);
                    setNewPhotoCaption("");
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelModalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmModalButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={addPhotoWithCaption}
                  disabled={isLoading}
                >
                  <Text style={styles.confirmModalButtonText}>
                    {isLoading ? "Adicionando..." : "Adicionar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Fullscreen Modal */}
        <Modal visible={showFullscreen} transparent animationType="fade">
          <View style={styles.fullscreenOverlay}>
            <MediaComponent
              photo={currentPhoto}
              style={styles.fullscreenImage}
              resizeMode="contain"
              showVideoControls={true}
            />
            <TouchableOpacity
              style={styles.closeFullscreen}
              onPress={() => setShowFullscreen(false)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { opacity: 0.5 },
  counter: {
    textAlign: "center",
    color: "#FF69B4",
    fontWeight: "600",
    backgroundColor: "rgba(255,105,180,0.2)",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  photoCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  mainImage: {
    width: "100%",
    height: width - 80,
    borderRadius: 16,
  },
  captionBox: {
    alignItems: "center",
    marginTop: 16,
  },
  caption: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  defaultBadge: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },

  // Estilos para vídeos
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  playIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbVideoIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 80,
    marginTop: -32,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledActionButton: {
    backgroundColor: "#F0F0F0",
    borderColor: "#DDD",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  disabledActionText: {
    color: "#CCC",
  },

  // Thumbnails
  thumbsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    maxHeight: 80,
  },
  thumbsContent: {
    paddingHorizontal: 10,
    gap: 8,
  },
  thumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  thumbActive: {
    borderColor: "#FF69B4",
    transform: [{ scale: 1.1 }],
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  thumbDefault: {
    opacity: 0.8,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
  },
  emptyText: {
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 8,
  },
  addFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF69B4",
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFirstText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeFullscreen: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 24,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelModalButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmModalButton: {
    backgroundColor: "#FF69B4",
  },
  confirmModalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
