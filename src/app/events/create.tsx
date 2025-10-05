import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { createEvent } from '../../services/events';

export default function CreateEvent() {
  const [name, setName] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: () => createEvent({ name, owner_id: user?.id }, user!.id),
    onSuccess: (data) => {
      setName('');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      console.log('data', data);
      router.replace(`/events/${data.id}`);
    },
  });

  return (
    <SafeAreaView className='flex-1 p-4 gap-4'>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder='Event Name'
        className='bg-neutral-800 p-5 rounded-lg text-white'
        placeholderTextColor='gray'
      />
      <Button
        title='Create Event'
        onPress={() => createEventMutation.mutate()}
      />
    </SafeAreaView>
  );
}