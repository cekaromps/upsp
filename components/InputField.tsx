import React from "react";

import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  useColorScheme,
} from "react-native";

import { Colors } from "../constants/Colors";

type Props = {
  label: string;
  value: string;

  onChangeText?: (text: string) => void;

  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;

  editable?: boolean;
};

export default function InputField({
  label,
  value,
  onChangeText,

  placeholder,
  keyboardType = "default",

  editable = true,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          marginBottom: 6,
          fontSize: 15,
          fontWeight: "600",
          color: theme.text,
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}

        placeholder={placeholder ?? label}
        placeholderTextColor={theme.placeholder}

        keyboardType={keyboardType}

        style={{
          borderWidth: 1,
          borderColor: theme.border,

          backgroundColor: editable
            ? theme.card
            : colorScheme === "dark"
            ? "#2a2a2a"
            : "#e5e5e5",

          color: theme.text,

          borderRadius: 12,

          paddingHorizontal: 14,
          paddingVertical: 12,

          fontSize: 16,

          opacity: editable ? 1 : 0.8,
        }}
      />
    </View>
  );
}