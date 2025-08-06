import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationProps } from '../types/navigation';

interface BucketItem {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string;
  photoUrl?: string;
}

const STORAGE_KEY = 'mamor_bucket_list';

export default function BucketListScreen({ navigation }: NavigationProps) {
  const [items, setItems] = useState<BucketItem[]>([
    {
      id: "1",
      text: "Jantar no restaurante mais romântico de Brasília",
      completed: false,
    },
    {
      id: "2",
      text: "Assistir o pôr do sol no Pontão do Lago Sul",
      completed: false,
    },
    {
      id: "3",
      text: "Fazer um piquenique no Parque da Cidade",
      completed: false,
    },
    {
      id: "4",
      text: "Visitar todos os pontos turísticos de Brasília juntos",
      completed: false,
    },
    {
      id: "5",
      text: "Fazer uma viagem de fim de semana para Pirenópolis",
      completed: false,
    },
  ]);

  const [newItemText, setNewItemText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ NOVOS ESTADOS para modal de foto
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoActions, setPhotoActions] = useState<string | null>(null);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  // Carregar dados ao inicializar
  useEffect(() => {
    loadBucketList();
  }, []);

  const saveBucketList = useCallback(async (itemsToSave: BucketItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
      console.log('✅ Bucket list salva no AsyncStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar bucket list:', error);
    }
  }, []);

  const loadBucketList = async () => {
    try {
      console.log('📱 Carregando bucket list do AsyncStorage...');
      const savedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        console.log(`✅ ${parsedItems.length} itens carregados`);
        setItems(parsedItems);
      } else {
        console.log('📝 Nenhum item salvo encontrado, usando itens padrão');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar bucket list:', error);
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: BucketItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      };
      
      setItems(prevItems => {
        const updatedItems = [...prevItems, newItem];
        saveBucketList(updatedItems);
        return updatedItems;
      });
      
      setNewItemText("");
      setShowAddModal(false);
      Alert.alert('Sucesso! ✨', 'Nova ideia adicionada à lista!');
    }
  };

  const handleToggleComplete = (itemId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          const isCompleting = !item.completed;
          if (isCompleting) {
            Alert.alert(
              "Parabéns! 🎉",
              "Vocês completaram mais um item! Que tal adicionar uma foto como recordação?",
              [
                { text: "Depois", style: "cancel" },
                {
                  text: "Adicionar Foto",
                  onPress: () => handleAddPhoto(itemId),
                },
              ]
            );
          }
          return {
            ...item,
            completed: isCompleting,
            completedDate: isCompleting
              ? new Date().toISOString().split("T")[0]
              : undefined,
          };
        }
        return item;
      });
      
      saveBucketList(updatedItems);
      return updatedItems;
    });
  };

  const handleAddPhoto = async (itemId: string) => {
    try {
      console.log('📸 Iniciando seleção de foto para bucket list...');
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('🔐 Status da permissão:', status);

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à galeria para adicionar fotos."
        );
        return;
      }

      setIsLoading(true);
      console.log('🖼️ Abrindo galeria...');
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('📋 Resultado da seleção:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        console.log('✅ Imagem selecionada:', selectedUri);

        // Copiar imagem para diretório permanente
        const fileName = `bucket_photo_${Date.now()}.jpg`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: selectedUri,
          to: newUri,
        });

        console.log('✅ Imagem copiada para:', newUri);

        setItems(prevItems => {
          const updatedItems = prevItems.map((item) =>
            item.id === itemId
              ? { ...item, photoUrl: newUri }
              : item
          );
          saveBucketList(updatedItems);
          return updatedItems;
        });

        Alert.alert('Sucesso! 📸', 'Foto adicionada como comprovação!');
      } else {
        console.log('❌ Seleção de imagem cancelada');
      }
    } catch (error) {
      console.error('❌ Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a foto.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NOVA FUNÇÃO: Remover apenas a foto
  const handleRemovePhoto = (itemId: string) => {
    Alert.alert(
      "Remover Foto",
      "Tem certeza que deseja remover a foto de comprovação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              // Encontrar o item e deletar foto
              const item = items.find(item => item.id === itemId);
              if (item?.photoUrl && item.photoUrl.startsWith('file://')) {
                await FileSystem.deleteAsync(item.photoUrl, { idempotent: true });
                console.log('✅ Foto deletada:', item.photoUrl);
              }
              
              setItems(prevItems => {
                const updatedItems = prevItems.map((item) =>
                  item.id === itemId
                    ? { ...item, photoUrl: undefined }
                    : item
                );
                saveBucketList(updatedItems);
                return updatedItems;
              });

              setShowPhotoModal(false);
              setPhotoActions(null);
              Alert.alert('Sucesso! 🗑️', 'Foto removida com sucesso!');
            } catch (error) {
              console.error('❌ Erro ao remover foto:', error);
              Alert.alert('Erro', 'Não foi possível remover a foto.');
            }
          },
        },
      ]
    );
  };

  // ✅ NOVA FUNÇÃO: Trocar foto
  const handleChangePhoto = async (itemId: string) => {
    Alert.alert(
      "Trocar Foto",
      "Deseja selecionar uma nova foto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Trocar",
          onPress: () => {
            setShowPhotoModal(false);
            setPhotoActions(null);
            handleAddPhoto(itemId);
          },
        },
      ]
    );
  };

  // ✅ NOVA FUNÇÃO: Abrir modal de foto
  const openPhotoModal = (photoUrl: string, itemId: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoActions(itemId);
    setShowPhotoModal(true);
  };

  const handleEditItem = () => {
    if (editText.trim() && editingId) {
      setItems(prevItems => {
        const updatedItems = prevItems.map((item) =>
          item.id === editingId ? { ...item, text: editText.trim() } : item
        );
        saveBucketList(updatedItems);
        return updatedItems;
      });
      
      setEditingId(null);
      setEditText("");
      setShowEditModal(false);
      Alert.alert('Sucesso! ✏️', 'Item editado com sucesso!');
    }
  };

  const handleDeleteItem = (itemId: string, itemText: string) => {
    Alert.alert(
      "Remover Item",
      `Tem certeza que deseja remover "${itemText}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              // Encontrar o item e deletar foto se existir
              const itemToDelete = items.find(item => item.id === itemId);
              if (itemToDelete?.photoUrl && itemToDelete.photoUrl.startsWith('file://')) {
                await FileSystem.deleteAsync(itemToDelete.photoUrl, { idempotent: true });
                console.log('✅ Foto deletada:', itemToDelete.photoUrl);
              }
              
              setItems(prevItems => {
                const updatedItems = prevItems.filter((item) => item.id !== itemId);
                saveBucketList(updatedItems);
                return updatedItems;
              });

              Alert.alert('Removido! 🗑️', 'Item removido da lista!');
            } catch (error) {
              console.error('❌ Erro ao deletar item:', error);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (item: BucketItem) => {
    setEditingId(item.id);
    setEditText(item.text);
    setShowEditModal(true);
  };

  const renderItem = (item: BucketItem, index: number) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleToggleComplete(item.id)}
          disabled={isLoading}
        >
          <Ionicons
            name={item.completed ? "checkbox" : "square-outline"}
            size={24}
            color={item.completed ? "#4CAF50" : "#666"}
          />
        </TouchableOpacity>

        <View style={styles.itemContent}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemNumber}>#{index + 1}</Text>
            <Text
              style={[styles.itemText, item.completed && styles.completedText]}
            >
              {item.text}
            </Text>
          </View>

          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEditModal(item)}
              disabled={isLoading}
            >
              <Ionicons name="create-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteItem(item.id, item.text)}
              disabled={isLoading}
            >
              <Ionicons name="trash-outline" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Completed Section */}
      {item.completed && (
        <View style={styles.completedSection}>
          <View style={styles.completedInfo}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.completedDate}>
              Concluído em{" "}
              {item.completedDate &&
                new Date(item.completedDate).toLocaleDateString("pt-BR")}
            </Text>
          </View>

          {item.photoUrl ? (
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={() => openPhotoModal(item.photoUrl!, item.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.photoUrl }}
                style={styles.photo}
                resizeMode="cover"
              />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoOverlayText}>Toque para ver</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.addPhotoButton, isLoading && styles.disabledButton]}
              onPress={() => handleAddPhoto(item.id)}
              disabled={isLoading}
            >
              <Ionicons name="camera-outline" size={20} color="#FF69B4" />
              <Text style={styles.addPhotoText}>
                {isLoading ? 'Processando...' : 'Adicionar Foto de Comprovação'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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

          <Text style={styles.title}>50 Coisas</Text>

          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.disabledButton]}
            onPress={() => setShowAddModal(true)}
            disabled={isLoading}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressNumbers}>
            {completedCount}/{totalCount}
          </Text>
          <Text style={styles.progressText}>
            {completedCount === 0
              ? "Vamos começar nossa jornada!"
              : completedCount === totalCount
              ? "Parabéns! Vocês completaram tudo!"
              : `${Math.round((completedCount / totalCount) * 100)}% concluído`}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Items List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => renderItem(item, index))}

          {/* Empty State */}
          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>Lista Vazia</Text>
              <Text style={styles.emptyText}>
                Adicionem suas primeiras ideias de coisas para fazer juntos!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ✅ NOVO: Modal de Visualização de Foto */}
        <Modal visible={showPhotoModal} transparent animationType="fade">
          <View style={styles.photoModalOverlay}>
            {selectedPhoto && (
              <Image 
                source={{ uri: selectedPhoto }} 
                style={styles.fullscreenPhoto} 
                resizeMode="contain"
              />
            )}
            
            {/* Botões de ação da foto */}
            <View style={styles.photoModalActions}>
              <TouchableOpacity
                style={styles.photoActionButton}
                onPress={() => photoActions && handleChangePhoto(photoActions)}
              >
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                <Text style={styles.photoActionText}>Trocar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.photoActionButton, styles.deletePhotoButton]}
                onPress={() => photoActions && handleRemovePhoto(photoActions)}
              >
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                <Text style={styles.photoActionText}>Remover</Text>
              </TouchableOpacity>
            </View>

            {/* Botão fechar */}
            <TouchableOpacity
              style={styles.closePhotoModal}
              onPress={() => {
                setShowPhotoModal(false);
                setSelectedPhoto(null);
                setPhotoActions(null);
              }}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Add Item Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Nova Ideia</Text>
              <TextInput
                style={styles.modalInput}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="O que vocês querem fazer juntos?"
                multiline
                maxLength={200}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewItemText("");
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton, isLoading && styles.disabledButton]}
                  onPress={handleAddItem}
                  disabled={isLoading}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Item Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Item</Text>
              <TextInput
                style={styles.modalInput}
                value={editText}
                onChangeText={setEditText}
                placeholder="Edite o texto..."
                multiline
                maxLength={200}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingId(null);
                    setEditText("");
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton, isLoading && styles.disabledButton]}
                  onPress={handleEditItem}
                  disabled={isLoading}
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
  disabledButton: {
    opacity: 0.5,
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
  progressCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressNumbers: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF69B4",
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginBottom: 8,
  },
  itemNumber: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  completedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  completedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  completedDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 150,
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  photoOverlayText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 105, 180, 0.1)",
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#FF69B4",
    borderStyle: "dashed",
  },
  addPhotoText: {
    fontSize: 14,
    color: "#FF69B4",
    marginLeft: 8,
    fontWeight: "500",
  },
  
  // ✅ NOVOS ESTILOS: Modal de foto
  photoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenPhoto: {
    width: "100%",
    height: "100%",
  },
  photoModalActions: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  photoActionButton: {
    backgroundColor: "rgba(255, 105, 180, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  deletePhotoButton: {
    backgroundColor: "rgba(244, 67, 54, 0.9)",
  },
  photoActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  closePhotoModal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
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
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
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
