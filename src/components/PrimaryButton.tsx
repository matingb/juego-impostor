import React from "react"
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors } from "../theme"
import { Icon, IconName } from "./Icon"

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  leftIcon,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  leftIcon?: IconName
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        backgroundColor: disabled ? colors.primaryDim : colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {leftIcon ? <Icon name={leftIcon} size={18} tintColor="#fff" /> : null}
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16, textAlign: "center", marginLeft: leftIcon ? 8 : 0 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}


