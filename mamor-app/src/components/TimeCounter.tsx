import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface TimeCounterProps {
  startDate: Date;
  compact?: boolean;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeCounter({
  startDate,
  compact = false,
}: TimeCounterProps) {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      if (diff < 0) return;

      // Calculate years, months, days, hours, minutes, seconds
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeElapsed();

    // Update every second
    const interval = setInterval(calculateTimeElapsed, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  if (compact) {
    // Versão compacta horizontal
    return (
      <View style={styles.compactContainer}>
        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.years.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Anos</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.months.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Meses</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.days.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Dias</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.hours.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Horas</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.minutes.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Min</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#EC4899", "#BE185D"]}
          style={styles.timeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.timeNumber}>
            {timeElapsed.seconds.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>Seg</Text>
        </LinearGradient>
      </View>
    );
  }

  // Versão grid normal
  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridRow}>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.years}</Text>
          <Text style={styles.gridTimeLabel}>Anos</Text>
        </View>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.months}</Text>
          <Text style={styles.gridTimeLabel}>Meses</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.days}</Text>
          <Text style={styles.gridTimeLabel}>Dias</Text>
        </View>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.hours}</Text>
          <Text style={styles.gridTimeLabel}>Horas</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.minutes}</Text>
          <Text style={styles.gridTimeLabel}>Min</Text>
        </View>
        <View style={styles.gridTimeCard}>
          <Text style={styles.gridTimeNumber}>{timeElapsed.seconds}</Text>
          <Text style={styles.gridTimeLabel}>Seg</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos para versão compacta horizontal
  compactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    flexWrap: "wrap",
  },
  timeCard: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minWidth: 56,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timeLabel: {
    fontSize: 10,
    color: "#FDE2E7",
    fontWeight: "500",
    marginTop: 2,
  },

  // Estilos para versão grid (não compacta)
  gridContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  gridRow: {
    flexDirection: "row",
    gap: 8,
  },
  gridTimeCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 105, 180, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 180, 0.2)",
  },
  gridTimeNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 4,
  },
  gridTimeLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
