import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeCounter from "../components/TimeCounter";
import type { NavigationProps } from "../types/navigation";

const HeartsEffect = ({ visible }: { visible: boolean }) => {
  const heartsAnimations = Array.from(
    { length: 20 },
    () => new Animated.Value(0)
  );

  React.useEffect(() => {
    if (visible) {
      const animations = heartsAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 2500,
          delay: index * 100,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, animations).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.heartsContainer}>
      {heartsAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.heart,
            {
              left: `${Math.random() * 90}%`,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0.7, 0.7, 0],
              }),
            },
          ]}
        >
          <Ionicons name="heart" size={32} color="#e11d48" />
        </Animated.View>
      ))}
    </View>
  );
};

interface MenuOptionData {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  page: string;
  colors: string[];
}

interface MainMenuScreenProps {
  navigation: any;
}

export default function MainMenuScreen({ navigation }: NavigationProps) {
  const relationshipStart = new Date("2025-04-22T10:00:00");

  const menuOptions: MenuOptionData[] = [
    {
      icon: "chatbubble",
      title: "Declaração",
      description: "Uma declaração especial que muda todos os dias",
      page: "Declaration",
      colors: ["#FF69B4", "#FFB6C1"],
    },
    {
      icon: "camera",
      title: "Fotos",
      description: "Nossa galeria de momentos especiais",
      page: "Photos",
      colors: ["#9F7AEA", "#FF69B4"],
    },
    {
      icon: "list",
      title: "Atividades",
      description: "Lista de coisas que queremos fazer juntos",
      page: "BucketList",
      colors: ["#4299E1", "#9F7AEA"],
    },
    {
      icon: "shuffle",
      title: "Indecisão",
      description: "Deixe o destino escolher por nós",
      page: "Random",
      colors: ["#48BB78", "#4299E1"],
    },
    {
      icon: "musical-notes",
      title: "Música",
      description: "Músicas que me fazem lembrar de você",
      page: "Music",
      colors: ["#ED8936", "#F56565"],
    },
  ];

  const [showConfirm, setShowConfirm] = useState(false);
  const [datingStart, setDatingStart] = useState<Date | null>(null);
  const [showHearts, setShowHearts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedDatingStart = await AsyncStorage.getItem(
          "mamor_dating_start"
        );
        if (savedDatingStart) {
          setDatingStart(new Date(savedDatingStart));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  const handleSimClick = () => {
    if (!datingStart) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    const now = new Date();
    setDatingStart(now);
    setShowConfirm(false);
    setShowHearts(true);

    try {
      await AsyncStorage.setItem("mamor_dating_start", now.toISOString());
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }

    setTimeout(() => setShowHearts(false), 3000);
  };

  const renderMenuOption = (option: MenuOptionData) => (
    <TouchableOpacity
      key={option.page}
      style={styles.menuOption}
      onPress={() => navigation.navigate(option.page)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[...option.colors, "rgba(255,255,255,0.1)"]}
        style={styles.menuOptionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.menuOptionContent}>
          <Ionicons name={option.icon} size={28} color="#FFFFFF" />
          <View style={styles.menuOptionText}>
            <Text style={styles.menuOptionTitle}>{option.title}</Text>
            <Text style={styles.menuOptionDescription}>
              {option.description}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
        style={styles.loadingContainer}
      >
        <Animated.View style={styles.loadingHeart}>
          <Ionicons name="heart" size={40} color="#FFFFFF" />
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#FF69B4" barStyle="light-content" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="heart" size={24} color="#FFFFFF" />
              <Text style={styles.title}>Mamor</Text>
              <Ionicons name="heart" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.subtitle}>Nosso cantinho especial 💕</Text>
          </View>

          {/* Contadores */}
          <View style={styles.countersContainer}>
            <View style={styles.counterSection}>
              <Text style={styles.counterLabel}>Juntos há:</Text>
              <TimeCounter startDate={relationshipStart} compact={true} />
            </View>

            {datingStart && (
              <View style={[styles.counterSection, styles.datingSection]}>
                <Text style={styles.datingCounterLabel}>Namorando há:</Text>
                <TimeCounter startDate={datingStart} compact={true} />
              </View>
            )}
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            {menuOptions.map(renderMenuOption)}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Feito com 💖 para você</Text>

            {!datingStart ? (
              <TouchableOpacity
                style={styles.simButton}
                onPress={handleSimClick}
                activeOpacity={0.8}
              >
                <Text style={styles.simButtonText}>Sim? 💕</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.namorandoButton}>
                <Ionicons name="heart" size={16} color="#FFFFFF" />
                <Text style={styles.namorandoButtonText}>Namorando 💖</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modal de Confirmação */}
        <Modal
          visible={showConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name="heart"
                size={48}
                color="#FF69B4"
                style={styles.modalHeart}
              />
              <Text style={styles.modalTitle}>Que pergunta especial! 💕</Text>
              <Text style={styles.modalText}>
                Tem certeza que quer começar essa jornada juntos?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Sim, quero! 💖</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowConfirm(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Ainda não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Hearts Effect */}
        <HeartsEffect visible={showHearts} />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingHeart: {
    opacity: 0.8,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  countersContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterSection: {
    alignItems: "center",
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 12,
    textAlign: "center",
  },
  datingSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  datingCounterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF69B4",
    marginBottom: 12,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    gap: 12,
  },
  menuOption: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuOptionGradient: {
    padding: 20,
  },
  menuOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionText: {
    flex: 1,
    marginLeft: 16,
  },
  menuOptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  menuOptionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  simButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  simButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  namorandoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF69B4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  namorandoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeart: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF69B4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF69B4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  heartsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  heart: {
    position: "absolute",
    top: "80%",
  },
});
