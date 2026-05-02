import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";

function CartRow({
  item,
  colors,
}: {
  item: CartItem;
  colors: ReturnType<typeof useColors>;
}) {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.rowThumb, { backgroundColor: colors.dark }]}>
        <Text style={[styles.rowThumbText, { color: colors.primary }]}>
          {product.power}W
        </Text>
      </View>

      <View style={styles.rowInfo}>
        <Text style={[styles.rowModel, { color: colors.foreground }]}>
          {product.model}
        </Text>
        <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
          {product.subtitle} · {product.length}
        </Text>
        <Text style={[styles.rowPrice, { color: colors.primary }]}>
          ₹{(product.price * quantity).toLocaleString("en-IN")}
        </Text>
      </View>

      <View style={styles.rowQty}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            decrementQuantity(product.id);
          }}
          style={({ pressed }) => [
            styles.qtyBtn,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Feather name="minus" size={14} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.qtyNum, { color: colors.foreground }]}>
          {quantity}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            incrementQuantity(product.id);
          }}
          style={({ pressed }) => [
            styles.qtyBtn,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Feather name="plus" size={14} color={colors.foreground} />
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          removeFromCart(product.id);
        }}
        style={({ pressed }) => [styles.removeBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <Feather name="x" size={16} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

function PriceRow({
  label,
  value,
  bold,
  colors,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.priceRow}>
      <Text
        style={[
          styles.priceLabel,
          { color: bold ? colors.foreground : colors.mutedForeground },
          bold && { fontFamily: "Inter_600SemiBold" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.priceValue,
          {
            color: accent ? colors.primary : bold ? colors.foreground : colors.mutedForeground,
          },
          bold && { fontFamily: "Inter_700Bold", fontSize: 18 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, subtotal, gst, shipping, total, totalCount } = useCart();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const isEmpty = items.length === 0;

  const SummaryFooter = () => (
    <View
      style={[
        styles.summary,
        { borderTopColor: colors.border, paddingBottom: botPad + 108 },
      ]}
    >
      <PriceRow
        label="Subtotal"
        value={`₹${subtotal.toLocaleString("en-IN")}`}
        colors={colors}
      />
      <PriceRow
        label="GST (18%)"
        value={`₹${gst.toLocaleString("en-IN")}`}
        colors={colors}
      />
      <PriceRow
        label="Shipping"
        value={shipping === 0 ? "Free" : `₹${shipping}`}
        accent={shipping === 0}
        colors={colors}
      />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <PriceRow
        label="Total"
        value={`₹${total.toLocaleString("en-IN")}`}
        bold
        colors={colors}
      />
      {shipping === 0 && (
        <Text style={[styles.freeShip, { color: colors.primary }]}>
          Free shipping applied
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Cart {totalCount > 0 && `(${totalCount})`}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Add some cables to get started
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/shop")}
            style={({ pressed }) => [
              styles.shopBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.shopBtnText, { color: colors.primaryForeground }]}>
              Shop cables
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/*
           * FlatList with summary in ListFooterComponent so all content scrolls
           * together — this prevents the summary from being hidden behind the
           * absolute checkout bar when the item list is short.
           */}
          <FlatList
            data={items}
            keyExtractor={(i) => i.product.id}
            renderItem={({ item }) => <CartRow item={item} colors={colors} />}
            ListFooterComponent={<SummaryFooter />}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout button — floats above content via absolute position */}
          <View
            style={[
              styles.checkoutBar,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                paddingBottom: botPad + 12,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/checkout");
              }}
              style={({ pressed }) => [
                styles.checkoutBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.checkoutBtnText, { color: colors.primaryForeground }]}>
                Proceed to checkout
              </Text>
              <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  shopBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    minHeight: 48,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  shopBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  rowThumb: {
    width: 56,
    height: 56,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  rowThumbText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowModel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  rowSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  rowPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  rowQty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    minWidth: 24,
    textAlign: "center",
  },
  removeBtn: {
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  priceValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  freeShip: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 4,
  },
  checkoutBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
