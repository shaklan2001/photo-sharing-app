import { useState, useEffect } from 'react';
import { UpdateService } from '../services/updateService';

export const useUpdates = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  useEffect(() => {
    const info = UpdateService.getCurrentUpdateInfo();
    setUpdateInfo(info);
    console.log('Current update info:', info);
  }, []);

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const update = await UpdateService.checkForUpdates();
      setUpdateAvailable(!!update);
      return update;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  const installUpdate = async () => {
    try {
      const success = await UpdateService.downloadAndInstallUpdate();
      if (success) {
        setUpdateAvailable(false);
      }
      return success;
    } catch (error) {
      console.error('Error installing update:', error);
      return false;
    }
  };

  const checkAndInstall = async () => {
    setIsChecking(true);
    try {
      const success = await UpdateService.checkAndInstallUpdate();
      if (success) {
        setUpdateAvailable(false);
      }
      return success;
    } catch (error) {
      console.error('Error in check and install:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    updateAvailable,
    updateInfo,
    checkForUpdates,
    installUpdate,
    checkAndInstall,
  };
};
