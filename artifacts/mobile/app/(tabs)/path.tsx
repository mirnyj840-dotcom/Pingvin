import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/contexts/AppContext";
import { useAppColors } from "@/hooks/useAppColors";
import LessonNodeButton from "@/components/LessonNodeButton";
import { chapters } from "@/data/curriculum";

const SCREEN_W = Dimensions.get("window").width;
const CONTENT_PAD = 24;
const CONTENT_W = SCREEN_W - CONTENT_PAD * 2;
const NODE_PAD = 20;
const NODE_SIZE = 72;
const NODE_HALF = NODE_SIZE / 2;
const LEFT_CENTER = NODE_PAD + NODE_HALF;
const RIGHT_CENTER = CONTENT_W - NODE_PAD - NODE_HALF;

function DotConnector({
  fromLeft,
  toLeft,
  done,
  color,
}: {
  fromLeft: boolean;
  toLeft: boolean;
  done: boolean;
  color: string;
}) {
  const H = 52;
  const DOT = 7;
  const DOTS = 8;
  const fromX = fromLeft ? LEFT_CENTER : RIGHT_CENTER;
  const toX = toLeft ? LEFT_CENTER : RIGHT_CENTER;

  return (
    <View style={{ height: H, width: CONTENT_W, position: "relative" }}>
      {Array.from({ length: DOTS }, (_, i) => {
        const t = i / (DOTS - 1);
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: done ? color : "#374151",
              opacity: done ? 0.7 + 0.3 * (1 - Math.abs(t - 0.5) * 2) : 0.3,
              left: fromX + t * (toX - fromX) - DOT / 2,
              top: t * H - DOT / 2,
            }}
          />
        );
      })}
    </View>
  );
}

export default function PathScreen() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userStats, nodeStatus } = useApp();

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const totalNodes = chapters.reduce((s, c) => s + c.nodes.length, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <View style={[styles.headerIcon, { backgroundColor: colors.primary + "20" }]}>
          <Feather name="map" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Путь</Text>
        <View style={[styles.progressBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="star" size={12} color={colors.amber} />
          <Text style={[styles.progressText, { color: colors.subForeground }]}>
            {userStats.completedNodeIds.length}/{totalNodes}
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
                    backgroundColor: isUnlocked
                      ? chapter.color + "18"
                      : colors.card,
                    borderColor: isUnlocked
                      ? chapter.color + "40"
                      : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chapterIcon,
                    { backgroundColor: isUnlocked ? chapter.color + "28" : colors.track },
                  ]}
                >
                  <Feather
                    name={isUnlocked ? (chapter.iconName as any) : "lock"}
                    size={16}
                    color={isUnlocked ? chapter.color : colors.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.chapterTitle,
                      { color: isUnlocked ? colors.foreground : colors.mutedForeground },
                    ]}
                  >
                    {chapter.title}
                  </Text>
                  <Text style={[styles.chapterDesc, { color: colors.subForeground }]}>
                    {chapter.description}
                  </Text>
                </View>
                <View style={styles.chapterProgressBox}>
                  <Text style={[styles.chapterProgressNum, { color: isUnlocked ? chapter.color : colors.mutedForeground }]}>
                    {completed}/{total}
                  </Text>
                  <View style={[styles.miniBar, { backgroundColor: colors.track }]}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          backgroundColor: chapter.color,
                          width: `${(completed / total) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Nodes with dot connectors */}
              <View style={styles.nodesContainer}>
                {chapter.nodes.map((node, nodeIdx) => {
                  const status = nodeStatus(node.id);
                  const isLeft = nodeIdx % 2 === 0;
                  const nextNode = chapter.nodes[nodeIdx + 1];
                  const nextIsLeft = (nodeIdx + 1) % 2 === 0;
                  const connectorDone =
                    nextNode ? nodeStatus(nextNode.id) !== "locked" : false;

                  return (
                    <View key={node.id}>
                      <View
                        style={[
                          styles.nodeRow,
                          { justifyContent: isLeft ? "flex-start" : "flex-end" },
                        ]}
                      >
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
                      {nextNode && (
                        <DotConnector
                          fromLeft={isLeft}
                          toLeft={nextIsLeft}
                          done={connectorDone}
                          color={chapter.color}
                        />
                      )}
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
    paddingHorizontal: CONTENT_PAD,
    paddingBottom: 14,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  progressText: { fontSize: 13, fontWeight: "600" },
  content: { paddingHorizontal: CONTENT_PAD, paddingTop: 4 },
  chapterSection: { marginBottom: 24 },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  chapterIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  chapterDesc: { fontSize: 12, marginTop: 1 },
  chapterProgressBox: { alignItems: "flex-end", gap: 5 },
  chapterProgressNum: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  miniBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBarFill: { height: "100%", borderRadius: 2 },
  nodesContainer: {},
  nodeRow: {
    flexDirection: "row",
    paddingHorizontal: NODE_PAD,
  },
});
