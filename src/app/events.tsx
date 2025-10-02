import { AdvancedImage } from 'cloudinary-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { cloudinary } from '../lib/cloudinary'
import { artisticFilter } from '@cloudinary/url-gen/actions/effect'

const events = () => {
  return (
    <View>
        <Text>Events</Text>
        <AdvancedImage
            cldImg={cloudinary
                .image("ubd9e3kso7qv4swkuxuz")
                .effect(artisticFilter('incognito'))}
            style={{ width: '100%', aspectRatio: 3 / 4 }}
        />
    </View>
  )
}

export default events