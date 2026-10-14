import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { userStats, loadedUserId, syncError, retrySync } = useApp();
  const { session, isLoading: authIsLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const authenticatedUserId = session?.user.id ?? null;

  useEffect(() => {
    if (authIsLoading) return;
    const inAuth = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";
    if (!authenticatedUserId) {
      if (!inAuth) router.replace("/auth");
      return;
    }
    if (!userStats.isLoaded || loadedUserId !== authenticatedUserId) return;

    if (!userStats.onboardingDone && !inOnboarding) {
      router.replace("/onboarding");
    } else if (userStats.onboardingDone && (inAuth || inOnboarding)) {
      router.replace("/(tabs)");
    }
  }, [
    authIsLoading,
    authenticatedUserId,
    loadedUserId,
    router,
    segments,
    userStats.isLoaded,
    userStats.onboardingDone,
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[nodeId]"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      {syncError ? (
        <View
          accessibilityRole="alert"
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: insets.bottom + 88,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.red,
            backgroundColor: colors.card,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: colors.foreground,
              fontFamily: "Inter_500Medium",
              fontSize: 12,
              lineHeight: 17,
            }}
          >
            {syncError}
          </Text>
          <Pressable
            testID="retry-cloud-sync"
            accessibilityRole="button"
            onPress={() => void retrySync()}
            hitSlop={8}
          >
            <Text
              style={{
                color: colors.primary,
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
              }}
            >
              Повторить
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AuthProvider>
                <AppProvider>
                  <RootLayoutNav />
                </AppProvider>
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
