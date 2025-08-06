import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NavigationProps } from '../types/navigation';

const { width } = Dimensions.get('window');

interface Photo {
  id: string;
  url: string;
  caption?: string;
  date: string;
}

const STORAGE_KEY = 'mamor_photos';

export default function PhotosScreen({ navigation }: NavigationProps) {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://via.placeholder.com/600x600/FF69B4/FFFFFF?text=💕',
      caption: 'Nosso primeiro encontro',
      date: '2024-01-01',
    },
    {
      id: '2',
      url: 'https://via.placeholder.com/600x600/9F7AEA/FFFFFF?text=💖',
      caption: 'Jantar romântico',
      date: '2024-01-15',
    },
    {
      id: '3',
      url: 'https://via.placeholder.com/600x600/4299E1/FFFFFF?text=💘',
      caption: 'Passeio no parque',
      date: '2024-02-01',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar fotos do AsyncStorage ao inicializar
  useEffect(() => {
    loadPhotos();
  }, []);

  // CORRIGIDO: Função separada para salvar fotos para evitar loops infinitos
  const savePhotos = useCallback(async (photosToSave: Photo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photosToSave));
      console.log('✅ Fotos salvas no AsyncStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar fotos:', error);
    }
  }, []);

  const loadPhotos = async () => {
    try {
      console.log('📱 Carregando fotos do AsyncStorage...');
      const savedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos);
        console.log(`✅ ${parsedPhotos.length} fotos carregadas`);
        setPhotos(parsedPhotos);
      } else {
        console.log('📝 Nenhuma foto salva encontrada, usando fotos padrão');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar fotos:', error);
    }
  };

const pickImage = async () => {
  try {
    console.log('📸 Iniciando seleção de imagem...');
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('🔐 Status da permissão:', status);
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar fotos.');
      return;
    }

    console.log('🖼️ Abrindo galeria...');
    // ✅ CORRIGIDO: Nova sintaxe do expo-image-picker v15+
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ❌ Era: ImagePicker.MediaTypeOptions.Images
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('📋 Resultado da seleção:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      console.log('✅ Imagem selecionada:', selectedUri);
      setSelectedImageUri(selectedUri);
      setShowAddModal(true);
    } else {
      console.log('❌ Seleção de imagem cancelada');
    }
  } catch (error) {
    console.error('❌ Erro ao selecionar imagem:', error);
    Alert.alert('Erro', 'Não foi possível abrir a galeria.');
  }
};

  const addPhotoWithCaption = async () => {
    if (!selectedImageUri) {
      console.log('❌ Nenhuma imagem selecionada');
      return;
    }

    setIsLoading(true);

    try {
      console.log('💾 Copiando imagem para diretório local...');
      
      // Copiar a imagem para o diretório do app para persistência
      const fileName = `mamor_photo_${Date.now()}.jpg`;
      const newUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: selectedImageUri,
        to: newUri,
      });

      console.log('✅ Imagem copiada para:', newUri);

      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: newUri,
        caption: newPhotoCaption.trim() || 'Momento especial',
        date: new Date().toISOString().split('T')[0],
      };
      
      console.log('📷 Nova foto criada:', newPhoto);
      
      // CORRIGIDO: Usar função de callback para atualizar o estado
      setPhotos(prevPhotos => {
        const updatedPhotos = [...prevPhotos, newPhoto];
        console.log(`✅ Total de fotos após adição: ${updatedPhotos.length}`);
        
        // Salvar imediatamente
        savePhotos(updatedPhotos);
        
        return updatedPhotos;
      });
      
      // CORRIGIDO: Usar callback para pegar o valor correto
      setCurrentIndex(prevPhotos => photos.length);
      
      // Reset
      setSelectedImageUri(null);
      setNewPhotoCaption('');
      setShowAddModal(false);
      
      Alert.alert('Sucesso! 📸', 'Foto adicionada com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao adicionar foto:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a foto: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePhoto = (photoId: string) => {
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Removendo foto:', photoId);
              
              // Encontrar a foto
              const photoToDelete = photos.find(p => p.id === photoId);
              if (photoToDelete && photoToDelete.url.startsWith('file://')) {
                // Deletar arquivo se for local
                await FileSystem.deleteAsync(photoToDelete.url, { idempotent: true });
                console.log('✅ Arquivo deletado:', photoToDelete.url);
              }
              
              setPhotos(prevPhotos => {
                const newList = prevPhotos.filter(p => p.id !== photoId);
                console.log(`✅ ${newList.length} fotos restantes`);
                
                // Salvar imediatamente
                savePhotos(newList);
                
                return newList;
              });
              
              setCurrentIndex(prev => {
                const newList = photos.filter(p => p.id !== photoId);
                return prev >= newList.length ? newList.length - 1 : prev;
              });
            } catch (error) {
              console.error('❌ Erro ao deletar foto:', error);
            }
          },
        },
      ]
    );
  };

  const downloadPhoto = async (photoUrl: string, photoCaption: string) => {
    try {
      console.log('💾 Iniciando download da foto:', photoCaption);
      
      // Pedir permissão para salvar na galeria
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para salvar fotos.');
        return;
      }

      let localUri = photoUrl;

      // Se for uma URL externa, baixar primeiro
      if (photoUrl.startsWith('http')) {
        console.log('🌐 Baixando imagem externa...');
        const fileName = `temp_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        
        const downloadResult = await FileSystem.downloadAsync(photoUrl, fileUri);
        localUri = downloadResult.uri;
      }

      // Salvar na galeria
      const asset = await MediaLibrary.createAssetAsync(localUri);
      await MediaLibrary.createAlbumAsync('Mamor', asset, false);
      
      console.log('✅ Foto salva na galeria');
      Alert.alert('Sucesso! 💾', `Foto "${photoCaption}" salva na galeria!`);
    } catch (error) {
      console.error('❌ Erro ao salvar foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto na galeria.');
    }
  };

  const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  /* ---------- ESTADO VAZIO ---------- */
  if (photos.length === 0) {
    return (
      <LinearGradient colors={['#FFE4E1', '#FFB6C1', '#FF69B4']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Fotos</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.emptyState}>
            <Ionicons name="camera" size={80} color="#FFFFFFAA" />
            <Text style={styles.emptyTitle}>Nenhuma foto ainda</Text>
            <Text style={styles.emptyText}>Adicione suas primeiras memórias especiais!</Text>
            <TouchableOpacity 
              style={[styles.addFirstButton, isLoading && styles.disabledButton]} 
              onPress={pickImage}
              disabled={isLoading}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addFirstText}>
                {isLoading ? 'Processando...' : 'Adicionar Primeira Foto'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  /* ---------- TELA PRINCIPAL ---------- */
  const currentPhoto = photos[currentIndex];

  return (
    <LinearGradient colors={['#FFE4E1', '#FFB6C1', '#FF69B4']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Fotos</Text>
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

        {/* Main Photo */}
        <View style={styles.photoCard}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setShowFullscreen(true)}>
            <Image source={{ uri: currentPhoto.url }} style={styles.mainImage} />
          </TouchableOpacity>
          {currentPhoto.caption && (
            <View style={styles.captionBox}>
              <Text style={styles.caption}>{currentPhoto.caption}</Text>
              <Text style={styles.date}>{new Date(currentPhoto.date).toLocaleDateString('pt-BR')}</Text>
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
            style={styles.actionButton} 
            onPress={() => deletePhoto(currentPhoto.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
            <Text style={styles.actionText}>Remover</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => downloadPhoto(currentPhoto.url, currentPhoto.caption || 'Foto')}
          >
            <Ionicons name="download-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <ScrollView 
            horizontal 
            style={styles.thumbsContainer}
            contentContainerStyle={styles.thumbsContent}
            showsHorizontalScrollIndicator={false}
          >
            {photos.map((photo, idx) => (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.thumbWrapper,
                  idx === currentIndex && styles.thumbActive,
                ]}
                onPress={() => setCurrentIndex(idx)}
              >
                <Image source={{ uri: photo.url }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Add Photo Modal */}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Foto</Text>
              
              {selectedImageUri && (
                <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
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
                    setNewPhotoCaption('');
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelModalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.confirmModalButton,
                    isLoading && styles.disabledButton
                  ]}
                  onPress={addPhotoWithCaption}
                  disabled={isLoading}
                >
                  <Text style={styles.confirmModalButtonText}>
                    {isLoading ? 'Adicionando...' : 'Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Fullscreen Modal */}
        <Modal visible={showFullscreen} transparent animationType="fade">
          <View style={styles.fullscreenOverlay}>
            <Image source={{ uri: currentPhoto.url }} style={styles.fullscreenImage} />
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
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 3,
  },
  addButton: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  counter: {
    textAlign: 'center', 
    color: '#FF69B4', 
    fontWeight: '600',
    backgroundColor: 'rgba(255,105,180,0.2)', 
    alignSelf: 'center',
    paddingHorizontal: 16, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginBottom: 16,
  },
  photoCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 24,
    marginHorizontal: 20, 
    padding: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 4,
  },
  mainImage: { 
    width: '100%', 
    height: width - 80, 
    borderRadius: 16 
  },
  captionBox: { 
    alignItems: 'center', 
    marginTop: 16 
  },
  caption: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    textAlign: 'center' 
  },
  date: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 4 
  },
  navButtons: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginHorizontal: 80, 
    marginTop: -32,
  },
  navButton: {
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    elevation: 3,
  },
  actions: {
    flexDirection: 'row', 
    gap: 12, 
    marginHorizontal: 20, 
    marginTop: 24,
  },
  actionButton: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F5F5F5', 
    paddingVertical: 12, 
    borderRadius: 12,
    borderWidth: 1, 
    borderColor: '#E0E0E0',
  },
  actionText: { 
    marginLeft: 8, 
    fontSize: 14, 
    color: '#666', 
    fontWeight: '500' 
  },
  thumbsContainer: { 
    marginHorizontal: 20, 
    marginTop: 20, 
    maxHeight: 80,
  },
  thumbsContent: {
    paddingHorizontal: 0, 
    gap: 8,
  },
  thumbWrapper: {
    width: 60, 
    height: 60, 
    borderRadius: 12,
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: 'transparent',
  },
  thumbActive: { 
    borderColor: '#FF69B4', 
    transform: [{ scale: 1.05 }] 
  },
  thumbImage: { 
    width: '100%', 
    height: '100%' 
  },
  emptyState: { 
    alignItems: 'center', 
    marginTop: 40, 
    paddingHorizontal: 20 
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginTop: 16 
  },
  emptyText: { 
    color: '#FFFFFF', 
    opacity: 0.9, 
    textAlign: 'center', 
    marginTop: 8 
  },
  addFirstButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FF69B4',
    marginTop: 24, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 24,
  },
  addFirstText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    marginLeft: 8 
  },
  fullscreenOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  fullscreenImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain' 
  },
  closeFullscreen: {
    position: 'absolute', 
    top: 40, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8, 
    borderRadius: 24,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    width: '100%', 
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 16,
  },
  previewImage: {
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 16, 
    backgroundColor: '#F5F5F5',
  },
  captionInput: {
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 12,
    fontSize: 16, 
    marginBottom: 20, 
    minHeight: 60, 
    textAlignVertical: 'top',
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12 
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  cancelModalButton: { 
    backgroundColor: '#E0E0E0' 
  },
  cancelModalButtonText: { 
    color: '#666', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  confirmModalButton: { 
    backgroundColor: '#FF69B4' 
  },
  confirmModalButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
