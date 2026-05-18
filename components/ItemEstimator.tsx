import { useState, useEffect } from "react";
import { Text, Pressable, useColorScheme, View } from "react-native";

import { Colors } from "../constants/Colors";

import InputField from "./InputField";
import MaterialDropdown from "./MaterialDropdown";

import { materials } from "../data/materials";

import {
  calculateVolume,
  calculateWeight,
  calculateCost,
  calculateProcessCost,
  totalPrice,
} from "../utils/calculations";

type Props = {
  index: number;
  onTotalChange: (index: number, total: number) => void;
  onRemove?: () => void;
};

export default function ItemEstimator({
  index,
  onTotalChange,
  onRemove,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [name, setName] = useState("");
  const [material, setMaterial] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");

  const [qty, setQty] = useState("");

  const [milling, setMilling] = useState("");
  const [turning, setTurning] = useState("");
  const [grinding, setGrinding] = useState("");
  const [edm, setEdm] = useState("");
  const [wireCut, setWireCut] = useState("");
  const [hardening, setHardening] = useState("");
  const [plating, setPlating] = useState("");
  const [others, setOthers] = useState("");

  const selectedMaterial = materials.find((m) => m.name === material);

  const volume = calculateVolume(
    Number(length),
    Number(width),
    Number(thickness),
  );

  const weight = calculateWeight(volume, selectedMaterial?.density ?? 0);

  const materialCost = calculateCost(weight, selectedMaterial?.price ?? 0);

  const processCost = calculateProcessCost(
    Number(milling),
    Number(turning),
    Number(grinding),
    Number(edm),
    Number(wireCut),
    Number(hardening),
    Number(plating),
    Number(others),
  );

  const total = totalPrice(materialCost, processCost, Number(qty));

  const salePrice = total * 1.5;

  const idr = salePrice * 13758;

  const formatSGD = (value: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    onTotalChange(index, {
      name,
      material,
      length: Number(length),
      width: Number(width),
      thickness: Number(thickness),
      density: selectedMaterial?.density ?? 0,
      qty: Number(qty),
      volume,
      weight,
      materialCost,
      processCost,
      totalPrice: total,
      salePrice,
      idr,
      processes: {
        milling: Number(milling) || undefined,
        turning: Number(turning) || undefined,
        grinding: Number(grinding) || undefined,
        edm: Number(edm) || undefined,
        wireCut: Number(wireCut) || undefined,
        hardening: Number(hardening) || undefined,
        plating: Number(plating) || undefined,
        others: Number(others) || undefined,
      },
    } as any);
  }, [
    idr,
    name,
    material,
    length,
    width,
    thickness,
    qty,
    milling,
    turning,
    grinding,
    edm,
    wireCut,
    hardening,
    plating,
    others,
  ]);

  return (
    <View
      style={{
        marginBottom: 32,
        padding: 18,

        borderWidth: 1,
        borderColor: theme.border,

        borderRadius: 18,
        backgroundColor: theme.card,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Item {index + 1}
        </Text>
        {onRemove && (
          <Pressable
            onPress={onRemove}
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#fee2e2" : "#fef2f2",
              borderRadius: 10,
              paddingVertical: 3,
              justifyContent: "center",
              paddingHorizontal: 12,
            })}
          >
            <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "600" }}>
              Remove
            </Text>
          </Pressable>
        )}
      </View>
      <InputField label="Nama" value={name} onChangeText={setName} />

      <MaterialDropdown value={material} setValue={setMaterial} />

      <SectionTitle title="Dimensions" />

      <InputField
        label="Length (mm)"
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
      />

      <InputField
        label="Width (mm)"
        value={width}
        onChangeText={setWidth}
        keyboardType="numeric"
      />

      <InputField
        label="Thickness (mm)"
        value={thickness}
        onChangeText={setThickness}
        keyboardType="numeric"
      />

      <SectionTitle title="Properties" />

      <InputField
        label="Density"
        value={selectedMaterial ? selectedMaterial.density.toString() : ""}
        editable={false}
      />

      <InputField
        label="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
      />

      <SectionTitle title="Processes" />

      <InputField
        label="Milling"
        value={milling}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setMilling(formattedText);
        }}
        keyboardType="decimal-pad"
      />

      <InputField
        label="Turning"
        value={turning}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setTurning(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="Grinding"
        value={grinding}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setGrinding(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="EDM"
        value={edm}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setEdm(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="Wire Cut"
        value={wireCut}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setWireCut(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="Hardening"
        value={hardening}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setHardening(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="Plating"
        value={plating}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setPlating(formattedText);
        }}
        keyboardType="numeric"
      />

      <InputField
        label="Others"
        value={others}
        onChangeText={(text) => {
          const formattedText = text.replace(",", ".");
          setOthers(formattedText);
        }}
        keyboardType="numeric"
      />

      <SectionTitle title="Result" />

      <InputField label="Volume" editable={false} value={volume.toFixed(2)} />

      <InputField label="Weight" editable={false} value={weight.toFixed(2)} />

      <InputField
        label="Material Cost"
        editable={false}
        value={formatSGD(materialCost)}
      />

      <InputField
        label="Process Cost"
        editable={false}
        value={formatSGD(processCost)}
      />

      <InputField
        label="Total Price"
        editable={false}
        value={formatSGD(total)}
      />

      <InputField
        label="Sale Price"
        editable={false}
        value={formatSGD(salePrice)}
      />

      <InputField label="IDR" editable={false} value={formatIDR(idr)} />
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        marginTop: 16,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: theme.text,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
