import React from "react"
import { View, ViewProps } from "react-native"

export function Card({ children, style, ...rest }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View {...rest} style={[cardStyles.container, style]}> 
      {children}
    </View>
  )
}

const cardStyles = {
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
} as const

