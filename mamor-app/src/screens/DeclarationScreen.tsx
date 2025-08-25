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
    "Mamor, quando a gente decidiu que iriamos ficar juntos eu não pude imaginar o quão especial e complicado poderia ser, mas poder olhar nos seus olhos todo dia, sentir a sua pele e beijar sua boca faz tudo ter valido a pena e eu refaria tudo de novo. 💕",
    "Dormir e acordar do seu lado é a coisa mais especial que tem para mim, não importa se é em um hotel em Jampa, nas nossas casas ou no banco de trás do seu carro, te ver descansada, segura e sendo apenas você (a pessoa mais incrível do mundo) é suficiente para alegrar o meu dia. 🌸",
    "Você é a parte mais bonita da minha vida, ver o seu sorriso, o brilho no seu olhar ✨",
    "É difícil dizer para você o você representa para mim, talvez um dia você entenda que minha vida não faz sentido sem você, que eu te amo mais do que tudo e que eu quero passar o resto dos meus dias ao seu lado.",
    "Seu sorriso tem o poder de transformar qualquer dia ruim em um dia incrível, mamor você é minha felicidade. 😊",
    "Meu nenem, é impressionante como eu consigo me apaixonar diariamente por você, me encantar com todas as suas qualidades e cada dia me surpreender com o quanto eu posso te amar. 💖",
    "A nossa história começou há mais de dois anos atrás, eu me apaixonei por você mais rápido do que eu consigo me lembrar e de forma tão intensa que hoje podendo colocar para fora é algo que me faz sentir que tudo valeu a pena.",
    "Dormir com você é uma das coisas mais gostosas que existe, sentir o seu cheiro, o calor do seu corpo e a sua respiração rápida para me fazer inveja é algo que eu não trocaria por nada.",
    "Nunca se esqueça do quanto eu te amo, do quanto você é especial para mim e do quanto eu sou grato por ter você na minha vida, nunca, nunca duvide do meu amor e o quanto você merece ser amada",
    "Passamos por muita coisa, algumas pareceram que iam acabar com o que estavamos construindo, outras me deram a certeza de que você valia a pena, independente de o quanto tenha sido doloroso cada etapa, foi o passado e nos ajudou a chegar até aqui, não se sinta culpada por nada.",
    "Você é minha pessoa favorita, a minha melhor amiga, a razão da minha felicidade, meu para sempre, infinitamente mamor!",
    "'Como eu sou sortudo de ter alguém que torna tão difícil dizer adeus.' - Winnie the Pooh",
    "Você aceitou as minhas inseguranças, meus medos e minhas loucuras e mesmo assim decidiu ficar, me amar e me fazer a pessoa mais feliz do mundo. Obrigado por ser minha companheira de vida e por nunca desistir de mim mesmo sem ar hehe.",
    "Eu amo o quanto você é musical, e está sempre cantarolando, acho que nunca agradeci por cantar para mim quanto eu estava mal, amo sua voz e a calma que ela me traz. 🎵",
    "Amo como você entra nas brincadeiras e me permite te conhecer cada dia mais, entender seus medos, conhecer os seus gostos, sonhar o mesmo sonho que você e permitir que eu tente ao máximo te fazer feliz.",
    "Honestamente eu não sei expressar o quanto eu te quero e como eu não consigo mais imaginar a minha vida sem ser do seu lado, espero que sejamos muito felizes para sempre!",
    "Você é a minha panqueca, a minha princesa, o meu nenem, o meu amor, a pessoa mais preciosa que eu tenho na vida.",
    "Nunca se esqueça o quanto você é forte e determinada, por mais que alguns dias você possa sse sentir uma ameba, você é a pessoa mais forte que eu conheço e eu te admiro muito, tanto sua inteligência, quanto a sua bondade, carisma e tudo mais. 🌹",
    "Cada segundo ao seu lado é inesquecível, independente do que tenhamos construído, eu sei que a única certeza que tenho é que preciso de você para sempre comigo. ⏰",
    "Mamor você é além de tudo que eu poderia sonhar, meu jacarezinho que me morde, meu pandinha que tropeça sozinha, meu coala que vive agarrado hehe",
    "Ei gata, me chama de tabela periódica e diz que rola uma química entre nós.",
    "'Como eu desejo fugir dos dias normais! Eu quero correr solta com minha imaginação' - Alice no país das maravilhas, Mo é absurdo o quanto eu, que amo ficar em casa, sempre tenho vontade de desbravar o mundo com você, fazer coisas novas, sair, curtir ou simplesmente deitar agarradinhos pensando na vida.",
    "Eu acho que nunca conseguirei agradecer o suficiente pelo tanto que você me ajudou e me deu o suporte que eu precisava no momento que eu estava mais fragilizado, eu já te amava a muito tempo e continuaria te amando mesmo se não tivesse feito nada, mas sou grato pela preocupação e por ter cuidado tanto de mim.",
    "'Duvida da luz dos astros, de que o sol tenha calor, duvida até da verdade, mas confia em meu amor.' - Shakespeare, eu sei que vai ser difícil eu te convencer ou provar isso, mas espero que com o passar do tempo você consiga se enxergar da mesma forma que eu te enxergo, te admirar da mesma forma que eu te admiro e te respeitar da mesma forma que eu te respeito, para que assim, nesse dia você entenda que eu nunca poderia te amar o suficiente que você merece.",
    "Eu acho que nunca quis tanto passar todo o meu tempo com alguém, dormir e acordar juntos, compartilhar momentos e contruir uma história como o que quero com você.",
    "Eu amo como você consegue ficar linda em qualquer foto, seja preparada ou espontânea, o seu sorriso é a coisa mais linda do mundo e o seu olhar é hipnotizante, mamor. 📸",
    "A gente já passou por muita coisa juntos e vamos passar por mais ainda, mas fico feliz como nos mostramos resilientes e que o nosso amor é capaz de superar qualquer coisa, espero que possamos sempre manter esse diálogo aberto e transparente. 💕",
    "Eu amo cada parte sua, seus pezinhos sensíveis, suas quicilas, seus zoião, fico feliz de você ser 100% minha e eu 97% seu hehe",
    "Amor, saiba que vamos realizar tudo o que sonhamos e que para o que você precisar eu sempre estarei ao seu lado! Sempre, eu te amo!",
    "Você não faz ideia a dificuldade que foi fazer 30 declarações kkkkkkk Mas no fim de tudo a única coisa que posso fazer é te agradecer, agradecer por ser essa pessoa incrível que você é, agradecer por ser minha companheira, minha melhor amiga, por me permitir ter você na minha vida e finalemnte por poder te chamar de MINHA NAMORADA. EU TE AMO! ❤️",
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
