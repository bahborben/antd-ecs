import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_CN from './lang/zh-CN';
import en_US from './lang/en-US';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh_CN',
    resources: {
      zh_CN,
      en_US,
    }
  });

export default i18n;