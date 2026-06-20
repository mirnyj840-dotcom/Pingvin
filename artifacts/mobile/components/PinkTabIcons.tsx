import React from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Circle,
  Ellipse,
  Polygon,
  Rect,
  G,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from "react-native-svg";

const ACTIVE = "#FF7EB6";
const INACTIVE = "#DDB0C8";
const HEART_FILL = "#FF5BA3";
const SHADOW = "#FFB3D1";

function Heart({ cx, cy, size = 5, color = HEART_FILL }: { cx: number; cy: number; size?: number; color?: string }) {
  const s = size;
  return (
    <Path
      d={`M${cx},${cy + s * 0.3} C${cx},${cy} ${cx - s},${cy} ${cx - s},${cy + s * 0.5} C${cx - s},${cy + s * 1.1} ${cx},${cy + s * 1.5} ${cx},${cy + s * 1.8} C${cx},${cy + s * 1.5} ${cx + s},${cy + s * 1.1} ${cx + s},${cy + s * 0.5} C${cx + s},${cy} ${cx},${cy} ${cx},${cy + s * 0.3}`}
      fill={color}
    />
  );
}

function Sparkle({ cx, cy, size = 4, color = "#FFD6E7" }: { cx: number; cy: number; size?: number; color?: string }) {
  return (
    <G>
      <Path d={`M${cx},${cy - size} L${cx + 1.2},${cy - 1.2} L${cx + size},${cy} L${cx + 1.2},${cy + 1.2} L${cx},${cy + size} L${cx - 1.2},${cy + 1.2} L${cx - size},${cy} L${cx - 1.2},${cy - 1.2} Z`} fill={color} />
    </G>
  );
}

export function PinkHomeIcon({ active }: { active: boolean }) {
  const fill = active ? ACTIVE : INACTIVE;
  const accent = active ? HEART_FILL : "#E8C0D4";
  return (
    <View style={{ width: 28, height: 28 }}>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        {/* Roof */}
        <Path d="M14 3 L26 14 L22 14 L22 24 Q22 25.5 20.5 25.5 L16 25.5 L16 19 Q16 17.5 14 17.5 Q12 17.5 12 19 L12 25.5 L7.5 25.5 Q6 25.5 6 24 L6 14 L2 14 Z" fill={fill} />
        {/* Chimney */}
        <Rect x="18" y="4" width="3" height="5.5" rx="1" fill={accent} />
        {/* Door arch */}
        <Rect x="12" y="19" width="4" height="6.5" rx="2" fill={active ? "#FF9DCE" : "#E0B8CC"} />
        {/* Heart on roof */}
        {active && (
          <G>
            <Path d="M14,10 C14,9 12.5,9 12.5,10.3 C12.5,11.4 14,12.5 14,12.5 C14,12.5 15.5,11.4 15.5,10.3 C15.5,9 14,9 14,10 Z" fill="white" opacity={0.9} />
          </G>
        )}
        {/* Sparkle top-right */}
        {active && <Sparkle cx={24} cy={5} size={3} color="#FFD6E7" />}
      </Svg>
    </View>
  );
}

export function PinkPathIcon({ active }: { active: boolean }) {
  const fill = active ? ACTIVE : INACTIVE;
  const accent = active ? HEART_FILL : "#E8C0D4";
  const light = active ? "#FFD6E7" : "#E8C0D4";
  return (
    <View style={{ width: 28, height: 28 }}>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        {/* Backpack body */}
        <Rect x="6" y="10" width="16" height="15" rx="4" fill={fill} />
        {/* Backpack top flap */}
        <Rect x="8" y="7" width="12" height="6" rx="3" fill={accent} />
        {/* Strap loop */}
        <Path d="M10 7 Q14 3 18 7" stroke={light} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Pocket */}
        <Rect x="9" y="17" width="10" height="5.5" rx="2.5" fill={active ? "#FF9DCE" : "#DDB0C8"} />
        {/* Heart on pocket */}
        <Path d="M14,19.5 C14,18.8 13,18.8 13,19.6 C13,20.3 14,21 14,21 C14,21 15,20.3 15,19.6 C15,18.8 14,18.8 14,19.5 Z" fill={active ? "white" : "#E8C0D4"} opacity={0.9} />
        {/* Sparkle */}
        {active && <Sparkle cx={24} cy={8} size={3} color="#FFD6E7" />}
        {active && <Sparkle cx={4} cy={12} size={2} color="#FFB3D1" />}
      </Svg>
    </View>
  );
}

export function PinkProfileIcon({ active }: { active: boolean }) {
  const fill = active ? ACTIVE : INACTIVE;
  const accent = active ? HEART_FILL : "#E8C0D4";
  return (
    <View style={{ width: 28, height: 28 }}>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        {/* Head */}
        <Circle cx="14" cy="9" r="6" fill={fill} />
        {/* Cheeks */}
        {active && <Ellipse cx="10.5" cy="10.5" rx="2.2" ry="1.4" fill={accent} opacity={0.5} />}
        {active && <Ellipse cx="17.5" cy="10.5" rx="2.2" ry="1.4" fill={accent} opacity={0.5} />}
        {/* Body */}
        <Path d="M4 26 Q4 18 14 18 Q24 18 24 26 Z" fill={fill} />
        {/* Heart badge */}
        <Circle cx="20" cy="21" r="4" fill={active ? "#FFD6E7" : "#E8C0D4"} />
        <Path d="M20,20.5 C20,19.8 19,19.8 19,20.6 C19,21.3 20,22 20,22 C20,22 21,21.3 21,20.6 C21,19.8 20,19.8 20,20.5 Z" fill={accent} />
        {/* Sparkle */}
        {active && <Sparkle cx={5} cy={7} size={3} color="#FFD6E7" />}
      </Svg>
    </View>
  );
}

export function PinkSettingsIcon({ active }: { active: boolean }) {
  const fill = active ? ACTIVE : INACTIVE;
  const accent = active ? HEART_FILL : "#E8C0D4";
  const bg = active ? "#FFD6E7" : "#E8C0D4";
  return (
    <View style={{ width: 28, height: 28 }}>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        {/* Gear outer ring via polygon approximation */}
        <Path
          d="M14,3 L15.8,6.2 L19.4,5.2 L19.8,9 L23.4,10.2 L21.6,13.5 L24,16.5 L20.7,18.4 L20.5,22.2 L16.8,21.7 L14.5,24.8 L12.2,21.7 L8.5,22.2 L8.3,18.4 L5,16.5 L7.4,13.5 L5.6,10.2 L9.2,9 L9.6,5.2 L13.2,6.2 Z"
          fill={fill}
        />
        {/* Inner circle */}
        <Circle cx="14" cy="14" r="5.5" fill={bg} />
        {/* Heart in center */}
        <Path d="M14,13 C14,12 12.2,12 12.2,13.5 C12.2,14.8 14,16 14,16 C14,16 15.8,14.8 15.8,13.5 C15.8,12 14,12 14,13 Z" fill={accent} />
        {/* Sparkle */}
        {active && <Sparkle cx={24} cy={5} size={3} color="#FFD6E7" />}
        {active && <Sparkle cx={4} cy={23} size={2.5} color="#FFB3D1" />}
      </Svg>
    </View>
  );
}
