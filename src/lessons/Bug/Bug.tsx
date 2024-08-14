import React, { useState } from "react";
import { Text, View } from "react-native";
import MapView, { MapMarker } from "react-native-maps";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

type Marker = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

const markers: Marker[] = [
  { id: 0, name: "marker1", latitude: 50.0647, longitude: 19.945 },
  { id: 1, name: "marker2", latitude: 50.0579, longitude: 19.9378 },
  { id: 2, name: "marker3", latitude: 50.0651, longitude: 19.9291 },
];

export function Bug() {
  const [focusedMarker, setFocusedMarker] = useState<Marker>();

  return (
    <>
      <MapView style={{ flex: 1 }} onPanDrag={() => setFocusedMarker(null)}>
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            onPress={() => setFocusedMarker(marker)}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        ))}
      </MapView>
      {focusedMarker && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            padding: 40,
            width: "100%",
          }}
        >
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutDown}
            style={{
              width: "100%",
              backgroundColor: "red",
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{focusedMarker.name}</Text>
          </Animated.View>
        </View>
      )}
    </>
  );
}
