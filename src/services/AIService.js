import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async analyzeContent(contentDescription, platform) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional content analyst for ${platform} streamers. Provide constructive feedback and suggestions to improve content quality and engagement.`
          },
          {
            role: 'user',
            content: `Analyze this content and provide improvement suggestions: ${contentDescription}`
          }
        ],
        max_tokens: 500
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return 'Unable to analyze content at this time.';
    }
  }
  
  async suggestBestStreamTime(audienceData) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in audience analytics and streaming optimization. Suggest the best streaming times based on audience behavior.'
          },
          {
            role: 'user',
            content: `Based on this audience data: ${JSON.stringify(audienceData)}, suggest the optimal streaming schedule.`
          }
        ],
        max_tokens: 300
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return 'Unable to provide scheduling suggestions at this time.';
    }
  }
  
  async generateTitleAndDescription(contentTopic, platform, language = 'en') {
    try {
      const languagePrompt = language === 'ar' ? 'in Arabic' : 'in English';
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a creative content writer specializing in ${platform} content. Generate engaging titles and descriptions ${languagePrompt}.`
          },
          {
            role: 'user',
            content: `Create an engaging title and description for this content: ${contentTopic}`
          }
        ],
        max_tokens: 400
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return 'Unable to generate content at this time.';
    }
  }
  
  async generateScript(topic, duration, platform, language = 'en') {
    try {
      const languagePrompt = language === 'ar' ? 'in Arabic' : 'in English';
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional script writer for ${platform} content. Create engaging scripts ${languagePrompt}.`
          },
          {
            role: 'user',
            content: `Write a ${duration}-minute script about: ${topic}`
          }
        ],
        max_tokens: 1000
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return 'Unable to generate script at this time.';
    }
  }
  
  async detectViolations(contentDescription, platformRules) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a content moderation expert. Analyze content for potential policy violations.'
          },
          {
            role: 'user',
            content: `Check if this content violates any of these rules: ${platformRules}\n\nContent: ${contentDescription}`
          }
        ],
        max_tokens: 300
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return null;
    }
  }
  
  async chatResponse(userMessage, context = '', language = 'ar') {
    try {
      const systemPrompt = language === 'ar' 
        ? 'أنت مساعد ذكي لبوت إدارة الستريمرز. ساعد المستخدمين بطريقة ودية ومحترفة.'
        : 'You are a smart assistant for a streamer management bot. Help users in a friendly and professional manner.';
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt + (context ? `\n\nContext: ${context}` : '')
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return language === 'ar' ? 'عذراً، حدث خطأ في معالجة طلبك.' : 'Sorry, an error occurred processing your request.';
    }
  }
}

export default new AIService();
