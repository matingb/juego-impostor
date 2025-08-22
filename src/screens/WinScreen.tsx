import React from "react"
import { Text, View } from "react-native"
import { Card } from "../components/Card"
import { SecondaryButton } from "../components/SecondaryButton"
import { Icon } from "../components/Icon"

export type WinScreenProps = {
  title: string
  subtitle: string
  onNewGame: () => void
}

export const WinScreen = React.memo(function WinScreen(props: WinScreenProps) {
  const { title, subtitle, onNewGame } = props
  return (
    <Card>
      <View style={{ alignItems: "center", paddingVertical: 16 }}>
        <Icon name="trophy" size={48} tintColor="#fff" />
        <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 8 }}>{title}</Text>
        <Text style={{ color: "rgba(255,255,255,0.85)", marginBottom: 12 }}>{subtitle}</Text>
        <SecondaryButton label="Nuevo Juego" onPress={onNewGame} leftIcon="refresh" />
      </View>
    </Card>
  )
})



