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
    // ✅ VERSÃO COMPACTA: Uma linha só, anos aparecem apenas se > 0
    return (
      <View style={styles.compactContainer}>
        {/* ✅ Só mostra anos se for maior que 0 */}
        {timeElapsed.years > 0 && (
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
        )}

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

  // ✅ VERSÃO GRID: Também com anos condicionais e layout otimizado
  const timeUnits = [
    ...(timeElapsed.years > 0
      ? [{ value: timeElapsed.years, label: "Anos" }]
      : []),
    { value: timeElapsed.months, label: "Meses" },
    { value: timeElapsed.days, label: "Dias" },
    { value: timeElapsed.hours, label: "Horas" },
    { value: timeElapsed.minutes, label: "Min" },
    { value: timeElapsed.seconds, label: "Seg" },
  ];

  // ✅ Layout dinâmico baseado na quantidade de unidades
  const getGridLayout = (count: number) => {
    if (count === 5)
      return {
        rows: [
          [0, 1],
          [2, 3, 4],
        ],
      }; // Sem anos
    if (count === 6)
      return {
        rows: [
          [0, 1, 2],
          [3, 4, 5],
        ],
      }; // Com anos
    return { rows: [[0, 1], [2, 3], [4]] }; // Fallback
  };

  const layout = getGridLayout(timeUnits.length);

  return (
    <View style={styles.gridContainer}>
      {layout.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((unitIndex) => {
            const unit = timeUnits[unitIndex];
            return (
              <View key={unitIndex} style={styles.gridTimeCard}>
                <Text style={styles.gridTimeNumber}>{unit.value}</Text>
                <Text style={styles.gridTimeLabel}>{unit.label}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ ESTILOS PARA VERSÃO COMPACTA (uma linha)
  compactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6, // ✅ Gap reduzido para caber melhor
    paddingHorizontal: 4,
    flexWrap: "nowrap", // ✅ Força uma linha só
  },
  timeCard: {
    borderRadius: 12,
    paddingVertical: 10, // ✅ Padding reduzido
    paddingHorizontal: 8, // ✅ Padding reduzido
    minWidth: 48, // ✅ Largura mínima reduzida
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
    fontSize: 16, // ✅ Fonte reduzida
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timeLabel: {
    fontSize: 9, // ✅ Fonte reduzida
    color: "#FDE2E7",
    fontWeight: "500",
    marginTop: 2,
  },

  // ✅ ESTILOS PARA VERSÃO GRID (layout dinâmico)
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
    justifyContent: "center", // ✅ Centraliza os cards
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
    maxWidth: 80, // ✅ Largura máxima para manter proporção
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
