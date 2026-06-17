import React, { useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type { LessonNode, NodeType } from "@/data/curriculum";
import { useAppColors } from "@/hooks/useAppColors";

type NodeStatus = "locked" | "active" | "done";

interface LessonNodeButtonProps {
  node: LessonNode;
  status: NodeStatus;
  onPress: () => void;
  chapterColor: string;
}

const NODE_SIZE = 72;

const TYPE_ICON: Record<NodeType, keyof typeof Feather.glyphMap> = {
  theory: "book-open",
  miniQuiz: "edit-3",
  practice: "cpu",
  boss: "zap",
};

const TYPE_LABEL: Record<NodeType, string> = {
  theory: "Теория",
  miniQuiz: "Квиз",
  practice: "Практика",
  boss: "Босс",
};

export default function LessonNodeButton({
  node,
  status,
  onPress,
  chapterColor,
}: LessonNodeButtonProps) {
  const colors = useAppColors();
  const pulse = useSharedValue(1);
  const press = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (status !== "active") return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.07, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 900 }),
        withTiming(0.45, { duration: 900 })
      ),
      -1
    );
  }, [status]);

  const nodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * press.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const handlePress = async () => {
    if (status === "locked") return;
    press.value = withSpring(0.92, { damping: 6, stiffness: 400 }, () => {
      press.value = withSpring(1, { damping: 8, stiffness: 200 });
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const isDone = status === "done";
  const isActive = status === "active";
  const isLocked = status === "locked";

  const bgColor = isDone
    ? chapterColor
    : isActive
    ? colors.card
    : colors.track;

  const borderColor = isDone
    ? chapterColor
    : isActive
    ? chapterColor
    : colors.border;

  const iconColor = isDone
    ? "white"
    : isActive
    ? chapterColor
    : colors.mutedForeground;

  const iconName = isDone
    ? "check"
    : isLocked
    ? "lock"
    : TYPE_ICON[node.type] || "circle";

  return (
    <View style={styles.wrapper}>
      <Animated.View style={nodeStyle}>
        {/* Outer glow ring for active */}
        {isActive && (
          <Animated.View
            style={[
              styles.ring,
              { borderColor: chapterColor },
              ringStyle,
            ]}
          />
        )}
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={isLocked ? 1 : 0.85}
          style={[
            styles.node,
            {
              backgroundColor: bgColor,
              borderColor: borderColor,
              borderWidth: isActive ? 2.5 : isDone ? 0 : 1.5,
              opacity: isLocked ? 0.40 : 1,
              elevation: isDone || isActive ? 6 : 0,
            },
          ]}
        >
          <Feather name={iconName} size={26} color={iconColor} />
        </TouchableOpacity>
      </Animated.View>

      {/* Node label */}
      <Text
        style={[
          styles.label,
          { color: isLocked ? colors.mutedForeground : colors.subForeground },
        ]}
        numberOfLines={1}
      >
        {node.label}
      </Text>

      {/* Type badge */}
      <View
        style={[
          styles.typeBadge,
          {
            backgroundColor: isLocked
              ? colors.track
              : isDone
              ? chapterColor + "22"
              : chapterColor + "18",
            borderColor: isLocked
              ? colors.border
              : chapterColor + "30",
          },
        ]}
      >
        <Text
          style={[
            styles.typeText,
            {
              color: isLocked
                ? colors.mutedForeground
                : isDone
                ? chapterColor
                : chapterColor,
            },
          ]}
        >
          {TYPE_LABEL[node.type]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 6,
  },
  ring: {
    position: "absolute",
    width: NODE_SIZE + 18,
    height: NODE_SIZE + 18,
    borderRadius: (NODE_SIZE + 18) / 2,
    borderWidth: 2.5,
    top: -9,
    left: -9,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: NODE_SIZE + 20,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
