import { Image, useWindowDimensions, Platform } from 'react-native';
import { Tables } from '../types/database.types';
import { cloudinary } from '../lib/cloudinary';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { artisticFilter } from '@cloudinary/url-gen/actions/effect';
import AndroidImage from './AndroidImage';

export default function AssetItem({ asset, isEventList = false }: { asset: Tables<'assets'>, isEventList?: boolean }) {
  const { width } = useWindowDimensions();
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const thumbnailSize = isEventList ? 80 : Math.floor(width / 2);
  const thumbnailHeight = isEventList ? 80 : Math.floor((width * (4 / 3)) / 2);
  
  const androidImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_${thumbnailSize},h_${thumbnailHeight},c_fill/${asset.asset_id}`;
  const androidFallbackUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${asset.asset_id}`;
  const iosImageUrl = cloudinary
    .image(asset.asset_id!)
    .resize(
      thumbnail()
        .height(thumbnailHeight)
        .width(thumbnailSize)
    )
    .effect(artisticFilter('al_dente'))
    .toURL();

  const imageUrl = Platform.OS === 'android' ? androidImageUrl : iosImageUrl;

  const imageClassName = isEventList 
    ? 'flex-1 w-full h-full rounded-lg' 
    : 'flex-1 w-full aspect-[3/4] rounded-lg';

  if (Platform.OS === 'android') {
    return (
      <AndroidImage
        source={{ uri: imageUrl }}
        fallbackUri={androidFallbackUrl}
        className={imageClassName}
        resizeMode="cover"
        onError={(error) => {
          // Handle error silently
        }}
        onLoad={() => {
          // Image loaded successfully
        }}
      />
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      className={imageClassName}
      resizeMode="cover"
      onError={(error) => {
        // Handle error silently
      }}
      onLoad={() => {
        // Image loaded successfully
      }}
    />
  );
}