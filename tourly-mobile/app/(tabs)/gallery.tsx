import { Text, View, FlatList, Pressable, Modal, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { galleryImages, GalleryImage } from "@/data/gallery";

const { width, height } = Dimensions.get("window");
const imageSize = (width - 48) / 2;

export default function GalleryScreen() {
  const colors = useColors();
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
    <ScreenContainer className="px-4">
      <View className="pt-4 pb-2">
        <Text 
          className="text-sm font-semibold uppercase" 
          style={{ color: colors.primary }}
        >
          Photo Gallery
        </Text>
        <Text 
          className="text-2xl font-bold mt-1" 
          style={{ color: colors.foreground }}
        >
          Photos From Travellers
        </Text>
        <Text 
          className="text-sm mt-2" 
          style={{ color: colors.muted }}
        >
          Explore beautiful moments captured by our travelers around the world.
        </Text>
      </View>

      <FlatList
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
                top: 60, 
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
