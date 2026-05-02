import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";

type PaymentMethod = "upi" | "card" | "cod";

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  colors,
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  maxLength?: number;
  colors: ReturnType<typeof useColors>;
  hint?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[
          styles.fieldInput,
          { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType ?? "default"}
        maxLength={maxLength}
        returnKeyType="next"
      />
      {hint ? (
        <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

function PaymentTab({
  id,
  label,
  selected,
  onPress,
  colors,
}: {
  id: PaymentMethod;
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.payTab,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.payTabText,
          { color: selected ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, subtotal, gst, shipping, total, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Delivery
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment
  const [payMethod, setPayMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const validate = () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !deliveryState.trim() || !pincode.trim()) {
      Alert.alert("Missing details", "Please fill in all delivery fields.");
      return false;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      Alert.alert("Invalid phone", "Enter a valid 10-digit mobile number.");
      return false;
    }
    if (pincode.length !== 6) {
      Alert.alert("Invalid pincode", "Enter a valid 6-digit pincode.");
      return false;
    }
    if (payMethod === "upi") {
      if (!upiId.includes("@")) {
        Alert.alert("Invalid UPI ID", "Enter a valid UPI ID (e.g. name@upi).");
        return false;
      }
    } else if (payMethod === "card") {
      if (cardNum.replace(/\s/g, "").length !== 16) {
        Alert.alert("Invalid card", "Enter a valid 16-digit card number.");
        return false;
      }
      if (cardExpiry.length < 5) {
        Alert.alert("Invalid expiry", "Enter card expiry as MM/YY.");
        return false;
      }
      if (cardCvv.length < 3) {
        Alert.alert("Invalid CVV", "Enter a valid CVV.");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlacing(true);
    const orderNum = "FW-" + Math.floor(10000 + Math.random() * 90000);
    setTimeout(() => {
      setPlacing(false);
      clearCart();
      router.replace({
        pathname: "/confirmation",
        params: {
          orderNum,
          total: total.toString(),
          payMethod,
          name,
          itemCount: items.length.toString(),
        },
      });
    }, 1800);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: botPad + 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Delivery details
          </Text>
          <Field label="Full name" value={name} onChangeText={setName} placeholder="Sanjay Vishwakarma" colors={colors} />
          <Field label="Mobile number" value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" keyboardType="phone-pad" maxLength={10} colors={colors} />
          <Field label="Street address" value={address} onChangeText={setAddress} placeholder="Building, street, area" colors={colors} />
          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Field label="City" value={city} onChangeText={setCity} placeholder="Mumbai" colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="State" value={deliveryState} onChangeText={setDeliveryState} placeholder="Maharashtra" colors={colors} />
            </View>
          </View>
          <Field label="Pincode" value={pincode} onChangeText={(t) => setPincode(t.replace(/\D/g, "").slice(0, 6))} placeholder="400001" keyboardType="numeric" maxLength={6} colors={colors} />
        </View>

        {/* Payment section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Payment method
          </Text>
          <View style={styles.payTabs}>
            <PaymentTab id="upi" label="UPI" selected={payMethod === "upi"} onPress={() => { Haptics.selectionAsync(); setPayMethod("upi"); }} colors={colors} />
            <PaymentTab id="card" label="Card" selected={payMethod === "card"} onPress={() => { Haptics.selectionAsync(); setPayMethod("card"); }} colors={colors} />
            <PaymentTab id="cod" label="COD" selected={payMethod === "cod"} onPress={() => { Haptics.selectionAsync(); setPayMethod("cod"); }} colors={colors} />
          </View>

          {payMethod === "upi" && (
            <View style={styles.payForm}>
              <Field
                label="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                placeholder="name@upi"
                keyboardType="email-address"
                colors={colors}
                hint="e.g. sanjay@okaxis, 9876543210@upi"
              />
            </View>
          )}

          {payMethod === "card" && (
            <View style={styles.payForm}>
              <Field
                label="Card number"
                value={cardNum}
                onChangeText={(t) => setCardNum(formatCardNumber(t))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                colors={colors}
              />
              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Field label="Expiry" value={cardExpiry} onChangeText={(t) => setCardExpiry(formatExpiry(t))} placeholder="MM/YY" keyboardType="numeric" maxLength={5} colors={colors} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="CVV" value={cardCvv} onChangeText={(t) => setCardCvv(t.replace(/\D/g, "").slice(0, 4))} placeholder="123" keyboardType="numeric" maxLength={4} colors={colors} />
                </View>
              </View>
              <Field label="Name on card" value={cardName} onChangeText={setCardName} placeholder="As on card" colors={colors} />
            </View>
          )}

          {payMethod === "cod" && (
            <View style={[styles.codNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="info" size={14} color={colors.mutedForeground} />
              <Text style={[styles.codText, { color: colors.mutedForeground }]}>
                Pay in cash when your order is delivered. ₹49 COD fee applies on orders below ₹999.
              </Text>
            </View>
          )}
        </View>

        {/* Order summary */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Order summary
          </Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: colors.foreground }]}>
                {item.product.model} × {item.quantity}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.foreground }]}>
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
          <View style={[styles.sumDivider, { backgroundColor: colors.border }]} />
          <SumRow label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} colors={colors} />
          <SumRow label="GST (18%)" value={`₹${gst.toLocaleString("en-IN")}`} colors={colors} />
          <SumRow label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} colors={colors} green={shipping === 0} />
          <View style={[styles.sumDivider, { backgroundColor: colors.border }]} />
          <SumRow label="Total" value={`₹${total.toLocaleString("en-IN")}`} colors={colors} bold />
        </View>

        <Text style={[styles.gstNote, { color: colors.mutedForeground }]}>
          GST invoice will be emailed after order confirmation.
        </Text>
      </ScrollView>

      {/* Place order */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: botPad + 12,
          },
        ]}
      >
        <Pressable
          onPress={handlePlaceOrder}
          disabled={placing}
          style={[
            styles.placeBtn,
            { backgroundColor: placing ? colors.muted : colors.primary },
          ]}
        >
          <Text
            style={[
              styles.placeBtnText,
              { color: placing ? colors.mutedForeground : colors.primaryForeground },
            ]}
          >
            {placing ? "Placing order..." : `Place order · ₹${total.toLocaleString("en-IN")}`}
          </Text>
          {!placing && (
            <Feather name="check" size={16} color={colors.primaryForeground} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function SumRow({
  label,
  value,
  bold,
  green,
  colors,
}: {
  label: string;
  value: string;
  bold?: boolean;
  green?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sumRow}>
      <Text
        style={[
          styles.sumLabel,
          { color: bold ? colors.foreground : colors.mutedForeground },
          bold && { fontFamily: "Inter_600SemiBold" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.sumValue,
          { color: green ? colors.primary : bold ? colors.foreground : colors.mutedForeground },
          bold && { fontFamily: "Inter_700Bold", fontSize: 16 },
        ]}
      >
        {value}
      </Text>
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
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  scroll: { flex: 1 },
  section: { padding: 20, gap: 14 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  fieldWrap: { gap: 4 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.5, textTransform: "uppercase" },
  fieldInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  fieldHint: { fontSize: 11, fontFamily: "Inter_400Regular" },
  row2: { flexDirection: "row", gap: 12 },
  payTabs: { flexDirection: "row", gap: 8 },
  payTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
  },
  payTabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  payForm: { gap: 14 },
  codNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  codText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryPrice: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sumDivider: { height: 1 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sumLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  sumValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  gstNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  placeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 4,
  },
  placeBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
