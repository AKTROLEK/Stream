import translations from './translations.js';

export class LanguageManager {
  constructor() {
    this.translations = translations;
  }
  
  translate(lang, key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return key;
  }
  
  t(lang, key, params) {
    return this.translate(lang, key, params);
  }
}

export default new LanguageManager();
