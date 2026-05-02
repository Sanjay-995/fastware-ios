import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const PAY_LABELS: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on Delivery",
};

export default function ConfirmationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orderNum, total, payMethod, name, itemCount } =
    useLocalSearchParams<{
      orderNum: string;
      total: string;
      payMethod: string;
      name: string;
      itemCount: string;
    }>();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Animate checkmark in
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 150 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalNum = parseInt(total ?? "0", 10);
  const items = parseInt(itemCount ?? "1", 10);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 40, paddingBottom: botPad + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated check */}
      <Animated.View
        style={[
          styles.checkCircle,
          { backgroundColor: colors.primary, transform: [{ scale }], opacity },
        ]}
      >
        <Feather name="check" size={40} color={colors.primaryForeground} />
      </Animated.View>

      <Animated.View style={[styles.textBlock, { opacity }]}>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          Order placed!
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. Your cables are on the way.
        </Text>
      </Animated.View>

      {/* Order card */}
      <View style={[styles.card, { backgroundColor: colors.dark }]}>
        <Row label="Order number" value={orderNum ?? "FW-00000"} colors={colors} mono />
        <Row
          label={`Item${items !== 1 ? "s" : ""}`}
          value={`${items} cable${items !== 1 ? "s" : ""}`}
          colors={colors}
        />
        <Row
          label="Payment"
          value={PAY_LABELS[payMethod ?? "cod"] ?? payMethod}
          colors={colors}
        />
        <Row
          label="Amount paid"
          value={`₹${totalNum.toLocaleString("en-IN")}`}
          colors={colors}
          accent
        />
        <View style={[styles.divider, { backgroundColor: colors.darkMuted }]} />
        <Row label="Estimated delivery" value="5–7 business days" colors={colors} />
        <Row label="GST invoice" value="Emailed to you" colors={colors} />
      </View>

      {/* Wear indicator note */}
      <View
        style={[
          styles.tipCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
          Your cable has a wear-indicator thread. When it starts to show, it's time for a replacement — just enter your order number.
        </Text>
      </View>

      {/* CTA */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace("/(tabs)/index");
        }}
        style={({ pressed }) => [styles.homeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.homeBtnText, { color: colors.primaryForeground }]}>
          Continue shopping
        </Text>
        <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/(tabs)/warranty")}
        style={({ pressed }) => [styles.warrantyLink, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.warrantyLinkText, { color: colors.mutedForeground }]}>
          Track warranty · enter {orderNum}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  colors,
  mono,
  accent,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          {
            color: accent ? colors.primary : colors.secondary,
            fontFamily: mono ? "Inter_700Bold" : "Inter_500Medium",
            letterSpacing: mono ? 1 : 0,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { alignItems: "center", gap: 8 },
  heading: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    width: "100%",
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  rowValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  divider: { height: 1 },
  tipCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  tipDot: { width: 8, height: 8, borderRadius: 4, marginTop: 3 },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  homeBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 4,
  },
  homeBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  warrantyLink: { paddingVertical: 14, minHeight: 44, justifyContent: "center" },
  warrantyLinkText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
