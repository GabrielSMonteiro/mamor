import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({
  onLoadingComplete,
}: LoadingScreenProps) {
  // Animações
  const heartPulse = useRef(new Animated.Value(1)).current;
  const floatingHeart1 = useRef(new Animated.Value(0)).current;
  const floatingHeart2 = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in inicial
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animação do coração principal
    const heartAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    heartAnimation.start();

    // Animação dos corações flutuantes
    const floatingAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingHeart1, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingHeart1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation1.start();

    // Segunda animação flutuante com delay
    setTimeout(() => {
      const floatingAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.timing(floatingHeart2, {
            toValue: -15,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(floatingHeart2, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      floatingAnimation2.start();
    }, 500);

    // Animação dos dots de carregamento
    const dotsAnimation = Animated.loop(
      Animated.stagger(
        300,
        dotsOpacity.map((dot) =>
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        )
      )
    );
    dotsAnimation.start();

    // Timer para finalizar o loading
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      heartAnimation.stop();
      floatingAnimation1.stop();
      dotsAnimation.stop();
    };
  }, [onLoadingComplete]);

  return (
    <LinearGradient
      colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        {/* Heart Container */}
        <View style={styles.heartContainer}>
          {/* Main Heart */}
          <Animated.View
            style={[
              styles.mainHeart,
              {
                transform: [{ scale: heartPulse }],
              },
            ]}
          >
            <Ionicons name="heart" size={96} color="#FFFFFF" />
          </Animated.View>

          {/* Floating Heart 1 */}
          <Animated.View
            style={[
              styles.floatingHeart1,
              {
                transform: [{ translateY: floatingHeart1 }],
              },
            ]}
          >
            <Ionicons name="heart" size={24} color="rgba(255, 255, 255, 0.6)" />
          </Animated.View>

          {/* Floating Heart 2 */}
          <Animated.View
            style={[
              styles.floatingHeart2,
              {
                transform: [{ translateY: floatingHeart2 }],
              },
            ]}
          >
            <Ionicons name="heart" size={24} color="rgba(255, 255, 255, 0.6)" />
          </Animated.View>
        </View>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>Mamor</Text>
          <Text style={styles.loadingText}>
            Carregando momentos especiais...
          </Text>
        </View>

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {dotsOpacity.map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: dot,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  heartContainer: {
    position: "relative",
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
  },
  mainHeart: {
    alignItems: "center",
    justifyContent: "center",
  },
  floatingHeart1: {
    position: "absolute",
    top: -16,
    right: -16,
  },
  floatingHeart2: {
    position: "absolute",
    bottom: -16,
    left: -16,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
});
