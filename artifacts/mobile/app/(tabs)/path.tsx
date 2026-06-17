import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/contexts/AppContext";
import { useAppColors } from "@/hooks/useAppColors";
import LessonNodeButton from "@/components/LessonNodeButton";
import { chapters } from "@/data/curriculum";

export default function PathScreen() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userStats, nodeStatus } = useApp();

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <Feather name="map" size={20} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Путь
        </Text>
        <View style={[styles.progressBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.progressText, { color: colors.subForeground }]}>
            {userStats.completedNodeIds.length} / {chapters.reduce((s, c) => s + c.nodes.length, 0)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: pb + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((chapter, chIdx) => {
          const completed = chapter.nodes.filter((n) =>
            userStats.completedNodeIds.includes(n.id)
          ).length;
          const total = chapter.nodes.length;
          const isUnlocked =
            chIdx === 0 ||
            chapters[chIdx - 1].nodes.every((n) =>
              userStats.completedNodeIds.includes(n.id)
            );

          return (
            <View key={chapter.id} style={styles.chapterSection}>
              {/* Chapter header */}
              <View
                style={[
                  styles.chapterHeader,
                  {
                    backgroundColor: chapter.color + "15",
                    borderColor: chapter.color + "30",
                    opacity: isUnlocked ? 1 : 0.45,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chapterIcon,
                    { backgroundColor: chapter.color + "25" },
                  ]}
                >
                  <Feather
                    name={chapter.iconName as any}
                    size={18}
                    color={chapter.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.chapterTitle, { color: colors.foreground }]}
                  >
                    {chapter.title}
                  </Text>
                  <Text
                    style={[
                      styles.chapterDesc,
                      { color: colors.subForeground },
                    ]}
                  >
                    {chapter.description}
                  </Text>
                </View>
                <Text
                  style={[styles.chapterProgress, { color: chapter.color }]}
                >
                  {completed}/{total}
                </Text>
              </View>

              {/* Progress bar */}
              <View
                style={[styles.chapterBar, { backgroundColor: colors.track }]}
              >
                <View
                  style={[
                    styles.chapterBarFill,
                    {
                      backgroundColor: chapter.color,
                      width: `${(completed / total) * 100}%`,
                    },
                  ]}
                />
              </View>

              {/* Nodes */}
              <View style={styles.nodesContainer}>
                {chapter.nodes.map((node, nodeIdx) => {
                  const status = nodeStatus(node.id);
                  const isLeft = nodeIdx % 2 === 0;

                  return (
                    <View
                      key={node.id}
                      style={[
                        styles.nodeRow,
                        { justifyContent: isLeft ? "flex-start" : "flex-end" },
                      ]}
                    >
                      {nodeIdx > 0 && (
                        <View
                          style={[
                            styles.connector,
                            {
                              backgroundColor: colors.border,
                              alignSelf: isLeft ? "flex-end" : "flex-start",
                              marginLeft: isLeft ? 0 : undefined,
                              marginRight: !isLeft ? 0 : undefined,
                            },
                          ]}
                        />
                      )}
                      <LessonNodeButton
                        node={node}
                        status={status}
                        chapterColor={chapter.color}
                        onPress={() => {
                          if (status !== "locked") {
                            router.push(`/lesson/${node.id}`);
                          }
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressText: { fontSize: 13, fontWeight: "600" },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  chapterSection: { marginBottom: 32 },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  chapterIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  chapterDesc: { fontSize: 12, marginTop: 2 },
  chapterProgress: { fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
  chapterBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  chapterBarFill: { height: "100%", borderRadius: 2 },
  nodesContainer: { gap: 0 },
  nodeRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
    position: "relative",
  },
  connector: {
    position: "absolute",
    width: 2,
    height: 20,
    top: -14,
    left: "50%",
    marginLeft: -1,
  },
});
