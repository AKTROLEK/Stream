import Analytics from '../models/Analytics.js';
import Streamer from '../models/Streamer.js';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

class AnalyticsService {
  async recordMetrics(streamerId, platform, metrics, periodType = 'daily') {
    const analytics = await Analytics.create({
      streamerId,
      platform,
      date: new Date(),
      videos: metrics.videos || {},
      streams: metrics.streams || {},
      engagement: metrics.engagement || {},
      growth: metrics.growth || {},
      periodType
    });
    
    // Update streamer stats
    const streamer = await Streamer.findOne({ discordId: streamerId });
    if (streamer) {
      if (metrics.videos?.count) {
        streamer.stats.totalVideos += metrics.videos.count;
        streamer.stats.lastVideoDate = new Date();
      }
      if (metrics.streams?.totalHours) {
        streamer.stats.totalStreamHours += metrics.streams.totalHours;
        streamer.stats.lastStreamDate = new Date();
      }
      if (metrics.videos?.totalViews) {
        streamer.stats.totalViews += metrics.videos.totalViews;
      }
      
      await streamer.save();
    }
    
    return analytics;
  }
  
  async getWeeklyReport(streamerId, platform = null) {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const query = {
      streamerId,
      date: { $gte: weekStart, $lte: weekEnd }
    };
    
    if (platform) query.platform = platform;
    
    const analytics = await Analytics.find(query);
    
    return this._aggregateAnalytics(analytics);
  }
  
  async getMonthlyReport(streamerId, platform = null) {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    const query = {
      streamerId,
      date: { $gte: monthStart, $lte: monthEnd }
    };
    
    if (platform) query.platform = platform;
    
    const analytics = await Analytics.find(query);
    
    return this._aggregateAnalytics(analytics);
  }
  
  async getTopStreamers(period = 'weekly', limit = 3) {
    const isWeekly = period === 'weekly';
    const startDate = isWeekly ? startOfWeek(new Date()) : startOfMonth(new Date());
    const endDate = isWeekly ? endOfWeek(new Date()) : endOfMonth(new Date());
    
    const analytics = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$streamerId',
          totalViews: { $sum: '$videos.totalViews' },
          totalVideos: { $sum: '$videos.count' },
          totalStreamHours: { $sum: '$streams.totalHours' },
          totalEngagement: { $sum: '$engagement.total' }
        }
      },
      {
        $sort: { totalViews: -1, totalEngagement: -1 }
      },
      {
        $limit: limit
      }
    ]);
    
    // Populate streamer details
    const streamers = await Promise.all(
      analytics.map(async (a) => {
        const streamer = await Streamer.findOne({ discordId: a._id });
        return {
          ...a,
          username: streamer?.username || 'Unknown',
          platforms: streamer?.platforms || {}
        };
      })
    );
    
    return streamers;
  }
  
  async compareplatforms(streamerId) {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const analytics = await Analytics.find({
      streamerId,
      date: { $gte: weekStart, $lte: weekEnd }
    });
    
    const platformStats = {};
    
    analytics.forEach(a => {
      if (!platformStats[a.platform]) {
        platformStats[a.platform] = {
          videos: 0,
          streamHours: 0,
          views: 0,
          engagement: 0
        };
      }
      
      platformStats[a.platform].videos += a.videos?.count || 0;
      platformStats[a.platform].streamHours += a.streams?.totalHours || 0;
      platformStats[a.platform].views += a.videos?.totalViews || 0;
      platformStats[a.platform].engagement += a.engagement?.total || 0;
    });
    
    return platformStats;
  }
  
  _aggregateAnalytics(analytics) {
    const aggregated = {
      totalVideos: 0,
      totalStreamHours: 0,
      totalViews: 0,
      totalEngagement: 0,
      platforms: {}
    };
    
    analytics.forEach(a => {
      aggregated.totalVideos += a.videos?.count || 0;
      aggregated.totalStreamHours += a.streams?.totalHours || 0;
      aggregated.totalViews += a.videos?.totalViews || 0;
      aggregated.totalEngagement += a.engagement?.total || 0;
      
      if (!aggregated.platforms[a.platform]) {
        aggregated.platforms[a.platform] = {
          videos: 0,
          streamHours: 0,
          views: 0,
          engagement: 0
        };
      }
      
      aggregated.platforms[a.platform].videos += a.videos?.count || 0;
      aggregated.platforms[a.platform].streamHours += a.streams?.totalHours || 0;
      aggregated.platforms[a.platform].views += a.videos?.totalViews || 0;
      aggregated.platforms[a.platform].engagement += a.engagement?.total || 0;
    });
    
    return aggregated;
  }
}

export default new AnalyticsService();
