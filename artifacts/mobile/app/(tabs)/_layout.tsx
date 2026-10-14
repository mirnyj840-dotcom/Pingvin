import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import {
  PinkHomeIcon,
  PinkPathIcon,
  PinkProfileIcon,
  PinkSettingsIcon,
} from "@/components/PinkTabIcons";
import { useApp } from "@/contexts/AppContext";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} />
        <NativeTabs.Trigger.Label>Главная</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="path">
        <NativeTabs.Trigger.Icon sf={{ default: "map", selected: "map.fill" }} />
        <NativeTabs.Trigger.Label>Путь</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} />
        <NativeTabs.Trigger.Label>Профиль</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <NativeTabs.Trigger.Label>Настройки</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const { colors } = useTheme();
  const { settings } = useApp();
  const isPink = settings.theme === "pink";
  const colorScheme = useColorScheme();
  const safeAreaInsets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const tabBarHeight = isWeb ? 84 : 68;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isPink ? "#DDB0C8" : colors.mutedForeground,
        tabBarLabelStyle: isPink
          ? { fontSize: 10, fontWeight: "600", marginBottom: 2 }
          : { fontSize: 11 },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: tabBarHeight + safeAreaInsets.bottom,
          paddingBottom: safeAreaInsets.bottom,
        },
        tabBarBackground: () =>
          isPink ? (
            <PinkTabBarBackground colors={colors} />
          ) : isIOS ? (
            <BlurView
              intensity={90}
              tint={isDark ? "dark" : "light"}
              style={[
                StyleSheet.absoluteFill,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                },
              ]}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: colors.background,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ focused, color }) =>
            isPink ? (
              <PinkHomeIcon active={focused} />
            ) : isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="path"
        options={{
          title: "Путь",
          tabBarIcon: ({ focused, color }) =>
            isPink ? (
              <PinkPathIcon active={focused} />
            ) : isIOS ? (
              <SymbolView name="map" tintColor={color} size={24} />
            ) : (
              <Feather name="map" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        // Keep the profile tab visible in the current app variant.
        options={{
          title: "Профиль",
          tabBarIcon: ({ focused, color }) =>
            isPink ? (
              <PinkProfileIcon active={focused} />
            ) : isIOS ? (
              <SymbolView name="person" tintColor={color} size={24} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройки",
          tabBarIcon: ({ focused, color }) =>
            isPink ? (
              <PinkSettingsIcon active={focused} />
            ) : isIOS ? (
              <SymbolView name="gearshape" tintColor={color} size={24} />
            ) : (
              <Feather name="settings" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

function PinkTabBarBackground({ colors }: { colors: any }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.pinkBar]}>
      {/* Soft gradient background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFDFC" }]} />
      {/* Top border — pink dashed line feel */}
      <View style={styles.pinkTopBorder} />
      {/* Decorative floating elements */}
      <Text style={[styles.deco, { left: 12, top: 6, fontSize: 11 }]}>💕</Text>
      <Text style={[styles.deco, { left: "28%", top: 8, fontSize: 9 }]}>✨</Text>
      <Text style={[styles.deco, { left: "52%", top: 5, fontSize: 10 }]}>🌸</Text>
      <Text style={[styles.deco, { right: "22%", top: 9, fontSize: 9 }]}>⭐</Text>
      <Text style={[styles.deco, { right: 14, top: 6, fontSize: 10 }]}>🎀</Text>
    </View>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  pinkBar: {
    overflow: "hidden",
  },
  pinkTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: "#FFB3D1",
    opacity: 0.6,
  },
  deco: {
    position: "absolute",
    opacity: 0.55,
  },
});
