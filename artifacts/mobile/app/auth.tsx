import React, { useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import ScrambleText from "@/components/ScrambleText";
import { REGISTRATION_COLORS } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signIn" | "signUp";

function getAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/invalid login credentials/i.test(message)) {
    return "Неверный email или пароль.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Сначала подтвердите email по ссылке из письма.";
  }
  if (/already registered/i.test(message)) {
    return "Аккаунт с таким email уже есть. Попробуйте войти.";
  }
  if (/password/i.test(message) && /length|characters|short|least/i.test(message)) {
    return "Пароль должен содержать не менее 8 символов.";
  }
  if (/rate limit/i.test(message)) {
    return "Слишком много попыток. Подождите немного и попробуйте снова.";
  }
  return "Не удалось выполнить запрос. Проверьте соединение и попробуйте снова.";
}

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { signIn, signUp } = useAuth();
  const colors = REGISTRATION_COLORS;

  const [mode, setMode] = useState<AuthMode>("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (isSubmitting) return;
    Keyboard.dismiss();

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Введите корректный email.");
      setMessage("");
      return;
    }
    if (!password) {
      setError("Введите пароль.");
      setMessage("");
      return;
    }
    if (mode === "signUp" && password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      if (mode === "signIn") {
        await signIn(normalizedEmail, password);
      } else {
        const { requiresEmailConfirmation } = await signUp(
          normalizedEmail,
          password
        );
        if (requiresEmailConfirmation) {
          setMode("signIn");
          setMessage(
            "Проверьте почту и подтвердите email. Затем войдите с тем же паролем."
          );
        }
      }
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

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
          <ScrambleText
            value={mode === "signUp" ? "Создать аккаунт" : "Вход"}
            delay={150}
            style={[styles.title, { color: colors.foreground }]}
          />
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {mode === "signUp"
              ? "После входа заполните профиль ученика и начните обучение."
              : "Войдите, чтобы открыть свой профиль и прогресс."}
          </Text>

          <View style={styles.form}>
            <TextInput
              testID="auth-email-input"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError("");
              }}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardAppearance="dark"
              returnKeyType="next"
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}
            />
            <View style={styles.passwordField}>
              <TextInput
                testID="auth-password-input"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setError("");
                }}
                placeholder="Пароль"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={mode === "signUp" ? "new-password" : "password"}
                textContentType={
                  mode === "signUp" ? "newPassword" : "password"
                }
                keyboardAppearance="dark"
                returnKeyType="done"
                onSubmitEditing={() => void submit()}
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
                testID="auth-toggle-password-visibility"
                accessibilityRole="button"
                accessibilityLabel={
                  isPasswordVisible ? "Скрыть пароль" : "Показать пароль"
                }
                accessibilityState={{ selected: isPasswordVisible }}
                hitSlop={8}
                onPress={() => setIsPasswordVisible((visible) => !visible)}
                style={styles.passwordVisibilityButton}
              >
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          </View>

          {message ? (
            <Text
              accessibilityRole="alert"
              style={[styles.message, { color: colors.foreground }]}
            >
              {message}
            </Text>
          ) : null}
          {error ? (
            <Text
              accessibilityRole="alert"
              style={[styles.error, { color: colors.error }]}
            >
              {error}
            </Text>
          ) : null}

          <Text style={[styles.cloudNote, { color: colors.mutedForeground }]}>
            Профиль и учебный прогресс будут синхронизироваться с облаком.
          </Text>

          <View style={styles.actions}>
            <Pressable
              testID="auth-submit-button"
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={() => void submit()}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.foreground,
                  opacity: pressed || isSubmitting ? 0.78 : 1,
                },
              ]}
            >
              <ScrambleText
                value={
                  isSubmitting
                    ? "Подождите…"
                    : mode === "signUp"
                      ? "Создать аккаунт"
                      : "Войти"
                }
                delay={300}
                style={[
                  styles.primaryButtonText,
                  { color: colors.background },
                ]}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={() =>
                changeMode(mode === "signUp" ? "signIn" : "signUp")
              }
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  opacity: pressed || isSubmitting ? 0.7 : 1,
                },
              ]}
            >
              <ScrambleText
                value={
                  mode === "signUp"
                    ? "Уже есть аккаунт? Войти"
                    : "Создать аккаунт"
                }
                delay={450}
                style={[
                  styles.secondaryButtonText,
                  { color: colors.foreground },
                ]}
              />
            </Pressable>
          </View>
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
  message: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: "center",
  },
  error: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
    textAlign: "center",
  },
  cloudNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
    textAlign: "center",
  },
  actions: {
    gap: 12,
    marginTop: 38,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  secondaryButton: {
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
