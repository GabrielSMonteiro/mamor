import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Category {
  id: string;
  name: string;
  icon: string;
  suggestions: string[];
}

export default function RandomScreen({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "food",
      name: "Comida",
      icon: "🍽️",
      suggestions: [
        "Comida Árabe no Habibi",
        "Hamburgueria Gourmet no Madero",
        "Pizza na Bráz Pizzaria",
        "Sushi no Temakeria",
        "Churrascaria Fogo de Chão",
        "Tapioca na feira da Torre",
        "Açaí no Brasília Shopping",
        "Sorvete na Häagen-Dazs",
        "Pastel no Mercado Central",
        "Brigaderia no Brigadeiro",
      ],
    },
    {
      id: "place",
      name: "Lugar",
      icon: "📍",
      suggestions: [
        "Pontão do Lago Sul",
        "Parque Olhos D'Água",
        "Torre de TV",
        "Memorial JK",
        "Jardim Botânico",
        "Parque da Cidade",
        "Lago Paranoá",
        "Catedral de Brasília",
        "Congresso Nacional",
        "Palácio da Alvorada",
        "Shopping Iguatemi",
        "Feira da Torre",
        "Setor de Diversões Sul",
      ],
    },
    {
      id: "drink",
      name: "Bebida",
      icon: "🥤",
      suggestions: [
        "Chopp gelado",
        "Caipirinha de limão",
        "Drink tropical",
        "Vinho tinto",
        "Mojito refrescante",
        "Café especial",
        "Smoothie de frutas",
        "Refrigerante artesanal",
        "Água de coco",
        "Suco natural",
      ],
    },
    {
      id: "activity",
      name: "Atividade",
      icon: "🎯",
      suggestions: [
        "Cinema no shopping",
        "Caminhada no parque",
        "Karaokê",
        "Boliche",
        "Museu Nacional",
        "Teatro Nacional",
        "Feira de artesanato",
        "Exposição de arte",
        "Show de música",
        "Passeio de bicicleta",
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomResult, setRandomResult] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [editingItem, setEditingItem] = useState<{
    categoryId: string;
    index: number;
    text: string;
  } | null>(null);
  const [resultAnimation] = useState(new Animated.Value(0));

  const handleRandomize = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category && category.suggestions.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * category.suggestions.length
      );
      const result = category.suggestions[randomIndex];

      setRandomResult(result);
      setSelectedCategory(categoryId);

      // Animação do resultado
      Animated.sequence([
        Animated.timing(resultAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Alert.alert(
        "Ops!",
        "Adicione algumas sugestões primeiro para poder sortear!"
      );
    }
  };

  const handleAddSuggestion = (categoryId: string) => {
    if (newSuggestion.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                suggestions: [...cat.suggestions, newSuggestion.trim()],
              }
            : cat
        )
      );
      setNewSuggestion("");
      setShowAddForm(null);

      Alert.alert("Sucesso! ✨", "Nova sugestão adicionada!");
    } else {
      Alert.alert("Campo vazio", "Digite uma sugestão válida");
    }
  };

  const handleEditSuggestion = (
    categoryId: string,
    index: number,
    newText: string
  ) => {
    if (newText.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                suggestions: cat.suggestions.map((suggestion, i) =>
                  i === index ? newText.trim() : suggestion
                ),
              }
            : cat
        )
      );
      setEditingItem(null);
      Alert.alert("Editado! ✏️", "Sugestão atualizada com sucesso!");
    }
  };

  const handleDeleteSuggestion = (
    categoryId: string,
    index: number,
    suggestionText: string
  ) => {
    Alert.alert(
      "Remover Sugestão",
      `Tem certeza que deseja remover "${suggestionText}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setCategories(
              categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      suggestions: cat.suggestions.filter(
                        (_, i) => i !== index
                      ),
                    }
                  : cat
              )
            );
          },
        },
      ]
    );
  };

  const renderCategory = (category: Category) => (
    <View key={category.id} style={styles.categoryCard}>
      {/* Category Header */}
      <View style={styles.categoryHeader}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{category.suggestions.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowAddForm(category.id)}
        >
          <Ionicons name="add" size={20} color="#FF69B4" />
        </TouchableOpacity>
      </View>

      {/* Randomize Button */}
      <TouchableOpacity
        style={[
          styles.randomizeButton,
          category.suggestions.length === 0 && styles.disabledButton,
        ]}
        onPress={() => handleRandomize(category.id)}
        disabled={category.suggestions.length === 0}
      >
        <Ionicons name="shuffle" size={20} color="#FFFFFF" />
        <Text style={styles.randomizeText}>Sortear {category.name}</Text>
      </TouchableOpacity>

      {/* Add Form */}
      {showAddForm === category.id && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.addInput}
            value={newSuggestion}
            onChangeText={setNewSuggestion}
            placeholder={`Nova sugestão de ${category.name.toLowerCase()}`}
            placeholderTextColor="#999"
            onSubmitEditing={() => handleAddSuggestion(category.id)}
          />
          <View style={styles.addFormButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.confirmButton]}
              onPress={() => handleAddSuggestion(category.id)}
            >
              <Text style={styles.confirmButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowAddForm(null)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Suggestions List */}
      <ScrollView style={styles.suggestionsList} nestedScrollEnabled>
        {category.suggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionItem}>
            {editingItem?.categoryId === category.id &&
            editingItem?.index === index ? (
              <View style={styles.editForm}>
                <TextInput
                  style={styles.editInput}
                  value={editingItem.text}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, text })
                  }
                  onSubmitEditing={() =>
                    handleEditSuggestion(category.id, index, editingItem.text)
                  }
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.editConfirmButton}
                    onPress={() =>
                      handleEditSuggestion(category.id, index, editingItem.text)
                    }
                  >
                    <Ionicons name="checkmark" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editCancelButton}
                    onPress={() => setEditingItem(null)}
                  >
                    <Ionicons name="close" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {suggestion}
                </Text>
                <View style={styles.suggestionActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      setEditingItem({
                        categoryId: category.id,
                        index,
                        text: suggestion,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={14} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      handleDeleteSuggestion(category.id, index, suggestion)
                    }
                  >
                    <Ionicons name="trash-outline" size={14} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}

        {category.suggestions.length === 0 && (
          <Text style={styles.emptySuggestions}>
            Nenhuma sugestão ainda. Adicione algumas!
          </Text>
        )}
      </ScrollView>
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

          <Text style={styles.title}>Indecisão</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Não sabem o que fazer? Deixem o destino escolher! 🎲
        </Text>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Random Result */}
          {randomResult && (
            <Animated.View
              style={[
                styles.resultCard,
                {
                  opacity: resultAnimation,
                  transform: [
                    {
                      scale: resultAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="shuffle" size={48} color="#FF69B4" />
              <Text style={styles.resultTitle}>Sugestão do Destino:</Text>
              <Text style={styles.resultText}>{randomResult}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => handleRandomize(selectedCategory!)}
              >
                <Ionicons name="refresh" size={16} color="#FF69B4" />
                <Text style={styles.retryText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {categories.map(renderCategory)}
          </View>
        </ScrollView>
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
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF69B4",
    marginTop: 12,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  retryText: {
    color: "#FF69B4",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  categoriesContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  addCategoryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  randomizeButton: {
    backgroundColor: "#FF69B4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  randomizeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  addFormButtons: {
    flexDirection: "row",
    gap: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#FF69B4",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  suggestionActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  editForm: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  editButtons: {
    flexDirection: "row",
    gap: 4,
  },
  editConfirmButton: {
    padding: 4,
  },
  editCancelButton: {
    padding: 4,
  },
  emptySuggestions: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 16,
  },
});
