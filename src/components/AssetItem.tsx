import { Text, useWindowDimensions, Image } from 'react-native';
import { Tables } from '../types/database.types';
import { cloudinary } from '../lib/cloudinary';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { artisticFilter } from '@cloudinary/url-gen/actions/effect';

export default function AssetItem({ asset }: { asset: Tables<'assets'> }) {
  const { width } = useWindowDimensions();

  const imageUrl = cloudinary
    .image(asset.asset_id!)
    .resize(
      thumbnail()
        .height((width * (4 / 3)) / 2)
        .width(width / 2)
    )
    .effect(artisticFilter('al_dente'))
    .toURL();

  return (
    <Image
      source={{ uri: imageUrl }}
      style={{ 
        width: '100%', 
        aspectRatio: 3/4, 
        borderRadius: 8 
      }}
      resizeMode="cover"
    />
  );
}