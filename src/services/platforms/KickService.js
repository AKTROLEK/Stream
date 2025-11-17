import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Kick.com API implementation (public/unofficial)
class KickService {
  constructor() {
    this.baseUrl = 'https://kick.com/api/v2';
  }
  
  async getChannelInfo(channelName) {
    try {
      const response = await axios.get(`${this.baseUrl}/channels/${channelName}`);
      return {
        id: response.data.id,
        username: response.data.user.username,
        followersCount: response.data.followers_count,
        isLive: response.data.livestream !== null
      };
    } catch (error) {
      console.error('Kick API Error:', error.message);
      return null;
    }
  }
  
  async getLivestreamData(channelName) {
    try {
      const response = await axios.get(`${this.baseUrl}/channels/${channelName}/livestream`);
      
      if (!response.data) return null;
      
      return {
        id: response.data.id,
        title: response.data.session_title,
        viewerCount: response.data.viewer_count,
        startedAt: response.data.created_at,
        category: response.data.category?.name
      };
    } catch (error) {
      console.error('Kick API Error:', error.message);
      return null;
    }
  }
  
  async getRecentVideos(channelName, limit = 10) {
    try {
      // Kick video API endpoint (may need adjustment based on actual API)
      const response = await axios.get(`${this.baseUrl}/channels/${channelName}/videos`, {
        params: { limit }
      });
      
      return response.data.map(video => ({
        id: video.id,
        title: video.title,
        viewCount: video.views,
        createdAt: video.created_at,
        duration: video.duration
      }));
    } catch (error) {
      console.error('Kick API Error:', error.message);
      return [];
    }
  }
}

export default new KickService();
