import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function DeclarationScreen({ navigation }: any) {
  const [currentDeclaration, setCurrentDeclaration] = useState("");
  const [dayNumber, setDayNumber] = useState(1);
  const [heartAnimation] = useState(new Animated.Value(1));

  // Declarações de amor - podem ser expandidas
  const declarations = [
    "Você é a razão do meu sorriso todos os dias. Cada momento ao seu lado é um presente que guardo no coração. 💕",
    "Quando penso em você, meu coração se enche de uma felicidade que não consigo explicar. Você é minha paz e minha alegria. 🌸",
    "Seus olhos são como estrelas que iluminam meus dias mais escuros. Obrigado por ser minha luz. ✨",
    "Cada dia ao seu lado é uma nova aventura cheia de amor e descobertas. Você torna tudo mais especial. 🦋",
    "Seu sorriso tem o poder de transformar qualquer dia ruim em algo maravilhoso. Você é minha felicidade. 😊",
    "Com você aprendi que o amor verdadeiro não é apenas um sentimento, é uma escolha que faço todos os dias. 💖",
    "Você transformou minha vida em uma história de amor mais bonita do que eu poderia imaginar. 📖",
    "Cada manhã ao seu lado é um novo começo, cada noite é uma promessa de que estaremos juntos amanhã. 🌅",
    "Seus abraços são meu lugar seguro, seu sorriso é minha medicina, seu amor é minha força. 🏠",
    "Não importa quantos dias se passem, meu amor por você só cresce mais e mais. 🌱",
    "Você é minha pessoa favorita, meu melhor amigo, meu grande amor, meu para sempre. 👫",
    "Em um mundo cheio de possibilidades, você é minha única certeza. 🌍",
    "Obrigado por me amar nos meus dias difíceis e celebrar comigo nos momentos felizes. 🎉",
    "Você é a melodia mais bonita que meu coração já conheceu. 🎵",
    "Com você, descobri que o amor é feito de pequenos gestos e grandes sonhos. 💭",
    "Cada beijo seu é uma promessa, cada carinho é uma declaração silenciosa de amor. 💋",
    "Você é minha inspiração para ser uma pessoa melhor a cada dia. 🌟",
    "Nosso amor é como uma flor: precisa de cuidado, carinho e dedicação para florescer. 🌹",
    "Você é meu ontem, meu hoje e todos os meus amanhãs. ⏰",
    "Com você aprendi que o amor não tem pressa, mas também nunca para de crescer. 💕",
    "Você é o presente mais bonito que a vida me deu. 🎁",
    "Cada dia ao seu lado é uma página nova na nossa história de amor. 📝",
    "Você é minha paz em meio ao caos, minha calma na tempestade. 🌈",
    "Obrigado por escolher me amar todos os dias, mesmo quando não sou perfeito. 💝",
    "Você é minha definição de lar, não importa onde estejamos. 🏡",
    "Com você, cada momento comum se torna uma memória especial. 📸",
    "Você é minha razão para acreditar no amor verdadeiro. 💕",
    "Cada 'eu te amo' nosso é único, mesmo sendo o milésimo. 💬",
    "Você é minha companheira de vida, minha parceira de sonhos. 🤝",
    "Obrigado por fazer do nosso amor a coisa mais bonita da minha vida. ❤️",
  ];

  useEffect(() => {
    // Calcula qual declaração mostrar baseado no dia atual
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const declarationIndex = (dayOfYear - 1) % declarations.length;
    const currentDay = ((dayOfYear - 1) % 30) + 1; // Ciclo de 30 dias

    setCurrentDeclaration(declarations[declarationIndex]);
    setDayNumber(currentDay);

    // Animação do coração
    startHeartAnimation();
  }, []);

  const startHeartAnimation = () => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
  };

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

          <Text style={styles.title}>Declaração</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              // Aqui você pode implementar edição personalizada
              console.log("Edit pressed");
            }}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Day Counter */}
          <View style={styles.dayCounterContainer}>
            <View style={styles.dayCounter}>
              <Ionicons name="heart" size={16} color="#FF69B4" />
              <Text style={styles.dayCounterText}>Dia {dayNumber} de 30</Text>
            </View>
          </View>

          {/* Declaration Card */}
          <View style={styles.declarationCard}>
            <Animated.View
              style={[
                styles.heartContainer,
                {
                  transform: [{ scale: heartAnimation }],
                },
              ]}
            >
              <Ionicons name="heart" size={64} color="#FF69B4" />
            </Animated.View>

            <View style={styles.declarationContent}>
              <Text style={styles.declarationText}>{currentDeclaration}</Text>

              <View style={styles.signature}>
                <Text style={styles.signatureText}>Com todo meu amor ❤️</Text>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Uma nova declaração aparece a cada dia, em um ciclo de 30
              mensagens especiais.
            </Text>
          </View>

          {/* Fun Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#FF69B4" />
              <Text style={styles.statNumber}>{dayNumber}</Text>
              <Text style={styles.statLabel}>Dia Atual</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="heart-circle" size={24} color="#FF69B4" />
              <Text style={styles.statNumber}>{declarations.length}</Text>
              <Text style={styles.statLabel}>Declarações</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="infinite" size={24} color="#FF69B4" />
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Amor</Text>
            </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dayCounterContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  dayCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 105, 180, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 180, 0.3)",
  },
  dayCounterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF69B4",
    marginLeft: 8,
  },
  declarationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  heartContainer: {
    marginBottom: 24,
  },
  declarationContent: {
    alignItems: "center",
    width: "100%",
  },
  declarationText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 24,
  },
  signature: {
    alignSelf: "flex-end",
  },
  signatureText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF69B4",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
