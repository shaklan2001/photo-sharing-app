import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import { logger } from '../utils/logger';

export class UpdateService {
  static async checkForUpdates() {
    try {
      // Skip update checks in development mode
      if (__DEV__ || !Updates.isEnabled) {
        logger.log('Updates disabled in development mode');
        return null;
      }

      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        logger.log('Update available:', update);
        return update;
      } else {
        logger.log('No updates available');
        return null;
      }
    } catch (error) {
      // Silently handle development mode errors
      if (__DEV__) {
        logger.log('Update check skipped in development');
        return null;
      }
      logger.error('Error checking for updates:', error);
      return null;
    }
  }

  static async downloadAndInstallUpdate() {
    try {
      if (__DEV__ || !Updates.isEnabled) {
        logger.log('Updates disabled in development mode');
        return false;
      }

      const update = await Updates.fetchUpdateAsync();
      
      if (update.isNew) {
        logger.log('Update downloaded successfully');
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
        logger.log('No new update to install');
        return false;
      }
    } catch (error) {
      logger.error('Error downloading update:', error);
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
      logger.error('Error in update process:', error);
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
