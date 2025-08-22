import React from "react"
import { Text, View } from "react-native"
import { Card } from "../components/Card"
import { PrimaryButton } from "../components/PrimaryButton"
import { SecondaryButton } from "../components/SecondaryButton"
import { Icon } from "../components/Icon"

export type RevealScreenProps = {
  playerName: string
  wasImpostor: boolean
  aliveImpostors: number
  aliveNormals: number
  onNextRound: () => void
  onNewGame: () => void
}

export const RevealScreen = React.memo(function RevealScreen(props: RevealScreenProps) {
  const { playerName, wasImpostor, aliveImpostors, aliveNormals, onNextRound, onNewGame } = props
  return (
    <Card>
      <View style={{ alignItems: "center", paddingVertical: 16, flex: 1 }}>
        <Icon name="megaphone" size={48} tintColor="#fff" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: wasImpostor ? "#ff6b6b" : "#2ed573",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {wasImpostor ? `${playerName} era IMPOSITOR` : `${playerName} no era impostor`}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.85)", marginBottom: 12 }}>
          Impostores: {aliveImpostors} • Tripulantes: {aliveNormals}
        </Text>
        <PrimaryButton label="Siguiente votación" onPress={onNextRound} leftIcon="refresh" />
        <SecondaryButton label="Nuevo Juego" onPress={onNewGame} leftIcon="refresh" />
      </View>
    </Card>
  )
})



