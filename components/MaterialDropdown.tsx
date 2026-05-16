import React, { useState } from "react";

import { View, Text, useColorScheme } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import { Colors } from "../constants/Colors";
import { materials } from "../data/materials";

type Props = {
  value: string | null;
  setValue: (value: string | null) => void;
};

export default function MaterialDropdown({ value, setValue }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState(
    materials.map((material) => ({
      label: material.name,
      value: material.name,
    })),
  );

  return (
    <View
      style={{
        marginBottom: open ? 160 : 16,
        zIndex: 1000,
      }}
    >
      <Text
        style={{
          marginBottom: 6,
          fontSize: 15,
          fontWeight: "600",
          color: theme.text,
        }}
      >
        Material
      </Text>

      <DropDownPicker
        listMode="SCROLLVIEW"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(value);
          setValue(newValue);
        }}
        setItems={setItems}
        placeholder="Select Material"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.card,
        }}
        dropDownContainerStyle={{
          borderColor: theme.border,
          backgroundColor: theme.card,
        }}
        textStyle={{
          color: theme.text,
        }}
        placeholderStyle={{
          color: theme.placeholder,
        }}
        ArrowDownIconComponent={() => (
          <Text style={{ color: theme.text }}>▼</Text>
        )}
        ArrowUpIconComponent={() => (
          <Text style={{ color: theme.text }}>▲</Text>
        )}
      />
    </View>
  );
}
