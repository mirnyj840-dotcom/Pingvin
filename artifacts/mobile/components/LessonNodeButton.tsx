import React, { useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
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

const NODE_SIZE = 64;

const TYPE_ICON: Record<NodeType, keyof typeof Feather.glyphMap> = {
  theory: "book-open",
  miniQuiz: "edit-3",
  practice: "cpu",
  boss: "zap",
};

export default function LessonNodeButton({
  node,
  status,
  onPress,
  chapterColor,
}: LessonNodeButtonProps) {
  const colors = useAppColors();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (status !== "active") return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1
    );
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    if (status === "locked") return;
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
    <Animated.View style={isActive ? animatedStyle : undefined}>
      {isActive && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: NODE_SIZE / 2 + 4,
              backgroundColor: chapterColor + "25",
              margin: -4,
            },
          ]}
        />
      )}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isLocked ? 1 : 0.8}
        style={[
          styles.node,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: isActive ? 2.5 : 1.5,
            opacity: isLocked ? 0.45 : 1,
          },
        ]}
      >
        <Feather name={iconName} size={24} color={iconColor} />
      </TouchableOpacity>
      <Text
        style={[
          styles.label,
          {
            color: isLocked ? colors.mutedForeground : colors.subForeground,
          },
        ]}
        numberOfLines={1}
      >
        {node.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    width: NODE_SIZE,
  },
});
