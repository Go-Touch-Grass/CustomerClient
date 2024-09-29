import axios from 'axios';
import { APP_ID, API_KEY } from '@env';

// REST API
export const createGuestAccount = async () => {
  try {
    const response = await axios.post('https://api.readyplayer.me/v1/users',
      {
        data: {
          applicationId: APP_ID,
        },
      },
      {
        headers: {
          'x-api-key': API_KEY, 
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to create guest account');
  }
};

export const get3DAvatar = async (avatarId: string) => {
    try {
      const response = await axios.get(`https://models.readyplayer.me/${avatarId}.glb`);
      return response.data;
    } catch (error) {
      console.error('Error fetching 3D avatar:', error);
      throw error;
    }
};

export const equipAsset = async (avatarId: string, assetId: string) => {
    try {
      const response = await axios.put(`https://api.readyplayer.me/v1/avatars/${avatarId}/equip`, {
        assetId,
      });
      return response.data;
    } catch (error) {
      console.error('Error equipping asset:', error);
      throw error;
    }
};

export const unequipAsset = async (avatarId: string, assetId: string) => {
    try {
      const response = await axios.put(`https://api.readyplayer.me/v1/avatars/${avatarId}/unequip`, {
        assetId,
      });
      return response.data;
    } catch (error) {
      console.error('Error unequipping asset:', error);
      throw error;
    }
};

export const listAssets = async () => {
    try {
      const response = await axios.get('https://api.readyplayer.me/v1/assets', {
        headers: {
          'X-APP-ID': APP_ID, 
          'Content-Type': 'application/json', 
        },
      });
      return response.data; 
    } catch (error) {
      throw new Error('Failed to retrieve assets');
    }
};

export const addAssetToApp = async (assetId: string) => {
    try {
      const response = await axios.post(`https://api.readyplayer.me/v1/assets/${assetId}/application`,
        {
          data: {
            applicationId: APP_ID,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add asset to app');
    }
};

export const removeAssetToApp = async (assetId: string) => {
    try {
      const response = await axios.delete(`https://api.readyplayer.me/v1/assets/${assetId}/application`,
        {
          data: {
            applicationId: APP_ID,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add asset to app');
    }
};

export const unlockAssetForUser = async (userId: string, assetId: string) => {
    try {
      const response = await axios.put(`https://api.readyplayer.me/v1/assets/${assetId}/unlock`,
        {
          data: {
            userId: userId,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to unlock for User');
    }
};







