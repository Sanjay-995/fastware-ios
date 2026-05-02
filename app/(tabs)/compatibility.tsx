import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { devices, products } from "@/data/products";
import type { Device } from "@/data/products";
import { useColors } from "@/hooks/useColors";

const CATEGORY_ORDER: Device["category"][] = ["laptop", "phone", "tablet", "other"];
const CATEGORY_LABELS: Record<Device["category"], string> = {
  laptop: "Laptops",
  phone: "Phones",
  tablet: "Tablets",
  other: "Other",
};

export default function CompatibilityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Device | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = devices.filter((d) =>
    `${d.name} ${d.brand}`.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = CATEGORY_ORDER.reduce<Record<string, Device[]>>(
    (acc, cat) => {
      const items = filtered.filter((d) => d.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    },
    {}
  );

  // Exclude combo bundles from compatibility results (no single connector)
  const compatible = selected
    ? products.filter(
        (p) => !p.isCombo && p.compatibleWith.includes(selected.id)
      )
    : [];

  const handleSelect = (device: Device) => {
    Haptics.selectionAsync();
    setSelected(device);
  };

  const handleBack = () => {
    setSelected(null);
    setQuery("");
  };

  // ── Selected device results view ──────────────────────────────────────────
  if (selected) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header with back */}
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.deviceBrand, { color: colors.mutedForeground }]}>
              {selected.brand}
            </Text>
            <Text style={[styles.deviceName, { color: colors.foreground }]}>
              {selected.name}
            </Text>
          </View>
        </View>

        {/* Device spec card */}
        <View
          style={[
            styles.deviceSpec,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <SpecPair
            label="Connector"
            value={selected.usbType.toUpperCase()}
            colors={colors}
          />
          <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
          <SpecPair
            label="Max power"
            value={`${selected.maxPower} W`}
            colors={colors}
          />
        </View>

        {/* Results label */}
        <Text style={[styles.resultsLabel, { color: colors.mutedForeground }]}>
          Compatible cables
        </Text>

        {/* Empty state — plain view so it centres vertically */}
        {compatible.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather
              name="alert-circle"
              size={32}
              color={colors.mutedForeground}
            />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No compatible cables found
            </Text>
          </View>
        ) : (
          /*
           * ScrollView here (not a plain View) so all compatible cables are
           * reachable regardless of how many there are. Previously a plain View
           * caused overflow and cut off results below the fold.
           */
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: botPad + 80,
              gap: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            {compatible.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/product/${p.id}`);
                }}
                style={({ pressed }) => [
                  styles.resultCard,
                  {
                    backgroundColor: colors.dark,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={styles.resultLeft}>
                  <Text style={[styles.resultModel, { color: colors.secondary }]}>
                    {p.model}
                  </Text>
                  <Text style={[styles.resultSub, { color: colors.mutedForeground }]}>
                    {p.powerLabel} · {p.length}
                  </Text>
                </View>
                <View style={styles.resultRight}>
                  <Text
                    style={[styles.resultPrice, { color: colors.primaryForeground }]}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </Text>
                  <Feather name="arrow-right" size={16} color={colors.primary} />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  // ── Device search / list view ─────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>
            04
          </Text>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            Compatibility
          </Text>
        </View>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search device..."
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            style={({ pressed }) => [
              styles.clearBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Device list */}
      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([cat]) => cat}
        contentContainerStyle={{
          paddingBottom: botPad + 80,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: [cat, devs] }) => (
          <View style={styles.categorySection}>
            <Text
              style={[styles.categoryLabel, { color: colors.mutedForeground }]}
            >
              {CATEGORY_LABELS[cat as Device["category"]]}
            </Text>
            {devs.map((device, i) => (
              <Pressable
                key={device.id}
                onPress={() => handleSelect(device)}
                style={({ pressed }) => [
                  styles.deviceRow,
                  { borderColor: colors.border },
                  i === devs.length - 1 && { borderBottomWidth: 0 },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View>
                  <Text
                    style={[styles.deviceRowName, { color: colors.foreground }]}
                  >
                    {device.name}
                  </Text>
                  <Text
                    style={[
                      styles.deviceRowBrand,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {device.brand} · {device.usbType.toUpperCase()} ·{" "}
                    {device.maxPower} W
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.mutedForeground}
                />
              </Pressable>
            ))}
          </View>
        )}
      />
    </View>
  );
}

function SpecPair({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.specPair}>
      <Text style={[styles.specPairLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.specPairValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  deviceBrand: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  deviceName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
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
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 4,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  clearBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  deviceRowName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  deviceRowBrand: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  deviceSpec: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
  specPair: {
    flex: 1,
    padding: 14,
  },
  specDivider: {
    width: 1,
  },
  specPairLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  specPairValue: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  resultsLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 4,
  },
  resultLeft: {
    gap: 4,
    flex: 1,
    marginRight: 12,
  },
  resultModel: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  resultSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  resultRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultPrice: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
