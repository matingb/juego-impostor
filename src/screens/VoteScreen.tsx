import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Card } from "../components/Card"
import { PrimaryButton } from "../components/PrimaryButton"
import { Icon } from "../components/Icon"

export type VoteScreenProps = {
  playerNames: string[]
  alivePlayers: boolean[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onConfirm: () => void
}

export const VoteScreen = React.memo(function VoteScreen(props: VoteScreenProps) {
  const { playerNames, alivePlayers, selectedIndex, onSelect, onConfirm } = props
  return (
    <Card>
      <View style={{ alignItems: "center", paddingVertical: 16 }}>
        <Icon name="vote" size={48} tintColor="#fff" />
        <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 8 }}>Ronda de eliminación</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 12, textAlign: "center" }}>
          Primero selecciona un jugador, luego confirma para eliminar
        </Text>

        <View style={{ width: "100%", marginTop: 8 }}>
          {playerNames.map((name, index) => {
            const isAlive = alivePlayers[index]
            const isSelected = selectedIndex === index
            return (
              <TouchableOpacity
                key={index}
                onPress={() => isAlive && onSelect(index)}
                disabled={!isAlive}
                activeOpacity={0.85}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: !isAlive ? "rgba(255,255,255,0.12)" : isSelected ? "#ffd700" : "rgba(255,255,255,0.2)",
                  backgroundColor: !isAlive
                    ? "rgba(255,255,255,0.04)"
                    : isSelected
                      ? "rgba(255, 215, 0, 0.15)"
                      : "rgba(255,255,255,0.06)",
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: isAlive ? "white" : "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: "600" }}>
                  {name || `Jugador ${index + 1}`}
                </Text>
                {isSelected && isAlive && <Icon name="check" tintColor="#ffd700" />}
                {!isAlive && <Text style={{ color: "rgba(255,255,255,0.5)" }}>eliminado</Text>}
              </TouchableOpacity>
            )
          })}
        </View>

        <PrimaryButton
          label="Confirmar eliminación"
          onPress={onConfirm}
          leftIcon="check"
          disabled={selectedIndex === null || (selectedIndex !== null && !alivePlayers[selectedIndex])}
        />
      </View>
    </Card>
  )
})



