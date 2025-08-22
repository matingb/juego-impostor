import React from "react"
import { Platform, Text, TextInput, View, ViewStyle, TextStyle } from "react-native"
import { Card } from "./Card"
import { PrimaryButton } from "./PrimaryButton"
import { SecondaryButton } from "./SecondaryButton"
import { Icon } from "./Icon"
import { Ionicons } from "@expo/vector-icons"
import { colors, COLOR } from "../theme"

type RNStyle = ViewStyle | TextStyle

export function SetupCards({
  totalPlayersText,
  onPlayersTextChange,
  onPlayersBlur,
  totalImpostorsText,
  onImpostorsTextChange,
  onImpostorsBlur,
  uiPlayersCount,
  playerNames,
  onPlayerNameChange,
  wordListText,
  onWordListChange,
  availableWordsCount,
  totalImpostors,
  onResetConfiguration,
  onStartGame,
  inputStyle,
  labelStyle,
  playerNamesTitle,
  listaTitleStyle,
}: {
  totalPlayersText: string
  onPlayersTextChange: (text: string) => void
  onPlayersBlur: () => void
  totalImpostorsText: string
  onImpostorsTextChange: (text: string) => void
  onImpostorsBlur: () => void
  uiPlayersCount: number
  playerNames: string[]
  onPlayerNameChange: (index: number, text: string) => void
  wordListText: string
  onWordListChange: (text: string) => void
  availableWordsCount: number
  totalImpostors: number
  onResetConfiguration: () => void
  onStartGame: () => void
  inputStyle: RNStyle
  labelStyle: RNStyle
  playerNamesTitle: RNStyle
  listaTitleStyle: RNStyle
}) {
  return (
    <>
      <Card>
        <View style={style.headerRow}>
          <Ionicons name="settings-outline" size={24} color="#FFF" />
          <Text style={style.headerTitle}>Configuración</Text>
        </View>

        <View style={style.twoColsRow}>
          <View style={style.columnSpacingRight}>
            <Text style={labelStyle as TextStyle}>Cantidad de jugadores</Text>
            <TextInput
              style={inputStyle as ViewStyle}
              keyboardType={Platform.select({ ios: "number-pad", android: "numeric", default: "numeric" })}
              value={totalPlayersText}
              onChangeText={onPlayersTextChange}
              onBlur={onPlayersBlur}
            />
          </View>
          <View style={style.columnSpacingLeft}>
            <Text style={labelStyle as TextStyle}>Cantidad de impostores</Text>
            <TextInput
              style={inputStyle as ViewStyle}
              keyboardType={Platform.select({ ios: "number-pad", android: "numeric", default: "numeric" })}
              value={totalImpostorsText}
              onChangeText={onImpostorsTextChange}
              onBlur={onImpostorsBlur}
            />
          </View>
        </View>

        <View style={style.blockSpacing}>
          <Text style={playerNamesTitle as TextStyle}>Nombres de jugadores</Text>
          {Array.from({ length: uiPlayersCount }).map((_, i) => (
            <View key={i} style={style.playerRow}>
              <Text style={labelStyle as TextStyle}>Jugador {i + 1}</Text>
              <TextInput
                style={inputStyle as ViewStyle}
                value={playerNames[i] || ""}
                onChangeText={(t) => onPlayerNameChange(i, t)}
              />
            </View>
          ))}
        </View>

        <View style={style.blockSpacing}>
          <View style={style.listHeaderRow}>
            <Text style={listaTitleStyle as TextStyle}>Lista de palabras clave (una por línea)</Text>
            <View style={style.chip}>
              <Text style={style.chipText}>{availableWordsCount} palabras disponibles</Text>
            </View>
          </View>
          <TextInput
            style={[inputStyle as ViewStyle, style.wordListInput]}
            multiline
            value={wordListText}
            onChangeText={onWordListChange}
          />
        </View>
      </Card>

      <View style={style.actionsRow}>
        <SecondaryButton label="Reiniciar configuración" onPress={onResetConfiguration} leftIcon="refresh" />
        <View style={{ width: 12 }} />
        <PrimaryButton label="Comenzar Juego" onPress={onStartGame} leftIcon="play" />
      </View>

      <Card style={{ flex: 1, width: "100%" }}>
        <View style={style.featuresRow}>
          <View style={style.featureItem}>
            <Icon name="users" tintColor={COLOR.SUCCESS} />
            <Text style={style.featureText}>{uiPlayersCount} jugadores</Text>
          </View>
          <View style={style.featureItem}>
            <Icon name="alert" tintColor={COLOR.DANGER} />
            <Text style={style.featureText}>
              {totalImpostors} {totalImpostors === 1 ? "impostor" : "impostores"}
            </Text>
          </View>
          <View style={style.featureItem}>
            <Icon name="flash" tintColor={COLOR.ACCENT} />
            <Text style={style.featureText}>{availableWordsCount} palabras</Text>
          </View>
        </View>
      </Card>
    </>
  )
}

export const style = {
  headerRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    lineHeight: 36,
  },
  twoColsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  columnSpacingRight: { flex: 1, marginRight: 8, marginBottom: 16 },
  columnSpacingLeft: { flex: 1, marginLeft: 8, marginBottom: 16 },
  blockSpacing: { marginBottom: 16 },
  playerRow: { marginBottom: 8 },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: "rgba(69,160,73,0.25)",
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  chipText: { color: "white", fontWeight: "600" },
  wordListInput: { minHeight: 120, textAlignVertical: "top" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    flex: 1,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: { color: "white", marginLeft: 6, fontWeight: "600" },
} as const


