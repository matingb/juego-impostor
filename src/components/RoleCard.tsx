import React from "react";
import { Text, View } from "react-native";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { COLOR } from "../theme";
import { Ionicons } from "@expo/vector-icons";

const CITIZEN_COLORS = {
  primary: "#008A63",
  cardBg: "#175049",
  panelBg: "#185B50",
  accent: "#FDC800",
  keywordBg: "#4B764A",
} as const;

const IMPOSTOR_COLORS = {
  primary: "#FA2C37",
  cardBg: "#4D2835",
  panelBg: "#5E2731",
  accent: "#FDC800",
} as const;

export function RoleCard({
  roleIsImpostor,
  playerName,
  keyword,
  onNext,
}: {
  roleIsImpostor: boolean;
  playerName: string;
  keyword: string;
  onNext: () => void;
}) {
  const colors = roleIsImpostor ? IMPOSTOR_COLORS : CITIZEN_COLORS;
  const roleTitle = roleIsImpostor ? "IMPOSTOR" : "CIUDADANO";
  const titleColor = roleIsImpostor ? colors.primary : COLOR.SUCCESS;

  const roleIcon = roleIsImpostor ? (
    <Icon name="detective" size={50} tintColor={colors.primary} />
  ) : (
    <Ionicons name="search" size={50} color={colors.primary} />
  );

  const panelChildren = roleIsImpostor ? (
    <Text style={style.subtleText}>
      No conoces la palabra clave. ¡Trata de descubrirla!
    </Text>
  ) : (
    <>
      <Text style={style.keywordLabel}>Palabra clave:</Text>
      <View
        style={[
          style.keywordContainerBase,
          { borderColor: CITIZEN_COLORS.accent, backgroundColor: CITIZEN_COLORS.keywordBg },
        ]}
      >
        <Text style={style.keywordText}>{keyword}</Text>
      </View>
      <Text style={style.subtleText}>¡Describe esta palabra sin mencionarla directamente!</Text>
    </>
  );

  return (
    <Card
      style={{
        ...style.card,
        borderColor: colors.primary,
        backgroundColor: colors.cardBg,
      }}
    >
      <View style={style.container}>
        <Text style={style.playerName}>{playerName}</Text>

        <View style={style.centered}>
          <View
            style={[
              style.iconContainerBase,
              { borderColor: colors.primary, backgroundColor: colors.panelBg },
            ]}
          >
            {roleIcon}
          </View>
          <Text style={[style.titleBase, { color: titleColor }]}>{roleTitle}</Text>
          <View
            style={[
              style.outerContainerBase,
              { borderColor: colors.primary, backgroundColor: colors.panelBg },
            ]}
          >
            {panelChildren}
          </View>
        </View>

        <PrimaryButton label="Siguiente" onPress={onNext} leftIcon="eye" />
      </View>
    </Card>
  );
}

const style = {
  card: { borderWidth: 2, flex: 1, padding: 32 },
  container: { alignItems: "center", paddingVertical: 16, gap: 16, flex: 1 },
  centered: { alignItems: "center", justifyContent: "center", gap: 16 },
  playerName: { color: COLOR.WHITE, fontSize: 24, fontWeight: "600" },
  titleBase: { fontWeight: "800", fontSize: 30 },
  keywordLabel: {
    color: COLOR.TEXT_SUBTLE,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  keywordText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fdc800",
    textAlign: "center",
  },
  subtleText: { color: COLOR.TEXT_SUBTLE, fontSize: 14, textAlign: "center" },
  outerContainerBase: {
    gap: 8,
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  keywordContainerBase: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    width: "100%",
  },
  iconContainerBase: {
    padding: 12,
    borderRadius: 100,
    borderWidth: 1,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
} as const;
