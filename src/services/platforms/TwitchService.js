import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class TwitchService {
  constructor() {
    this.clientId = process.env.TWITCH_CLIENT_ID;
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
    this.baseUrl = 'https://api.twitch.tv/helix';
    this.accessToken = null;
  }
  
  async getAccessToken() {
    if (this.accessToken) return this.accessToken;
    
    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }
      });
      
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Twitch Auth Error:', error.message);
      return null;
    }
  }
  
  async getHeaders() {
    const token = await this.getAccessToken();
    return {
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${token}`
    };
  }
  
  async getUserByUsername(username) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/users`, {
        params: { login: username },
        headers
      });
      
      return response.data.data[0] || null;
    } catch (error) {
      console.error('Twitch API Error:', error.message);
      return null;
    }
  }
  
  async getStreamData(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/streams`, {
        params: { user_id: userId },
        headers
      });
      
      const stream = response.data.data[0];
      if (!stream) return null;
      
      return {
        id: stream.id,
        title: stream.title,
        viewerCount: stream.viewer_count,
        startedAt: stream.started_at,
        gameName: stream.game_name,
        isLive: true
      };
    } catch (error) {
      console.error('Twitch API Error:', error.message);
      return null;
    }
  }
  
  async getRecentVideos(userId, maxResults = 10) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          user_id: userId,
          first: maxResults,
          sort: 'time'
        },
        headers
      });
      
      return response.data.data.map(video => ({
        id: video.id,
        title: video.title,
        viewCount: video.view_count,
        createdAt: video.created_at,
        duration: video.duration,
        url: video.url
      }));
    } catch (error) {
      console.error('Twitch API Error:', error.message);
      return [];
    }
  }
  
  async getFollowerCount(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/channels/followers`, {
        params: { broadcaster_id: userId },
        headers
      });
      
      return response.data.total || 0;
    } catch (error) {
      console.error('Twitch API Error:', error.message);
      return 0;
    }
  }
}

export default new TwitchService();
