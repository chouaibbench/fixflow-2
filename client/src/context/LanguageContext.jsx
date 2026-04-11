import React, { createContext, useContext, useState } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const t = (key) => translations[lang][key] || key;
    const isRTL = lang === 'ar';
    const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

    return (
        <LanguageContext.Provider value={{ lang, t, isRTL, toggleLang }}>
            <div dir={isRTL ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined ) throw new Error('useLanguage must be used within a LanguageProvider')
    return context;
};