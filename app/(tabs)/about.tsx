import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const TECH = [
  {
    name: "FastShield™",
    tagline: "Smart IC Protection",
    desc: "Overcurrent, overvoltage, and temperature protection built into every cable. Prevents device damage — a trust signal no Indian cable brand names.",
    icon: "shield" as const,
  },
  {
    name: "TrueWatt Certified™",
    tagline: "Verified Performance",
    desc: "Actual lab-tested wattage and data speed published for every SKU. No 'up to' lies. India's first cable brand to publish oscilloscope readings for every batch.",
    icon: "activity" as const,
  },
  {
    name: "FlexArmor™",
    tagline: "10,000+ Bend Cycles",
    desc: "Reinforced stress-point construction with braided nylon build. Directly attacks the biggest weakness of budget cables — fraying at the joints.",
    icon: "zap" as const,
  },
  {
    name: "SmartScan™",
    tagline: "One QR · Four Functions",
    desc: "Scan the QR on your cable for: (1) product authentication, (2) instant warranty registration, (3) live tested performance data, (4) one-tap WhatsApp replacement claim.",
    icon: "maximize" as const,
  },
];

const VERIFIED_DATA = [
  { model: "FW·001", tested: "238W", speed: "10 Gbps", cycles: "12,400+" },
  { model: "FW·002", tested: "64W", speed: "10 Gbps", cycles: "11,800+" },
  { model: "FW·003", tested: "39W", speed: "480 Mbps", cycles: "10,600+" },
  { model: "FW·004", tested: "20W", speed: "480 Mbps", cycles: "10,200+" },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

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
        <Text style={[styles.sectionIndex, { color: colors.mutedForeground }]}>06</Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Brand</Text>
      </View>

      {/* Brand hero */}
      <View style={[styles.brandHero, { backgroundColor: colors.dark }]}>
        <Text style={[styles.brandWordmark, { color: colors.secondary }]}>
          FASTWARE
        </Text>
        <View style={[styles.brandBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.brandBadgeText, { color: colors.primaryForeground }]}>
            India's First Verified Charging Brand
          </Text>
        </View>
        <Text style={[styles.brandTagline, { color: colors.mutedForeground }]}>
          Reliable charging you can trust.
        </Text>
        <View style={[styles.brandDivider, { backgroundColor: colors.darkMuted }]} />
        <View style={styles.brandMeta}>
          <Text style={[styles.brandMetaLine, { color: colors.mutedForeground }]}>
            CIN: U62012MH2026PTC469018
          </Text>
          <Text style={[styles.brandMetaLine, { color: colors.mutedForeground }]}>
            IEC: AAGCF9121J
          </Text>
          <Text style={[styles.brandMetaLine, { color: colors.mutedForeground }]}>
            Mumbai, India · April 2026
          </Text>
        </View>
      </View>

      {/* Technology section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex2, { color: colors.mutedForeground }]}>01</Text>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          — TECHNOLOGY STACK
        </Text>
      </View>

      <View style={styles.techList}>
        {TECH.map((t, i) => (
          <View
            key={t.name}
            style={[
              styles.techCard,
              { backgroundColor: colors.dark },
            ]}
          >
            <View style={styles.techCardHeader}>
              <View style={[styles.techIconWrap, { backgroundColor: colors.primary }]}>
                <Feather name={t.icon} size={16} color={colors.primaryForeground} />
              </View>
              <View style={styles.techCardTitles}>
                <Text style={[styles.techName, { color: colors.secondary }]}>
                  {t.name}
                </Text>
                <Text style={[styles.techTagline, { color: colors.primary }]}>
                  {t.tagline}
                </Text>
              </View>
            </View>
            <Text style={[styles.techDesc, { color: colors.mutedForeground }]}>
              {t.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Fastware Verified™ data */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex2, { color: colors.mutedForeground }]}>02</Text>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          — FASTWARE VERIFIED™
        </Text>
      </View>

      <View
        style={[
          styles.verifiedCard,
          { backgroundColor: colors.dark },
        ]}
      >
        <Text style={[styles.verifiedNote, { color: colors.mutedForeground }]}>
          Actual lab-tested results. Every batch. No marketing numbers.
        </Text>
        <View style={[styles.tableHeader, { borderBottomColor: colors.darkMuted }]}>
          <Text style={[styles.tableHeadCell, styles.tableColModel, { color: colors.mutedForeground }]}>
            MODEL
          </Text>
          <Text style={[styles.tableHeadCell, styles.tableColNum, { color: colors.mutedForeground }]}>
            TESTED W
          </Text>
          <Text style={[styles.tableHeadCell, styles.tableColNum, { color: colors.mutedForeground }]}>
            DATA
          </Text>
          <Text style={[styles.tableHeadCell, styles.tableColNum, { color: colors.mutedForeground }]}>
            BENDS
          </Text>
        </View>
        {VERIFIED_DATA.map((row, i) => (
          <View
            key={row.model}
            style={[
              styles.tableRow,
              i < VERIFIED_DATA.length - 1 && { borderBottomColor: colors.darkMuted, borderBottomWidth: 1 },
            ]}
          >
            <Text style={[styles.tableCell, styles.tableColModel, { color: colors.secondary, fontFamily: "Inter_700Bold" }]}>
              {row.model}
            </Text>
            <Text style={[styles.tableCell, styles.tableColNum, { color: colors.primary }]}>
              {row.tested}
            </Text>
            <Text style={[styles.tableCell, styles.tableColNum, { color: colors.foreground }]}>
              {row.speed}
            </Text>
            <Text style={[styles.tableCell, styles.tableColNum, { color: colors.foreground }]}>
              {row.cycles}
            </Text>
          </View>
        ))}
      </View>

      {/* Certifications */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex2, { color: colors.mutedForeground }]}>03</Text>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          — CERTIFICATIONS
        </Text>
      </View>

      <View style={[styles.certsGrid, { borderColor: colors.border }]}>
        {[
          { label: "BIS Certified", sub: "IS 15885 / R-41", icon: "check-square" as const },
          { label: "24-Month Warranty", sub: "Order number alone", icon: "shield" as const },
          { label: "GST Invoice", sub: "All orders", icon: "file-text" as const },
          { label: "TrueWatt Certified™", sub: "Lab-verified data", icon: "activity" as const },
        ].map((c, i) => (
          <View
            key={c.label}
            style={[
              styles.certItem,
              { borderColor: colors.border },
              i % 2 === 0 && { borderRightWidth: 1 },
              i < 2 && { borderBottomWidth: 1 },
            ]}
          >
            <Feather name={c.icon} size={18} color={colors.primary} />
            <Text style={[styles.certLabel, { color: colors.foreground }]}>
              {c.label}
            </Text>
            <Text style={[styles.certSub, { color: colors.mutedForeground }]}>
              {c.sub}
            </Text>
          </View>
        ))}
      </View>

      {/* 48hr replacement note */}
      <View
        style={[
          styles.replacementNote,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.replacementDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.replacementText, { color: colors.foreground }]}>
          48-hour no-questions-asked replacement via WhatsApp — India's first cable brand to offer this. No RMA forms. No 14-day wait.
        </Text>
      </View>

      {/* Founders */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionIndex2, { color: colors.mutedForeground }]}>04</Text>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          — FOUNDERS
        </Text>
      </View>

      <View style={[styles.foundersCard, { backgroundColor: colors.dark }]}>
        {[
          { name: "Sanjay", role: "Co-founder & CEO" },
          { name: "Krishna Gupta", role: "Co-founder & CTO" },
        ].map((f, i) => (
          <React.Fragment key={f.name}>
            {i > 0 && <View style={[styles.founderDivider, { backgroundColor: colors.darkMuted }]} />}
            <View style={styles.founderRow}>
              <View style={[styles.founderAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.founderInitial, { color: colors.primaryForeground }]}>
                  {f.name[0]}
                </Text>
              </View>
              <View>
                <Text style={[styles.founderName, { color: colors.secondary }]}>
                  {f.name}
                </Text>
                <Text style={[styles.founderRole, { color: colors.mutedForeground }]}>
                  {f.role}
                </Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Shop CTA */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/(tabs)/shop");
        }}
        style={({ pressed }) => [
          styles.shopCta,
          { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={[styles.shopCtaText, { color: colors.primaryForeground }]}>
          Shop cables
        </Text>
        <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
      </Pressable>

      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        fastware.in · Mumbai, India · April 2026
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
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
  brandHero: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 4,
    padding: 20,
    gap: 8,
  },
  brandWordmark: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  brandBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  brandBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  brandTagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  brandDivider: {
    height: 1,
    marginVertical: 8,
  },
  brandMeta: {
    gap: 3,
  },
  brandMetaLine: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionIndex2: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  techList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 32,
  },
  techCard: {
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  techCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  techIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  techCardTitles: {
    gap: 2,
  },
  techName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  techTagline: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  techDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  verifiedCard: {
    marginHorizontal: 20,
    borderRadius: 4,
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  verifiedNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  tableHeadCell: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  tableCell: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  tableColModel: {
    flex: 2,
  },
  tableColNum: {
    flex: 2,
  },
  certsGrid: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    marginBottom: 16,
  },
  certItem: {
    width: "50%",
    padding: 16,
    gap: 6,
  },
  certLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  certSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  replacementNote: {
    marginHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 32,
  },
  replacementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
  },
  replacementText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  foundersCard: {
    marginHorizontal: 20,
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    gap: 0,
  },
  founderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  founderDivider: {
    height: 1,
  },
  founderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  founderInitial: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  founderName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  founderRole: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  shopCta: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 4,
    marginBottom: 20,
  },
  shopCtaText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
});
