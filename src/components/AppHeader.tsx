import React from "react"
import { Text, View } from "react-native"
import { Icon } from "./Icon"

export function AppHeader() {
  return (
    <View style={{ alignItems: "center", marginBottom: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Icon name="detective" tintColor="#fff" size={32} />
        <Text style={{ fontSize: 34, fontWeight: "800", color: "white", textAlign: "center", marginLeft: 8 }}>Juego de Impostores</Text>
      </View>
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>¿Podrás descubrir quién es el impostor?</Text>
    </View>
  )
}


