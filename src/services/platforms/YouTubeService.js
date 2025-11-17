import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }
  
  async getChannelStats(channelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'statistics,snippet',
          id: channelId,
          key: this.apiKey
        }
      });
      
      const channel = response.data.items[0];
      if (!channel) return null;
      
      return {
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        viewCount: parseInt(channel.statistics.viewCount),
        title: channel.snippet.title
      };
    } catch (error) {
      console.error('YouTube API Error:', error.message);
      return null;
    }
  }
  
  async getRecentVideos(channelId, maxResults = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          channelId: channelId,
          maxResults: maxResults,
          order: 'date',
          type: 'video',
          key: this.apiKey
        }
      });
      
      const videoIds = response.data.items.map(item => item.id.videoId).join(',');
      
      const statsResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'statistics,contentDetails',
          id: videoIds,
          key: this.apiKey
        }
      });
      
      return statsResponse.data.items.map(video => ({
        id: video.id,
        title: response.data.items.find(i => i.id.videoId === video.id)?.snippet?.title,
        publishedAt: response.data.items.find(i => i.id.videoId === video.id)?.snippet?.publishedAt,
        viewCount: parseInt(video.statistics.viewCount),
        likeCount: parseInt(video.statistics.likeCount || 0),
        commentCount: parseInt(video.statistics.commentCount || 0),
        duration: video.contentDetails.duration
      }));
    } catch (error) {
      console.error('YouTube API Error:', error.message);
      return [];
    }
  }
  
  async getLiveStreams(channelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          channelId: channelId,
          eventType: 'live',
          type: 'video',
          key: this.apiKey
        }
      });
      
      return response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        startedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      console.error('YouTube API Error:', error.message);
      return [];
    }
  }
}

export default new YouTubeService();
