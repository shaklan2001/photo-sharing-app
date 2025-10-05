import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../providers/TokenAuthProvider';
import { getEvent, joinEvent } from '../../../services/events';


export default function Join() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
  });

  const joinEventMutation = useMutation({
    mutationFn: () => joinEvent(id, user?.google_id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      router.replace(`/events/${id}`);
    },
  });

  return (
    <SafeAreaView className='flex-1 p-4 gap-6 items-center justify-center'>
      <Text className='text-neutral-400 text-lg font-bold'>
        Your are invited to join
      </Text>
      <Text className='text-white text-5xl font-bold'>{event?.name}</Text>

      <Button title='Join Event' onPress={() => joinEventMutation.mutate()} />
    </SafeAreaView>
  );
}