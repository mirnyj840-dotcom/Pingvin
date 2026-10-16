import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { REGISTRATION_COLORS } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";

type LinkStatus = "checking" | "ready" | "invalid";

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const linkingUrl = Linking.useLinkingURL();
  const { session, isLoading: authIsLoading, updatePassword } = useAuth();
  const colors = REGISTRATION_COLORS;
  const handledUrl = useRef<string | null>(null);

  const [linkStatus, setLinkStatus] = useState<LinkStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const processRecoveryLink = async () => {
      if (!linkingUrl) {
        if (!authIsLoading) {
          setLinkStatus(session ? "ready" : "invalid");
        }
        return;
      }
      if (handledUrl.current === linkingUrl) return;

      let queryParams: URLSearchParams;
      let hashParams: URLSearchParams;
      try {
        const url = new URL(linkingUrl);
        queryParams = new URLSearchParams(url.search);
        hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      } catch {
        if (!authIsLoading) setLinkStatus(session ? "ready" : "invalid");
        return;
      }

      const getParam = (name: string) =>
        queryParams.get(name) ?? hashParams.get(name);
      const linkError = getParam("error_description") ?? getParam("error");
      if (linkError) {
        handledUrl.current = linkingUrl;
        setLinkStatus("invalid");
        return;
      }

      const code = getParam("code");
      const tokenHash = getParam("token_hash");
      const accessToken = getParam("access_token");
      const refreshToken = getParam("refresh_token");
      const type = getParam("type");
      const hasRecoveryData = Boolean(
        code ||
          (tokenHash && type === "recovery") ||
          (accessToken && refreshToken)
      );

      if (!hasRecoveryData) {
        if (!authIsLoading) setLinkStatus(session ? "ready" : "invalid");
        return;
      }

      handledUrl.current = linkingUrl;
      setLinkStatus("checking");
      try {
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (tokenHash && type === "recovery") {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (verifyError) throw verifyError;
        } else if (accessToken && refreshToken) {
          if (type && type !== "recovery") {
            throw new Error("This link is not a password recovery link.");
          }
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
        }
        if (isMounted) setLinkStatus("ready");
      } catch {
        if (isMounted) setLinkStatus("invalid");
      }
    };

    void processRecoveryLink();
    return () => {
      isMounted = false;
    };
  }, [authIsLoading, linkingUrl, session]);

  const submitNewPassword = async () => {
    if (isSubmitting) return;
    Keyboard.dismiss();
    setError("");

    if (!password || password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    if (!session) {
      setLinkStatus("invalid");
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      setIsComplete(true);
    } catch {
      setError("Не удалось обновить пароль. Откройте ссылку из письма ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isChecking =
    linkStatus === "checking" || (linkStatus === "ready" && !session);

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
        },
      ]}
    >
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
          },
        ]}
        bottomOffset={76}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.content,
            { width: Math.min(Math.max(width - 36, 280), 360) },
          ]}
        >
          <Text style={[styles.title, { color: colors.foreground }]}>
            {isComplete
              ? "Пароль обновлён"
              : linkStatus === "invalid"
                ? "Ссылка недействительна"
                : isChecking
                  ? "Проверяем ссылку…"
                  : "Новый пароль"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {isComplete
              ? "Теперь можно продолжить и пользоваться аккаунтом."
              : linkStatus === "invalid"
                ? "Ссылка истекла или уже была использована. Запросите новую ссылку для восстановления."
                : isChecking
                  ? "Подождите, подтверждаем ссылку для восстановления."
                  : "Придумайте новый пароль длиной не менее 8 символов."}
          </Text>

          {linkStatus === "ready" && !isComplete ? (
            <View style={styles.form}>
              <View style={styles.passwordField}>
                <TextInput
                  testID="new-password-input"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError("");
                  }}
                  placeholder="Новый пароль"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  keyboardAppearance="dark"
                  returnKeyType="next"
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                  onPress={() => setShowPassword((visible) => !visible)}
                  style={styles.passwordVisibilityButton}
                  hitSlop={8}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
              <View style={styles.passwordField}>
                <TextInput
                  testID="confirm-password-input"
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setError("");
                  }}
                  placeholder="Повторите пароль"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  keyboardAppearance="dark"
                  returnKeyType="done"
                  onSubmitEditing={() => void submitNewPassword()}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword
                      ? "Скрыть повтор пароля"
                      : "Показать повтор пароля"
                  }
                  onPress={() =>
                    setShowConfirmPassword((visible) => !visible)
                  }
                  style={styles.passwordVisibilityButton}
                  hitSlop={8}
                >
                  <Feather
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
            </View>
          ) : null}

          {error ? (
            <Text
              accessibilityRole="alert"
              style={[styles.error, { color: colors.error }]}
            >
              {error}
            </Text>
          ) : null}

          {linkStatus === "ready" || linkStatus === "invalid" || isComplete ? (
            <Pressable
              testID="reset-password-action"
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={() => {
                if (isComplete) {
                  router.replace("/auth");
                } else if (linkStatus === "invalid") {
                  router.replace("/auth");
                } else {
                  void submitNewPassword();
                }
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.foreground,
                  opacity: pressed || isSubmitting ? 0.78 : 1,
                },
              ]}
            >
              <Text
                style={[styles.primaryButtonText, { color: colors.background }]}
              >
                {isComplete
                  ? "Продолжить"
                  : linkStatus === "invalid"
                    ? "Вернуться ко входу"
                    : isSubmitting
                      ? "Обновляем…"
                      : "Сохранить новый пароль"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 28,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    lineHeight: 28,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    marginBottom: 28,
    textAlign: "center",
  },
  form: {
    gap: 14,
  },
  input: {
    width: "100%",
    height: 46,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  passwordField: {
    position: "relative",
    width: "100%",
    height: 46,
  },
  passwordInput: {
    paddingRight: 48,
  },
  passwordVisibilityButton: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 28,
  },
  primaryButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
});
