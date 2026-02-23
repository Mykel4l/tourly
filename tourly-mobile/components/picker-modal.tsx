import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.55;
const DRAG_DISMISS_THRESHOLD = 100;

export interface PickerOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface PickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function PickerModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: PickerModalProps) {
  const colors = useColors();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const lastY = useRef(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      translateY.setValue(SHEET_HEIGHT);
    }
  }, [visible, translateY]);

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderGrant: () => {
        lastY.current = 0;
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > DRAG_DISMISS_THRESHOLD || gs.vy > 0.5) {
          dismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={dismiss}
      />

      {/* Sheet */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SHEET_HEIGHT,
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [{ translateY }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 20,
        }}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={{ paddingTop: 12, paddingBottom: 4, alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
            }}
          />
        </View>

        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "700" }}>
            {title}
          </Text>
          <Pressable
            onPress={dismiss}
            hitSlop={12}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="xmark" size={20} color={colors.muted} />
          </Pressable>
        </View>

        {/* Options */}
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item, index }) => {
            const isSelected = item.value === selectedValue;
            return (
              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  onSelect(item.value);
                  dismiss();
                }}
                style={({ pressed }) => [
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                    borderBottomColor: colors.border,
                    backgroundColor: isSelected
                      ? colors.primary + "10"
                      : "transparent",
                  },
                  pressed && { backgroundColor: colors.border + "40" },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: isSelected ? colors.primary : colors.foreground,
                      fontSize: 15,
                      fontWeight: isSelected ? "700" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.sublabel ? (
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                      {item.sublabel}
                    </Text>
                  ) : null}
                </View>
                {isSelected && (
                  <IconSymbol name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            );
          }}
        />
      </Animated.View>
    </Modal>
  );
}
