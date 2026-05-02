import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
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

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { useColors } from "@/hooks/useColors";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const scaleAdd = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background, paddingTop: topPad + 16 },
        ]}
      >
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>
          Product not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product);
    setAdded(true);
    Animated.sequence([
      Animated.spring(scaleAdd, { toValue: 0.94, useNativeDriver: true }),
      Animated.spring(scaleAdd, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: botPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.topBarWordmark, { color: colors.mutedForeground }]}>
            FASTWARE
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Hero image */}
        <View style={[styles.heroContainer, { backgroundColor: colors.dark }]}>
          <Image
            source={require("../../assets/images/cable-hero.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>
                {product.power} W
              </Text>
            </View>
          </View>
        </View>

        {/* Product info */}
        <View style={styles.info}>
          <View style={styles.infoHeader}>
            <View>
              <Text style={[styles.modelText, { color: colors.foreground }]}>
                {product.model}
              </Text>
              <Text style={[styles.subtitleText, { color: colors.mutedForeground }]}>
                {product.subtitle}
              </Text>
            </View>
            <Text style={[styles.priceText, { color: colors.primary }]}>
              ₹{product.price.toLocaleString("en-IN")}
            </Text>
          </View>

          <Text style={[styles.descText, { color: colors.foreground }]}>
            {product.description}
          </Text>

          {/* Specs grid */}
          <View style={[styles.specsGrid, { borderColor: colors.border }]}>
            <SpecCell label="Power" value={`${product.power} W`} colors={colors} right />
            <SpecCell label="Length" value={product.length} colors={colors} />
            <SpecCell label="From" value={product.connectorFrom} colors={colors} right bottom={false} />
            <SpecCell label="To" value={product.connectorTo} colors={colors} bottom={false} />
          </View>

          {/* Wear indicator */}
          <View style={[styles.wearCard, { backgroundColor: colors.dark }]}>
            <View style={styles.wearCardHeader}>
              <View style={[styles.wearDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.wearCardTitle, { color: colors.secondary }]}>
                Wear-indicator thread
              </Text>
            </View>
            <Image
              source={require("../../assets/images/wear-indicator.png")}
              style={styles.wearCardImage}
              resizeMode="cover"
            />
            <Text style={[styles.wearCardDesc, { color: colors.mutedForeground }]}>
              A thread woven into the braid changes appearance as the cable wears. You see it before your phone does. No app required.
            </Text>
          </View>

          {/* Warranty note */}
          <View style={[styles.warrantyNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.warrantyNoteText, { color: colors.foreground }]}>
              24-month replacement on order number alone. No registration required.
            </Text>
          </View>

          {/* Cart quantity indicator */}
          {cartItem && (
            <View style={[styles.cartIndicator, { backgroundColor: colors.dark }]}>
              <Feather name="shopping-bag" size={14} color={colors.mutedForeground} />
              <Text style={[styles.cartIndicatorText, { color: colors.mutedForeground }]}>
                {cartItem.quantity} in cart
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: botPad + 12,
          },
        ]}
      >
        <View style={styles.bottomMeta}>
          <Text style={[styles.bottomModel, { color: colors.foreground }]}>
            {product.model}
          </Text>
          <Text style={[styles.bottomPrice, { color: colors.primary }]}>
            ₹{product.price.toLocaleString("en-IN")}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ scale: scaleAdd }] }}>
          <Pressable
            onPress={handleAdd}
            style={[
              styles.addBtn,
              {
                backgroundColor: added ? colors.muted : colors.primary,
              },
            ]}
          >
            <Feather
              name={added ? "check" : "shopping-bag"}
              size={16}
              color={added ? colors.mutedForeground : colors.primaryForeground}
            />
            <Text
              style={[
                styles.addBtnText,
                {
                  color: added ? colors.mutedForeground : colors.primaryForeground,
                },
              ]}
            >
              {added ? "Added to cart" : "Add to cart"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function SpecCell({
  label,
  value,
  colors,
  right = false,
  bottom = true,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  right?: boolean;
  bottom?: boolean;
}) {
  return (
    <View
      style={[
        styles.specCell,
        { borderColor: colors.border },
        right && { borderRightWidth: 1 },
        bottom && { borderBottomWidth: 1 },
      ]}
    >
      <Text style={[styles.specCellLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.specCellValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  backLink: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarWordmark: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
  },
  heroContainer: {
    height: 240,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  heroBadgeText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  info: {
    padding: 20,
    gap: 20,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modelText: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  priceText: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  descText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  specsGrid: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  specCell: {
    width: "50%",
    padding: 14,
    gap: 4,
  },
  specCellLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  specCellValue: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  wearCard: {
    borderRadius: 4,
    overflow: "hidden",
    gap: 12,
    padding: 16,
  },
  wearCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  wearDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  wearCardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  wearCardImage: {
    width: "100%",
    height: 140,
    borderRadius: 2,
  },
  wearCardDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  warrantyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  warrantyNoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cartIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  cartIndicatorText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  bottomMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomModel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  bottomPrice: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
