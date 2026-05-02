import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { products } from "@/data/products";
import { useColors } from "@/hooks/useColors";

const PILLARS = [
  { label: "BIS Certified · IS 15885", icon: "check-square" as const },
  { label: "GST invoice", icon: "file-text" as const },
  { label: "UPI · Cards · COD", icon: "credit-card" as const },
  { label: "24-month warranty", icon: "shield" as const },
];

const TECH_STACK = [
  {
    name: "FastShield™",
    desc: "Smart IC overcurrent & temperature protection",
    icon: "shield" as const,
  },
  {
    name: "TrueWatt Certified™",
    desc: "Lab-verified wattage on every SKU",
    icon: "activity" as const,
  },
  {
    name: "FlexArmor™",
    desc: "10,000+ bend cycles, reinforced joints",
    icon: "zap" as const,
  },
];

function CableDiagram({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.diagramContainer, { backgroundColor: colors.dark }]}>
      <Image
        source={require("../../assets/images/cable-hero.png")}
        style={styles.diagramImage}
        resizeMode="cover"
      />
      <View style={styles.diagramOverlay}>
        <View style={[styles.specBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.specBadgeText, { color: colors.primaryForeground }]}>
            240 W
          </Text>
        </View>
        <View style={styles.specRow}>
          <Text style={[styles.specLabel, { color: colors.secondary }]}>
            FW·001 · USB-C ↔ USB-C · 1.5 M
          </Text>
        </View>
      </View>
    </View>
  );
}

function PressableCard({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const featured = products[0];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleShopPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/shop");
  };

  const handleFeaturedPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${featured.id}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.wordmark, { color: colors.foreground }]}>
          FASTWARE
        </Text>
        <View style={[styles.tagChip, { backgroundColor: colors.dark }]}>
          <Text style={[styles.tagChipText, { color: colors.secondary }]}>
            fastware.in
          </Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={[styles.heroLine1, { color: colors.foreground }]}>
          Every cable{" "}
          <Text style={{ color: colors.primary }}>fails.</Text>
        </Text>
        <Text style={[styles.heroLine2, { color: colors.foreground }]}>
          Ours tells{"\n"}you first.
        </Text>
        <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
          Smart IC. Wear-indicator braid. 24-month replacement on order number alone.
        </Text>

        <Pressable
          onPress={handleShopPress}
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>
            Shop cables
          </Text>
          <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {/* Cable Diagram */}
      <PressableCard
        onPress={handleFeaturedPress}
        style={styles.diagramWrapper}
      >
        <CableDiagram colors={colors} />
      </PressableCard>

      {/* Section label */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>02</Text>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          — THE WEAR-INDICATOR
        </Text>
      </View>

      {/* Wear indicator section */}
      <View style={[styles.wearSection, { borderColor: colors.border }]}>
        <View style={styles.wearContent}>
          <Image
            source={require("../../assets/images/wear-indicator.png")}
            style={styles.wearImage}
            resizeMode="cover"
          />
          <View style={styles.wearText}>
            <Text style={[styles.wearTitle, { color: colors.foreground }]}>
              You'll see it before your phone does.
            </Text>
            <Text style={[styles.wearDesc, { color: colors.mutedForeground }]}>
              A thread woven into the braid changes appearance as the cable wears. No app. No guesswork.
            </Text>
          </View>
        </View>
      </View>

      {/* Technology stack */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>03</Text>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          — TECHNOLOGY STACK
        </Text>
      </View>

      <View style={styles.techGrid}>
        {TECH_STACK.map((t, i) => (
          <Pressable
            key={t.name}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/about");
            }}
            style={({ pressed }) => [
              styles.techItem,
              { backgroundColor: colors.dark, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={[styles.techIconBadge, { backgroundColor: colors.primary }]}>
              <Feather name={t.icon} size={14} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.techName, { color: colors.secondary }]}>
              {t.name}
            </Text>
            <Text style={[styles.techDesc, { color: colors.mutedForeground }]}>
              {t.desc}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Trust pillars */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>04</Text>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          — TRUST
        </Text>
      </View>

      <View style={[styles.pillarsGrid, { borderColor: colors.border }]}>
        {PILLARS.map((p, i) => (
          <View
            key={p.label}
            style={[
              styles.pillarItem,
              { borderColor: colors.border },
              i % 2 === 0 && { borderRightWidth: 1 },
              i < 2 && { borderBottomWidth: 1 },
            ]}
          >
            <Feather name={p.icon} size={16} color={colors.primary} />
            <Text style={[styles.pillarLabel, { color: colors.foreground }]}>
              {p.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  wordmark: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  tagChipText: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroLine1: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    lineHeight: 46,
  },
  heroLine2: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    lineHeight: 46,
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 4,
  },
  ctaText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  diagramWrapper: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 4,
    overflow: "hidden",
  },
  diagramContainer: {
    height: 200,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  diagramImage: {
    width: "100%",
    height: "100%",
  },
  diagramOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "space-between",
  },
  specBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  specBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  specRow: {
    alignSelf: "flex-start",
  },
  specLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionIndex: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  wearSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  wearContent: {
    flexDirection: "row",
  },
  wearImage: {
    width: 120,
    height: 120,
  },
  wearText: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 8,
  },
  wearTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  wearDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  techGrid: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 32,
  },
  techItem: {
    borderRadius: 4,
    padding: 14,
    gap: 6,
  },
  techIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  techName: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  techDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  pillarsGrid: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  pillarItem: {
    width: "50%",
    padding: 16,
    gap: 8,
  },
  pillarLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
});
