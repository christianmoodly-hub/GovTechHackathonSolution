import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function OptionButton({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#C9D5CF",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selected: {
    borderColor: "#0B3D2E",
    backgroundColor: "#E7F2EC",
  },
  label: {
    fontSize: 15,
    lineHeight: 21,
    color: "#10231C",
  },
  labelSelected: {
    fontWeight: "700",
    color: "#0B3D2E",
  },
});
