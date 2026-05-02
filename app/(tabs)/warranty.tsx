import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type WarrantyStatus = "active" | "claimed" | "expired" | "not_found";

interface WarrantyResult {
  status: WarrantyStatus;
  orderNumber: string;
  product?: string;
  purchaseDate?: string;
  expiryDate?: string;
  replacementSent?: boolean;
}

const MOCK_ORDERS: Record<string, WarrantyResult> = {
  "FW-12345": {
    status: "active",
    orderNumber: "FW-12345",
    product: "FW·001 USB-C to USB-C",
    purchaseDate: "14 Mar 2024",
    expiryDate: "14 Mar 2026",
  },
  "FW-67890": {
    status: "claimed",
    orderNumber: "FW-67890",
    product: "FW·002 USB-C to USB-C",
    purchaseDate: "02 Aug 2023",
    expiryDate: "02 Aug 2025",
    replacementSent: true,
  },
  "FW-11111": {
    status: "expired",
    orderNumber: "FW-11111",
    product: "FW·003 USB-A to USB-C",
    purchaseDate: "15 Jan 2022",
    expiryDate: "15 Jan 2024",
  },
};

const STATUS_CONFIG: Record<
  WarrantyStatus,
  { label: string; icon: "check-circle" | "clock" | "x-circle" | "help-circle"; color: string }
> = {
  active: { label: "Active", icon: "check-circle", color: "#4ade80" },
  claimed: { label: "Replacement sent", icon: "check-circle", color: "#60a5fa" },
  expired: { label: "Expired", icon: "x-circle", color: "#f87171" },
  not_found: { label: "Not found", icon: "help-circle", color: "#94a3b8" },
};

export default function WarrantyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<WarrantyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleCheck = () => {
    if (!orderNumber.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    setTimeout(() => {
      const key = orderNumber.trim().toUpperCase();
      const found = MOCK_ORDERS[key];
      if (found) {
        setResult(found);
      } else {
        setResult({ status: "not_found", orderNumber: key });
      }
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setOrderNumber("");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad + 80 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>05</Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Warranty</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          24-month replacement. Order number alone.
        </Text>
      </View>

      {/* How it works */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.foreground }]}>
          How replacement works
        </Text>
        {[
          "Enter your order number below",
          "We verify within 24 hours",
          "Replacement shipped at no cost",
        ].map((step, i) => (
          <View key={i} style={styles.infoStep}>
            <View style={[styles.stepDot, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepDotText, { color: colors.primaryForeground }]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
          </View>
        ))}
      </View>

      {/* Input */}
      <View style={styles.inputSection}>
        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
          Order number
        </Text>
        <View
          style={[
            styles.inputRow,
            { borderColor: result ? colors.border : colors.primary },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="e.g. FW-12345"
            placeholderTextColor={colors.mutedForeground}
            value={orderNumber}
            onChangeText={(t) => {
              setOrderNumber(t);
              if (result) setResult(null);
            }}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleCheck}
          />
        </View>
        <Text style={[styles.inputHint, { color: colors.mutedForeground }]}>
          Try: FW-12345, FW-67890, or FW-11111
        </Text>

        <Pressable
          onPress={handleCheck}
          disabled={loading || !orderNumber.trim()}
          style={({ pressed }) => [
            styles.checkBtn,
            {
              backgroundColor:
                loading || !orderNumber.trim() ? colors.muted : colors.primary,
              opacity: pressed ? 0.7 : 1
            },
          ]}
        >
          <Text
            style={[
              styles.checkBtnText,
              {
                color:
                  loading || !orderNumber.trim()
                    ? colors.mutedForeground
                    : colors.primaryForeground,
              },
            ]}
          >
            {loading ? "Checking..." : "Check warranty"}
          </Text>
          {!loading && (
            <Feather
              name="arrow-right"
              size={15}
              color={
                !orderNumber.trim() ? colors.mutedForeground : colors.primaryForeground
              }
            />
          )}
        </Pressable>
      </View>

      {/* Result */}
      {result && (
        <WarrantyResultCard result={result} colors={colors} onReset={handleReset} />
      )}
    </ScrollView>
  );
}

function WarrantyResultCard({
  result,
  colors,
  onReset,
}: {
  result: WarrantyResult;
  colors: ReturnType<typeof useColors>;
  onReset: () => void;
}) {
  const config = STATUS_CONFIG[result.status];

  return (
    <View style={[styles.resultCard, { backgroundColor: colors.dark }]}>
      {/* Status header */}
      <View style={styles.resultHeader}>
        <Feather name={config.icon} size={24} color={config.color} />
        <View style={styles.resultHeaderText}>
          <Text style={[styles.resultStatus, { color: config.color }]}>
            {config.label}
          </Text>
          <Text style={[styles.resultOrderNum, { color: colors.secondary }]}>
            {result.orderNumber}
          </Text>
        </View>
      </View>

      {result.product && (
        <>
          <View style={[styles.resultDivider, { backgroundColor: colors.darkMuted }]} />
          <ResultRow label="Product" value={result.product} colors={colors} />
          <ResultRow label="Purchased" value={result.purchaseDate!} colors={colors} />
          <ResultRow label="Expires" value={result.expiryDate!} colors={colors} />
          {result.replacementSent && (
            <ResultRow
              label="Replacement"
              value="Dispatched"
              colors={colors}
              valueColor="#60a5fa"
            />
          )}
        </>
      )}

      {result.status === "not_found" && (
        <>
          <View style={[styles.resultDivider, { backgroundColor: colors.darkMuted }]} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
            No order found with this number. Check the confirmation email you received after purchase.
          </Text>
        </>
      )}

      {result.status === "active" && (
        <>
          <View style={[styles.resultDivider, { backgroundColor: colors.darkMuted }]} />
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={({ pressed }) => [styles.claimBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.claimBtnText, { color: colors.primaryForeground }]}>
              Claim replacement
            </Text>
            <Feather name="arrow-right" size={14} color={colors.primaryForeground} />
          </Pressable>
        </>
      )}

      <Pressable onPress={onReset} style={({ pressed }) => [styles.resetBtn, { opacity: pressed ? 0.7 : 1 }]}>
        <Text style={[styles.resetText, { color: colors.mutedForeground }]}>
          Check another order
        </Text>
      </Pressable>
    </View>
  );
}

function ResultRow({
  label,
  value,
  colors,
  valueColor,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  valueColor?: string;
}) {
  return (
    <View style={styles.resultRow}>
      <Text style={[styles.resultRowLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.resultRowValue, { color: valueColor ?? colors.secondary }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 4,
  },
  sectionIndex: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    marginBottom: 2,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    gap: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  infoStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  stepText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  inputSection: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputRow: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
  },
  inputHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  checkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: 4,
  },
  checkBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  resultCard: {
    marginHorizontal: 20,
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resultHeaderText: {
    gap: 2,
  },
  resultStatus: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  resultOrderNum: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  resultDivider: {
    height: 1,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultRowLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  resultRowValue: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  notFoundText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  claimBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 4,
  },
  claimBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  resetText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
