import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { artisticFilter } from "@cloudinary/url-gen/actions/effect";
import { getEvent } from "../../../services/events";
import { cloudinary } from "../../../lib/cloudinary";
import { Galeria } from "@nandorojo/galeria";
import AssetItem from "../../../components/AssetItem";

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: event,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => getEvent(id),
  });

  const urls = (event?.assets || []).map((asset) =>
    cloudinary.image(asset.asset_id!).effect(artisticFilter("al_dente")).toURL()
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event.name || 'Event',
          headerRight: () => (
            <Link href={`/events/${id || ''}/share`} asChild>
              <Ionicons
                name="share-outline"
                size={24}
                color="white"
                className="mr-2 ml-2"
              />
            </Link>
          ),
        }}
      />

      <FlatList
        data={event.assets}
        numColumns={2}
        contentContainerClassName="gap-1 p-4"
        columnWrapperClassName="gap-1"
        renderItem={({ item }) => (
          <View className="flex-1 max-w-[50%]">
            <AssetItem asset={item} />
          </View>
        )}
        contentInsetAdjustmentBehavior="automatic"
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      {/* <FlatList
          data={event.assets}
          numColumns={2}
          contentContainerClassName='gap-1 p-4'
          columnWrapperClassName='gap-1'
          renderItem={({ item }) => <AssetItem asset={item} />}
          contentInsetAdjustmentBehavior='automatic'
          refreshing={isRefetching}
          onRefresh={refetch}
        /> */}

      <Link href={`/events/${id || ''}/camera`} asChild>
        <Pressable className="absolute bottom-12 right-4 flex-row items-center justify-center bg-white p-6 rounded-full">
          <Ionicons name="camera-outline" size={40} color="black" />
        </Pressable>
      </Link>
    </>
  );
}
