import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "./constants/Colors";
import ItemEstimator from "./components/ItemEstimator";
import { generateAndShareQuotePDF, QuoteItem } from "./utils/generateQuotePDF";

export default function App() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [itemIds, setItemIds] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);

  const [itemData, setItemData] = useState<Record<number, QuoteItem>>({});

  const [totals, setTotals] = useState<Record<number, number>>({});

  const [generating, setGenerating] = useState(false);

  function addItem() {
    setItemIds((prev) => [...prev, nextId]);
    setNextId((n) => n + 1);
  }

  function removeItem(id: number) {
    Alert.alert("Remove item", "Remove this item from the quote?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setItemIds((prev) => prev.filter((i) => i !== id));
          setItemData((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          setTotals((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
      },
    ]);
  }

  // Called by ItemEstimator on every change.
  // We accept either the old (index, number) signature or the new
  // (index, QuoteItem) signature so ItemEstimator changes are optional.
  const handleItemChange = useCallback(
    (id: number, dataOrTotal: QuoteItem | number) => {
      if (typeof dataOrTotal === "number") {
        // Legacy path — ItemEstimator not yet updated
        setTotals((prev) => ({ ...prev, [id]: dataOrTotal }));
      } else {
        // Full data path
        setItemData((prev) => ({ ...prev, [id]: dataOrTotal }));
        setTotals((prev) => ({ ...prev, [id]: dataOrTotal.idr }));
      }
    },
    [],
  );

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  const fmtIDR = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v);

  async function handleGeneratePDF() {
    const items = itemIds
      .map((id) => itemData[id])
      .filter((d): d is QuoteItem => Boolean(d));

    if (items.length === 0) {
      Alert.alert(
        "No data",
        "Fill in at least one item before generating a quote.",
      );
      return;
    }

    try {
      setGenerating(true);
      await generateAndShareQuotePDF(items, {
        companyName: "UPS Price Estimator",
        quoteNumber: `Q-${Date.now()}`,
      });
    } catch (e) {
      Alert.alert("PDF Error", String(e));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={{ flex: 1, backgroundColor: theme.background }}
      >
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: 32,
              fontWeight: "700",
              marginBottom: 24,
            }}
          >
            UPS Price Estimator
          </Text>

          {itemIds.map((id, displayIndex) => (
            <ItemEstimator
              key={id}
              index={displayIndex}
              onTotalChange={(_, value) => handleItemChange(id, value)}
              onRemove={itemIds.length > 1 ? () => removeItem(id) : undefined}
            />
          ))}

          <Pressable
            onPress={addItem}
            style={({ pressed }) => ({
              marginTop: 12,
              paddingVertical: 16,
              borderRadius: 14,
              backgroundColor: theme.text,
              alignItems: "center",
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text
              style={{
                color: theme.background,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              + Add Item
            </Text>
          </Pressable>
        </ScrollView>

        {/* ── Fixed footer ── */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            paddingBottom: 28,
            gap: 12,
            borderTopWidth: 1,
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          {/* Grand total */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: theme.text,
                fontSize: 13,
                marginBottom: 2,
                opacity: 0.6,
              }}
            >
              Grand Total
            </Text>
            <Text
              style={{ color: theme.text, fontSize: 24, fontWeight: "700" }}
            >
              {fmtIDR(grandTotal)}
            </Text>
            <Text
              style={{
                color: theme.text,
                fontSize: 11,
                opacity: 0.4,
                marginTop: 1,
              }}
            >
              {itemIds.length} item{itemIds.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* PDF button */}
          <Pressable
            onPress={handleGeneratePDF}
            disabled={generating}
            style={({ pressed }) => ({
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 14,
              backgroundColor: generating ? theme.border : theme.text,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 88,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            {generating ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text
                style={{
                  color: theme.background,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                PDF
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
