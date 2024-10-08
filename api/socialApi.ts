import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

interface Friend {
  id: string;
  username: string;
  fullName: string;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  exp: number;
}

export const getAllFriends = async (): Promise<Friend[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('api/social/friends', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendFriendRequest = async (username: string): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.post(
      'api/social/friends/request',
      { username },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const getAllFriendRequests = async (): Promise<Friend[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('api/social/friends/requests', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.post(
      'api/social/friends/accept',
      { friendId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const rejectFriendRequest = async (friendId: string): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.post(
      'api/social/friends/reject',
      { friendId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const removeFriend = async (friendId: string): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.delete('api/social/friends', {
      headers: { Authorization: `Bearer ${token}` },
      data: { friendId },
    });
  } catch (error) {
    throw error;
  }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axiosInstance.get('api/social/leaderboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};
