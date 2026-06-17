import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Ellipse, Path, Rect, G } from "react-native-svg";

export type MascotType = "penguin" | "raccoon" | "bear";

interface MascotProps {
  type?: MascotType;
  size?: number;
  animated?: boolean;
}

function PenguinSVG({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 100 120" width={size} height={size}>
      {/* Drop shadow */}
      <Ellipse cx="50" cy="118" rx="24" ry="4" fill="#000" fillOpacity={0.13} />

      {/* Body */}
      <Ellipse cx="50" cy="87" rx="27" ry="31" fill="#1a2744" />

      {/* Belly */}
      <Ellipse cx="50" cy="92" rx="16" ry="22" fill="#dbeafe" />

      {/* Left wing */}
      <Ellipse
        cx="19" cy="85" rx="8.5" ry="17"
        fill="#121e33"
        transform="rotate(-22, 19, 85)"
      />
      {/* Right wing */}
      <Ellipse
        cx="81" cy="85" rx="8.5" ry="17"
        fill="#121e33"
        transform="rotate(22, 81, 85)"
      />

      {/* Head */}
      <Circle cx="50" cy="38" r="27" fill="#1a2744" />

      {/* Scarf — fun detail */}
      <Ellipse cx="50" cy="64" rx="20" ry="5.5" fill="#ef4444" />
      <Ellipse cx="50" cy="64" rx="20" ry="5.5" fill="none" stroke="#b91c1c" strokeWidth="0.8" />
      <Rect x="47" y="62" width="6" height="9" rx="2" fill="#ef4444" />
      <Rect x="47.5" y="62.5" width="5" height="8" rx="1.5" fill="#dc2626" />

      {/* Left eye white */}
      <Circle cx="37" cy="33" r="10.5" fill="white" />
      {/* Right eye white */}
      <Circle cx="63" cy="33" r="10.5" fill="white" />

      {/* Left pupil (slightly inward = cute cross-eyed) */}
      <Circle cx="40" cy="35" r="6.2" fill="#0d1117" />
      {/* Right pupil */}
      <Circle cx="60" cy="35" r="6.2" fill="#0d1117" />

      {/* Left eye shine */}
      <Circle cx="38" cy="31.5" r="2.8" fill="white" />
      {/* Right eye shine */}
      <Circle cx="58" cy="31.5" r="2.8" fill="white" />

      {/* Left cheek blush */}
      <Ellipse cx="29" cy="45" rx="7.5" ry="5.5" fill="#fda4af" fillOpacity={0.8} />
      {/* Right cheek blush */}
      <Ellipse cx="71" cy="45" rx="7.5" ry="5.5" fill="#fda4af" fillOpacity={0.8} />

      {/* Beak */}
      <Ellipse cx="50" cy="49" rx="9" ry="5.5" fill="#f59e0b" />
      <Ellipse cx="50" cy="50.5" rx="7" ry="3" fill="#d97706" />

      {/* Smile */}
      <Path
        d="M 43 57 Q 50 64 57 57"
        stroke="#dbeafe"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left foot */}
      <Ellipse cx="37" cy="116" rx="12" ry="5" fill="#f59e0b" />
      {/* Right foot */}
      <Ellipse cx="63" cy="116" rx="12" ry="5" fill="#f59e0b" />
    </Svg>
  );
}

function RaccoonSVG({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 100 120" width={size} height={size}>
      {/* Shadow */}
      <Ellipse cx="50" cy="118" rx="24" ry="4" fill="#000" fillOpacity={0.13} />

      {/* Tail behind body */}
      <Ellipse
        cx="80" cy="92" rx="8" ry="21"
        fill="#9ca3af"
        transform="rotate(12, 80, 92)"
      />
      <Ellipse
        cx="82" cy="81" rx="5" ry="6.5"
        fill="#374151"
        transform="rotate(12, 82, 81)"
      />
      <Ellipse
        cx="81" cy="93" rx="5" ry="6"
        fill="#374151"
        transform="rotate(12, 81, 93)"
      />
      <Ellipse
        cx="80" cy="104" rx="4.5" ry="5.5"
        fill="#374151"
        transform="rotate(12, 80, 104)"
      />

      {/* Body */}
      <Ellipse cx="50" cy="87" rx="26" ry="30" fill="#9ca3af" />
      {/* Belly */}
      <Ellipse cx="50" cy="92" rx="15" ry="21" fill="#f3f4f6" />

      {/* Left arm */}
      <Ellipse
        cx="20" cy="86" rx="7.5" ry="16"
        fill="#9ca3af"
        transform="rotate(-15, 20, 86)"
      />
      {/* Right arm */}
      <Ellipse
        cx="80" cy="86" rx="7.5" ry="16"
        fill="#9ca3af"
        transform="rotate(15, 80, 86)"
      />

      {/* Head */}
      <Ellipse cx="50" cy="39" rx="27" ry="27" fill="#9ca3af" />

      {/* Left ear */}
      <Ellipse cx="29" cy="16" rx="10.5" ry="13" fill="#9ca3af" />
      {/* Right ear */}
      <Ellipse cx="71" cy="16" rx="10.5" ry="13" fill="#9ca3af" />
      {/* Left ear inner */}
      <Ellipse cx="29" cy="17" rx="6" ry="8" fill="#ede9fe" />
      {/* Right ear inner */}
      <Ellipse cx="71" cy="17" rx="6" ry="8" fill="#ede9fe" />

      {/* Eye mask */}
      <Rect x="22" y="26" width="56" height="20" rx="10" fill="#374151" />

      {/* Left eye white */}
      <Circle cx="37" cy="35" r="9.5" fill="white" />
      {/* Right eye white */}
      <Circle cx="63" cy="35" r="9.5" fill="white" />

      {/* Left pupil */}
      <Circle cx="40" cy="37" r="5.8" fill="#0d1117" />
      {/* Right pupil */}
      <Circle cx="60" cy="37" r="5.8" fill="#0d1117" />

      {/* Left eye shine */}
      <Circle cx="38" cy="33.5" r="2.6" fill="white" />
      {/* Right eye shine */}
      <Circle cx="58" cy="33.5" r="2.6" fill="white" />

      {/* Snout */}
      <Ellipse cx="50" cy="51" rx="13.5" ry="9.5" fill="#d1d5db" />

      {/* Nose */}
      <Ellipse cx="50" cy="46.5" rx="5.5" ry="4" fill="#374151" />
      {/* Nose shine */}
      <Ellipse cx="48.5" cy="45.5" rx="1.8" ry="1.3" fill="#6b7280" />

      {/* Left cheek */}
      <Ellipse cx="28" cy="52" rx="7.5" ry="5.5" fill="#fda4af" fillOpacity={0.7} />
      {/* Right cheek */}
      <Ellipse cx="72" cy="52" rx="7.5" ry="5.5" fill="#fda4af" fillOpacity={0.7} />

      {/* Smile */}
      <Path
        d="M 43 58 Q 50 65 57 58"
        stroke="#9ca3af"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left foot */}
      <Ellipse cx="38" cy="115" rx="11.5" ry="5" fill="#6b7280" />
      {/* Right foot */}
      <Ellipse cx="62" cy="115" rx="11.5" ry="5" fill="#6b7280" />
    </Svg>
  );
}

function BearSVG({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 100 120" width={size} height={size}>
      {/* Shadow */}
      <Ellipse cx="50" cy="118" rx="24" ry="4" fill="#000" fillOpacity={0.13} />

      {/* Body */}
      <Ellipse cx="50" cy="87" rx="28" ry="32" fill="#c2722a" />
      {/* Belly */}
      <Ellipse cx="50" cy="92" rx="17" ry="23" fill="#fde68a" />

      {/* Left arm */}
      <Ellipse
        cx="18" cy="87" rx="9" ry="18"
        fill="#b86020"
        transform="rotate(-18, 18, 87)"
      />
      {/* Right arm */}
      <Ellipse
        cx="82" cy="87" rx="9" ry="18"
        fill="#b86020"
        transform="rotate(18, 82, 87)"
      />

      {/* Head */}
      <Circle cx="50" cy="39" r="28" fill="#c2722a" />

      {/* Left ear */}
      <Circle cx="26" cy="16" r="13" fill="#c2722a" />
      {/* Right ear */}
      <Circle cx="74" cy="16" r="13" fill="#c2722a" />
      {/* Left ear inner */}
      <Circle cx="26" cy="17" r="8" fill="#fca5a5" />
      {/* Right ear inner */}
      <Circle cx="74" cy="17" r="8" fill="#fca5a5" />

      {/* Muzzle area */}
      <Ellipse cx="50" cy="52" rx="15" ry="11" fill="#e8a05a" />

      {/* Left eye white */}
      <Circle cx="35" cy="33" r="10" fill="white" />
      {/* Right eye white */}
      <Circle cx="65" cy="33" r="10" fill="white" />

      {/* Left pupil */}
      <Circle cx="38" cy="35" r="6" fill="#1c0a00" />
      {/* Right pupil */}
      <Circle cx="62" cy="35" r="6" fill="#1c0a00" />

      {/* Left eye shine */}
      <Circle cx="36" cy="32" r="2.8" fill="white" />
      {/* Right eye shine */}
      <Circle cx="60" cy="32" r="2.8" fill="white" />

      {/* Honey jar — fun accessory */}
      <Rect x="60" y="95" width="14" height="16" rx="3" fill="#fbbf24" />
      <Rect x="60" y="93" width="14" height="5" rx="2" fill="#f59e0b" />
      <Ellipse cx="67" cy="103" rx="3.5" ry="2.5" fill="#d97706" />

      {/* Nose */}
      <Ellipse cx="50" cy="47.5" rx="6" ry="4.5" fill="#7c2d12" />
      {/* Nose shine */}
      <Ellipse cx="48.5" cy="46.5" rx="2" ry="1.4" fill="#a16207" />

      {/* Left cheek */}
      <Ellipse cx="28" cy="48" rx="8" ry="6" fill="#fda4af" fillOpacity={0.72} />
      {/* Right cheek */}
      <Ellipse cx="72" cy="48" rx="8" ry="6" fill="#fda4af" fillOpacity={0.72} />

      {/* Smile */}
      <Path
        d="M 43 58 Q 50 66 57 58"
        stroke="#c2722a"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left foot */}
      <Ellipse cx="37" cy="116" rx="13" ry="5.5" fill="#a0541e" />
      {/* Right foot */}
      <Ellipse cx="63" cy="116" rx="13" ry="5.5" fill="#a0541e" />
    </Svg>
  );
}

export default function Mascot({
  type = "penguin",
  size = 80,
  animated = false,
}: MascotProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [animated]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const svg =
    type === "raccoon" ? (
      <RaccoonSVG size={size} />
    ) : type === "bear" ? (
      <BearSVG size={size} />
    ) : (
      <PenguinSVG size={size} />
    );

  if (!animated) return svg;
  return <Animated.View style={animStyle}>{svg}</Animated.View>;
}
