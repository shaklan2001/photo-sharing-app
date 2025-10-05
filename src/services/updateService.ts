import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export class UpdateService {
  static async checkForUpdates() {
    try {
      if (!Updates.isEnabled) {
        console.log('Updates are not enabled in development mode');
        return;
      }

      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        console.log('Update available:', update);
        return update;
      } else {
        console.log('No updates available');
        return null;
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }

  static async downloadAndInstallUpdate() {
    try {
      if (!Updates.isEnabled) {
        console.log('Updates are not enabled in development mode');
        return false;
      }

      const update = await Updates.fetchUpdateAsync();
      
      if (update.isNew) {
        console.log('Update downloaded successfully');
        Alert.alert(
          'Update Available',
          'A new version is ready to install. The app will restart to apply the update.',
          [
            {
              text: 'Install Now',
              onPress: () => Updates.reloadAsync(),
            },
            {
              text: 'Later',
              style: 'cancel',
            },
          ]
        );
        return true;
      } else {
        console.log('No new update to install');
        return false;
      }
    } catch (error) {
      console.error('Error downloading update:', error);
      Alert.alert('Update Error', 'Failed to download update. Please try again later.');
      return false;
    }
  }

  static async checkAndInstallUpdate() {
    try {
      const update = await this.checkForUpdates();
      
      if (update) {
        return await this.downloadAndInstallUpdate();
      }
      
      return false;
    } catch (error) {
      console.error('Error in update process:', error);
      return false;
    }
  }

  static getCurrentUpdateInfo() {
    return {
      updateId: Updates.updateId,
      channel: Updates.channel,
      runtimeVersion: Updates.runtimeVersion,
      isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    };
  }
}
