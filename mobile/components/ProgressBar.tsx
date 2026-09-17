import { StyleSheet, Text, View } from "react-native";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const ratio = Math.min(Math.max(current / safeTotal, 0), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        Question {Math.min(current, total)} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D7E2DC",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#0B3D2E",
  },
  label: {
    fontSize: 13,
    color: "#6A7B73",
    fontWeight: "600",
  },
});
