import React from "react"
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"

export type IconName =
  | "detective"
  | "mask"
  | "eye"
  | "phone"
  | "vote"
  | "check"
  | "megaphone"
  | "trophy"
  | "users"
  | "alert"
  | "play"
  | "refresh"
  | "flash"

export function Icon({ name, size = 28, tintColor }: { name: IconName; size?: number; tintColor?: string }) {
  switch (name) {
    case "detective":
      return <FontAwesome5 name="user-secret" size={size} color={tintColor} />
    case "mask":
      return <MaterialCommunityIcons name="drama-masks" size={size} color={tintColor} />
    case "eye":
      return <Ionicons name="eye" size={size} color={tintColor} />
    case "phone":
      return <Ionicons name="phone-portrait-outline" size={size} color={tintColor} />
    case "vote":
      return <MaterialCommunityIcons name="vote" size={size} color={tintColor} />
    case "check":
      return <Ionicons name="checkmark" size={size} color={tintColor} />
    case "megaphone":
      return <Ionicons name="megaphone-outline" size={size} color={tintColor} />
    case "trophy":
      return <Ionicons name="trophy-outline" size={size} color={tintColor} />
    case "users":
      return <Ionicons name="people-outline" size={size} color={tintColor} />
    case "alert":
      return <Ionicons name="warning-outline" size={size} color={tintColor} />
    case "play":
      return <Ionicons name="play-circle-outline" size={size} color={tintColor} />
    case "refresh":
      return <Ionicons name="refresh" size={size} color={tintColor} />
    case "flash":
      return <Ionicons name="flash-outline" size={size} color={tintColor} />
    default:
      return null
  }
}


