import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

const SCRAMBLE_CHARS = "0123456789+-×÷=%";

type ScrambleTextProps = {
  value: string;
  duration?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
};

export default function ScrambleText({
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
