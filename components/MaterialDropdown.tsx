import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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

  const items = useMemo(
    () =>
      materials.map((material) => ({
        label: material.name,
        value: material.name,
      })),
    [],
  );

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
        Material
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: value ? theme.text : theme.placeholder,
            fontSize: 15,
          }}
        >
          {value || "Select Material"}
        </Text>

        <Text style={{ color: theme.text, fontSize: 14 }}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Pressable
            style={{
              backgroundColor: theme.card,
              borderRadius: 14,
              maxHeight: 400,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: theme.text,
                }}
              >
                Select Material
              </Text>
            </View>

            <ScrollView>
              {items.map((item) => {
                const selected = value === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.7}
                    onPress={() => {
                      setValue(item.value);
                      setOpen(false);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                      backgroundColor: selected
                        ? theme.primary + "20"
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.text,
                        fontSize: 15,
                        fontWeight: selected ? "700" : "400",
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}