import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { REGISTRATION_COLORS } from "@/constants/colors";

const SCRAMBLE_CHARS = "0123456789+-×÷=%";

type ScrambleTextProps = {
  value: string;
  duration?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
};

function ScrambleText({
  value,
  duration = 1200,
  delay = 0,
  style,
  onPress,
}: ScrambleTextProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationToken = useRef<symbol | null>(null);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scramble = useCallback(() => {
    const token = Symbol("scramble");
    animationToken.current = token;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    const startAnimation = () => {
      const startedAt = Date.now();

      const frame = () => {
        if (animationToken.current !== token) return;

        const progress = Math.min(1, (Date.now() - startedAt) / duration);
        const revealCount = Math.floor(value.length * progress);
        const nextValue = [...value]
          .map((character, index) => {
            if (character === " " || index < revealCount) return character;
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("");

        setDisplayValue(nextValue);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(frame);
        } else {
          setDisplayValue(value);
          frameRef.current = null;
        }
      };

      frameRef.current = requestAnimationFrame(frame);
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [delay, duration, value]);

  useEffect(() => {
    scramble();
    const interval = setInterval(scramble, 6000);

    return () => {
      clearInterval(interval);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      animationToken.current = null;
    };
  }, [scramble]);

  return (
    <Text
      onPress={() => {
        scramble();
        onPress?.();
      }}
      style={style}
    >
      {displayValue}
    </Text>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colors = REGISTRATION_COLORS;
  const { completeOnboarding } = useApp();
  const { signOut } = useAuth();

  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [error, setError] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  const profile = {
    surname,
    patronymic,
    groupNumber,
  };

  const finish = async (requireForm: boolean) => {
    if (isFinishing) return;
    Keyboard.dismiss();

    if (
      requireForm &&
      (!surname.trim() ||
        !firstName.trim() ||
        !patronymic.trim() ||
        !groupNumber.trim())
    ) {
      setError("Заполни все поля, чтобы зарегистрироваться");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError("");
    setIsFinishing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding(firstName.trim() || "Ученик", "penguin", profile);
    router.replace("/(tabs)");
  };

  const leaveAccount = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    setError("");
    try {
      await signOut();
      router.replace("/auth");
    } catch {
      setError("Не удалось выйти из аккаунта. Попробуйте ещё раз.");
    } finally {
      setIsFinishing(false);
    }
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
            styles.card,
            {
              width: Math.min(Math.max(width - 36, 280), 320),
              backgroundColor: colors.card,
            },
          ]}
        >
            <ScrambleText
              value="Добро пожаловать"
              delay={150}
              style={[styles.title, { color: colors.foreground }]}
            />

            <View style={styles.form}>
              <RegistrationInput
                value={surname}
                onChangeText={(value) => {
                  setSurname(value);
                  setError("");
                }}
                placeholder="Фамилия"
                colors={colors}
                autoComplete="family-name"
              />
              <RegistrationInput
                value={firstName}
                onChangeText={(value) => {
                  setFirstName(value);
                  setError("");
                }}
                placeholder="Имя"
                colors={colors}
                autoComplete="given-name"
              />
              <RegistrationInput
                value={patronymic}
                onChangeText={(value) => {
                  setPatronymic(value);
                  setError("");
                }}
                placeholder="Отчество"
                colors={colors}
              />
              <RegistrationInput
                value={groupNumber}
                onChangeText={(value) => {
                  setGroupNumber(value.replace(/[^0-9А-Яа-яA-Za-z-]/g, ""));
                  setError("");
                }}
                placeholder="Номер группы"
                colors={colors}
                keyboardType="default"
                returnKeyType="done"
              />
            </View>

            {error ? (
              <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                testID="register-button"
                accessibilityRole="button"
                disabled={isFinishing}
                onPress={() => finish(true)}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.foreground,
                    opacity: pressed || isFinishing ? 0.82 : 1,
                  },
                ]}
              >
                <ScrambleText
                  value="Зарегистрироваться"
                  delay={300}
                  onPress={() => finish(true)}
                  style={[
                    styles.primaryButtonText,
                    { color: colors.background },
                  ]}
                />
              </Pressable>

              <Pressable
                testID="logout-button"
                accessibilityRole="button"
                disabled={isFinishing}
                onPress={() => void leaveAccount()}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed || isFinishing ? 0.7 : 1,
                  },
                ]}
              >
                <ScrambleText
                  value="Выйти из аккаунта"
                  delay={450}
                  onPress={() => void leaveAccount()}
                  style={[styles.secondaryButtonText, { color: colors.foreground }]}
                />
              </Pressable>
            </View>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

type RegistrationInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  colors: typeof REGISTRATION_COLORS;
  autoComplete?: "family-name" | "given-name";
  keyboardType?: "default";
  returnKeyType?: "done";
};

function RegistrationInput({
  value,
  onChangeText,
  placeholder,
  colors,
  autoComplete,
  keyboardType = "default",
  returnKeyType,
}: RegistrationInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      autoCapitalize="words"
      autoCorrect={false}
      autoComplete={autoComplete}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      style={[
        styles.input,
        {
          color: colors.foreground,
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      maxLength={32}
    />
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
  card: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 28,
  },
  title: {
    alignSelf: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 36,
  },
  form: {
    gap: 14,
  },
  input: {
    width: "100%",
    height: 38,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 7,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  error: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 12,
    textAlign: "center",
  },
  actions: {
    gap: 12,
    marginTop: 164,
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
    fontSize: 13,
    lineHeight: 18,
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