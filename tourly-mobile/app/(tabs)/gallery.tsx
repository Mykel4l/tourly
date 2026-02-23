import { Text, View, FlatList, Pressable, Modal, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/lib/i18n";
import { galleryImages, GalleryImage } from "@/data/gallery";
import { TopNavBar } from "@/components/top-nav-bar";

export default function GalleryScreen() {
  const colors = useColors();
  const { width, height } = useWindowDimensions();
  const imageSize = (width - 48) / 2;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleImagePress = (image: GalleryImage) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const renderImage = ({ item, index }: { item: GalleryImage; index: number }) => {
    // Make first image larger
    const isLarge = index === 0;
    const itemWidth = isLarge ? width - 32 : imageSize;
    const itemHeight = isLarge ? 220 : imageSize;

    return (
      <Pressable
        onPress={() => handleImagePress(item)}
        style={({ pressed }) => [
          { 
            width: itemWidth, 
            height: itemHeight, 
            borderRadius: 16, 
            overflow: "hidden",
            marginBottom: 16,
          },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="px-4" edges={["left", "right"]}>
      <TopNavBar title={t.photosFromTravellers} />

      <FlatList
        style={{ flex: 1 }}
        data={galleryImages}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
      />

      {/* Full Screen Image Viewer */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black">
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              { 
                position: "absolute", 
                top: insets.top + 16, 
                right: 20, 
                zIndex: 10,
                padding: 8,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 50,
              },
              pressed && { opacity: 0.7 }
            ]}
          >
            <IconSymbol name="xmark" size={24} color="white" />
          </Pressable>
          
          {selectedImage && (
            <View className="flex-1 justify-center items-center">
              <Image
                source={selectedImage.image}
                style={{ width: width, height: height * 0.7 }}
                contentFit="contain"
              />
            </View>
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}
