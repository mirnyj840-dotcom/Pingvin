import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path as SvgPath } from "react-native-svg";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import LessonNodeButton from "@/components/LessonNodeButton";
import Mascot from "@/components/Mascot";
import { chapters } from "@/data/curriculum";

const SCREEN_W = Dimensions.get("window").width;
const CONTENT_PAD = 24;
const CONTENT_W = SCREEN_W - CONTENT_PAD * 2;
const NODE_PAD = 16;
const NODE_SIZE = 78;
const LEFT_CENTER = NODE_PAD + NODE_SIZE / 2;
const RIGHT_CENTER = CONTENT_W - NODE_PAD - NODE_SIZE / 2;
const CONNECTOR_H = 68;

function BezierConnector({
  fromLeft,
  toLeft,
  done,
  color,
  trackColor,
}: {
  fromLeft: boolean;
  toLeft: boolean;
  done: boolean;
  color: string;
  trackColor: string;
}) {
  const x0 = fromLeft ? LEFT_CENTER : RIGHT_CENTER;
  const x1 = toLeft ? LEFT_CENTER : RIGHT_CENTER;
  const cx0 = x0;
  const cy0 = CONNECTOR_H * 0.42;
  const cx1 = x1;
  const cy1 = CONNECTOR_H * 0.58;
  const d = `M ${x0} 0 C ${cx0} ${cy0} ${cx1} ${cy1} ${x1} ${CONNECTOR_H}`;

  return (
    <Svg width={CONTENT_W} height={CONNECTOR_H}>
      <SvgPath
        d={d}
        stroke={done ? color : trackColor}
        strokeWidth={done ? 3.5 : 2.5}
        fill="none"
        strokeDasharray={done ? undefined : "9 7"}
        strokeLinecap="round"
        strokeOpacity={done ? 0.75 : 0.45}
      />
    </Svg>
  );
}

export default function PathScreen() {
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userStats, nodeStatus, settings } = useApp();

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);
  const totalNodes = chapters.reduce((s, c) => s + c.nodes.length, 0);
  const totalDone = userStats.completedNodeIds.length;
  const overallPct = Math.round((totalDone / totalNodes) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <View style={[styles.headerIconWrap, { backgroundColor: colors.primary + "22" }]}>
          <Feather name="map" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontSize: fs(20) }]}>
          Путь
        </Text>
        <View style={[styles.overallBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.overallText, { color: colors.primary, fontSize: fs(14) }]}>
            {overallPct}%
          </Text>
          <Text style={[styles.overallSub, { color: colors.mutedForeground, fontSize: fs(10) }]}>
            {totalDone}/{totalNodes}
          </Text>
        </View>
      </View>

      {/* Overall progress bar */}
      <View style={[styles.progressBarWrap, { paddingHorizontal: CONTENT_PAD, paddingBottom: 12 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ color: colors.subForeground, fontSize: fs(12) }}>
            Общий прогресс курса
          </Text>
          <Text style={{ color: colors.primary, fontSize: fs(12), fontWeight: "700" }}>
            {totalDone} из {totalNodes} уроков
          </Text>
        </View>
        <View style={{ height: 10, backgroundColor: colors.track, borderRadius: 8, overflow: "hidden" }}>
          <LinearGradient
            colors={[colors.primary, colors.primary + "BB"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${Math.max(overallPct, 2)}%`, height: "100%", borderRadius: 8 }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: pb + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((chapter, chIdx) => {
          const doneCh = chapter.nodes.filter((n) =>
            userStats.completedNodeIds.includes(n.id)
          ).length;
          const totalCh = chapter.nodes.length;
          const pct = Math.round((doneCh / totalCh) * 100);
          const isUnlocked =
            chIdx === 0 ||
            chapters[chIdx - 1].nodes.every((n) =>
              userStats.completedNodeIds.includes(n.id)
            );
          const isDone = doneCh === totalCh;

          return (
            <View key={chapter.id} style={styles.chapterSection}>
              {/* Chapter Banner — uses theme colors, no hardcoded dark values */}
              <LinearGradient
                colors={
                  isUnlocked
                    ? [chapter.color + "28", chapter.color + "08"]
                    : [colors.secondary, colors.card]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.chapterBanner,
                  {
                    borderColor: isUnlocked
                      ? chapter.color + "38"
                      : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chapterIconCircle,
                    {
                      backgroundColor: isUnlocked
                        ? chapter.color + "30"
                        : colors.track,
                    },
                  ]}
                >
                  <Feather
                    name={
                      isDone
                        ? "check-circle"
                        : isUnlocked
                        ? (chapter.iconName as any)
                        : "lock"
                    }
                    size={18}
                    color={
                      isDone
                        ? chapter.color
                        : isUnlocked
                        ? chapter.color
                        : colors.mutedForeground
                    }
                  />
                </View>

                <View style={styles.chapterInfo}>
                  <Text
                    style={[
                      styles.chapterName,
                      {
                        color: isUnlocked
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontSize: fs(14),
                      },
                    ]}
                  >
                    {chapter.title}
                  </Text>
                  <Text
                    style={[
                      styles.chapterDesc,
                      { color: colors.subForeground, fontSize: fs(11) },
                    ]}
                  >
                    {chapter.description}
                  </Text>
                </View>

                <View style={styles.chapterRight}>
                  <Text
                    style={[
                      styles.chapterPct,
                      {
                        color: isDone
                          ? chapter.color
                          : isUnlocked
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontSize: fs(14),
                      },
                    ]}
                  >
                    {pct}%
                  </Text>
                  <View style={styles.progressDots}>
                    {chapter.nodes.map((n) => {
                      const s = nodeStatus(n.id);
                      return (
                        <View
                          key={n.id}
                          style={[
                            styles.progressDot,
                            {
                              backgroundColor:
                                s === "done"
                                  ? chapter.color
                                  : s === "active"
                                  ? chapter.color + "60"
                                  : colors.track,
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                </View>
              </LinearGradient>

              {/* Nodes + Connectors */}
              <View style={styles.nodesWrap}>
                {chapter.nodes.map((node, idx) => {
                  const status = nodeStatus(node.id);
                  const isLeft = idx % 2 === 0;
                  const next = chapter.nodes[idx + 1];
                  const nextIsLeft = (idx + 1) % 2 === 0;
                  const connDone = next
                    ? nodeStatus(next.id) !== "locked"
                    : false;

                  return (
                    <View key={node.id}>
                      {status === "active" && (
                        <View
                          style={[
                            styles.hereRow,
                            {
                              justifyContent: isLeft
                                ? "flex-start"
                                : "flex-end",
                            },
                          ]}
                        >
                          <View style={styles.herePad}>
                            <View
                              style={[
                                styles.hereBubble,
                                { backgroundColor: chapter.color },
                              ]}
                            >
                              <Mascot type={settings.mascot} size={26} />
                              <Text style={[styles.hereText, { fontSize: fs(12) }]}>
                                Ты здесь!
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.hereTail,
                                {
                                  borderTopColor: chapter.color,
                                  alignSelf: isLeft ? "flex-start" : "flex-end",
                                  marginLeft: isLeft ? 16 : 0,
                                  marginRight: isLeft ? 0 : 16,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      )}

                      <View
                        style={[
                          styles.nodeRow,
                          {
                            justifyContent: isLeft
                              ? "flex-start"
                              : "flex-end",
                          },
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

                      {next && (
                        <BezierConnector
                          fromLeft={isLeft}
                          toLeft={nextIsLeft}
                          done={connDone}
                          color={chapter.color}
                          trackColor={colors.border}
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
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  overallBadge: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  overallText: { fontWeight: "800", fontFamily: "Inter_700Bold" },
  overallSub: { marginTop: 1 },

  content: { paddingHorizontal: CONTENT_PAD, paddingTop: 4, gap: 4 },

  chapterSection: { marginBottom: 20 },

  chapterBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  chapterIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterInfo: {
    flex: 1,
    minWidth: 0,
  },
  chapterName: {
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  chapterDesc: { marginTop: 2 },
  chapterRight: {
    width: 76,
    alignItems: "flex-end",
    gap: 6,
  },
  chapterPct: { fontWeight: "800", fontFamily: "Inter_700Bold" },
  progressBarWrap: {},
  progressDots: {
    maxWidth: 76,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 3,
  },
  progressDot: { width: 6, height: 6, borderRadius: 3 },

  nodesWrap: {},

  hereRow: {
    flexDirection: "row",
    paddingHorizontal: NODE_PAD,
    marginBottom: 6,
  },
  herePad: {},
  hereBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  hereText: {
    color: "white",
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  hereTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },

  nodeRow: {
    flexDirection: "row",
    paddingHorizontal: NODE_PAD,
  },
});
