import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface MenuOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  colors?: string[];
}

export default function MenuOption({
  icon,
  title,
  description,
  onPress,
  colors = ["#FF69B4", "#FFB6C1"],
}: MenuOptionProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[...colors, "rgba(255,255,255,0.1)"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
              style={styles.iconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={icon} size={28} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 12,
  },
  gradient: {
    padding: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 16,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 1,
  },
});
