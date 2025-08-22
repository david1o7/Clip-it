import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";

const GALLERY_KEY = 'GALLERY_PHOTOS_URIS';

const numColumns = 2; // number of images per row
const screenWidth = Dimensions.get("window").width;

export default function GalleryScreen() {
  const [uris, setUris] = useState<string[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          const existing = await AsyncStorage.getItem(GALLERY_KEY);
          const list: string[] = existing ? JSON.parse(existing) : [];
          if (mounted) setUris(list);
        } catch (e) {
          console.warn('Failed to load gallery photos', e);
          if (mounted) setUris([]);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {uris.length === 0 ? (
        <View style={styles.emptyState}>
          <Text>No photos yet. Take some in the Camera tab.</Text>
        </View>
      ) : (
        <FlatList
          data={uris}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={numColumns}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => { setViewerIndex(index); setViewerVisible(true); }}>
              <Image source={{ uri: item }} style={styles.image} />
            </Pressable>
          )}
        />
      )}
      <ImageViewing
        images={uris.map((u) => ({ uri: u }))}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        presentationStyle="fullScreen"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 4,
  },
  image: {
    width: screenWidth / numColumns - 8, // dynamic width
    height: screenWidth / numColumns - 8, // square images
    margin: 4,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
