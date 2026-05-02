import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
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

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { useColors } from "@/hooks/useColors";

function ProductCard({
  product,
  colors,
}: {
  product: Product;
  colors: ReturnType<typeof useColors>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const { addToCart } = useCart();

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const handleView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${product.id}`);
  };

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleView}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.dark,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Card header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardModel, { color: colors.secondary }]}>
              {product.model}
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              {product.subtitle}
            </Text>
          </View>
          {product.inStock ? (
            <View style={[styles.stockBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stockText, { color: colors.primaryForeground }]}>
                In stock
              </Text>
            </View>
          ) : (
            <View style={[styles.stockBadge, { backgroundColor: colors.darkMuted }]}>
              <Text style={[styles.stockText, { color: colors.mutedForeground }]}>
                Sold out
              </Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.darkMuted }]} />

        {/* Specs row */}
        <View style={styles.specsRow}>
          <SpecChip label={`${product.power} W`} colors={colors} />
          <SpecChip label={product.length} colors={colors} />
          <SpecChip label={product.connectorFrom} colors={colors} />
          <SpecChip label={product.connectorTo} colors={colors} />
        </View>

        {/* Wear indicator note */}
        <View style={styles.featureRow}>
          <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.featureText, { color: colors.mutedForeground }]}>
            {product.feature}
          </Text>
        </View>

        {/* Price + actions */}
        <View style={styles.cardFooter}>
          <Text style={[styles.price, { color: colors.primaryForeground }]}>
            ₹{product.price.toLocaleString("en-IN")}
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={handleAdd}
              style={[styles.addBtn, { borderColor: colors.primary }]}
            >
              <Feather name="shopping-bag" size={14} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={handleView}
              style={[styles.viewBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.viewBtnText, { color: colors.primaryForeground }]}>
                View
              </Text>
              <Feather name="arrow-right" size={13} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function SpecChip({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.specChip, { backgroundColor: colors.darkMuted }]}>
      <Text style={[styles.specChipText, { color: colors.secondary }]}>{label}</Text>
    </View>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { totalCount } = useCart();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>03</Text>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>Cables</Text>
        </View>
        <Pressable
          onPress={() => router.push("/cart")}
          style={[styles.cartBadge, { backgroundColor: totalCount > 0 ? colors.primary : colors.card, borderColor: colors.border, borderWidth: totalCount > 0 ? 0 : 1 }]}
        >
          <Feather name="shopping-bag" size={14} color={totalCount > 0 ? colors.primaryForeground : colors.mutedForeground} />
          {totalCount > 0 && (
            <Text style={[styles.cartCount, { color: colors.primaryForeground }]}>
              {totalCount}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Product list */}
      <View style={styles.list}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} colors={colors} />
        ))}
      </View>

      {/* Footnote */}
      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        All prices inclusive of GST. 24-month replacement on order number alone.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  cartBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cartCount: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardModel: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  stockText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
  },
  specsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  specChipText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 4,
  },
  viewBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  footnote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 24,
    marginHorizontal: 20,
    lineHeight: 16,
  },
});
