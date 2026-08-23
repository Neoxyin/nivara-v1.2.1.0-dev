'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.today': 'Today',
    'nav.checkin': 'Check-in',
    'nav.academics': 'Academics',
    'nav.support': 'Well-being Support',
    'nav.support_circles': 'Support Circles',
    'nav.counsellors': 'Counsellors',
    'nav.financial': 'Financial',
    'nav.resources': 'Resources',
    'nav.settings': 'Settings',

    // Header Actions
    'header.help': 'Help',
    'header.about': 'About Nivara',
    'header.signout': 'Sign Out',
    'header.counsellor_portal': 'Counsellor Portal',

    // Subtabs
    'subtab.overview': 'Overview',
    'subtab.ai_support': 'AI Support Space',
    'subtab.support_circles': 'Support Circles',
    'subtab.daily_checkin': 'Daily Check-in',
    'subtab.history': 'Check-in History',
    'subtab.my_profile': 'My Profile',
    'subtab.data_privacy': 'Data & Privacy',
    'subtab.students': 'Students',
    'subtab.attention': 'Attention Required',
    'subtab.appointments': 'Appointments',
    'subtab.availability': 'Availability',
    'subtab.settings': 'Settings',
    'subtab.contextual_navigation': 'Contextual sub-navigation',

    // Support Circles
    'circles.title': 'Temporary Support Circles',
    'circles.all': 'All Circles',
    'circles.join': 'Join Circle',
    'circles.enter': 'Enter Discussion',
    'circles.full': 'Circle Full',
  },
  hi: {
    // Navigation
    'nav.today': 'आज',
    'nav.checkin': 'चेक-इन',
    'nav.academics': 'शिक्षा',
    'nav.support': 'स्वास्थ्य सहायता',
    'nav.support_circles': 'सहायता वृत्त',
    'nav.counsellors': 'परामर्शदाता',
    'nav.financial': 'वित्तीय सहायता',
    'nav.resources': 'संसाधन',
    'nav.settings': 'सेटिंग्स',

    // Header Actions
    'header.help': 'सहायता',
    'header.about': 'निवारा के बारे में',
    'header.signout': 'साइन आउट',
    'header.counsellor_portal': 'परामर्शदाता पोर्टल',

    // Subtabs
    'subtab.overview': 'अवलोकन',
    'subtab.ai_support': 'एआई सहायता स्थान',
    'subtab.support_circles': 'सहायता वृत्त',
    'subtab.daily_checkin': 'दैनिक चेक-इन',
    'subtab.history': 'चेक-इन इतिहास',
    'subtab.my_profile': 'मेरी प्रोफ़ाइल',
    'subtab.data_privacy': 'डेटा और गोपनीयता',
    'subtab.students': 'छात्र',
    'subtab.attention': 'ध्यान आवश्यक',
    'subtab.appointments': 'नियुक्तियां',
    'subtab.availability': 'उपलब्धता',
    'subtab.settings': 'सेटिंग्स',
    'subtab.contextual_navigation': 'संदर्भ उप-नेविगेशन',

    // Support Circles
    'circles.title': 'अस्थायी सहायता वृत्त',
    'circles.all': 'सभी वृत्त',
    'circles.join': 'वृत्त में शामिल हों',
    'circles.enter': 'चर्चा में प्रवेश करें',
    'circles.full': 'वृत्त पूर्ण है',
  },
};

const COMMON_TEXT_TRANSLATIONS: Record<string, string> = {
  'Your space': 'आपका स्थान',
  'Private by design': 'निजता सर्वोपरि',
  'Student Space': 'छात्र स्थान',
  'Counsellor Space': 'परामर्शदाता स्थान',
  'Counsellor Portal': 'परामर्शदाता पोर्टल',
  'Confidential Caseload & Triage': 'गोपनीय मामलों और ट्रायेज',
  'Settings': 'सेटिंग्स',
  'Help': 'सहायता',
  'About Nivara': 'निवारा के बारे में',
  'Sign Out': 'साइन आउट',
  'Today': 'आज',
  'Check-in': 'चेक-इन',
  'Academics': 'शिक्षा',
  'Well-being Support': 'स्वास्थ्य सहायता',
  'Support Circles': 'सहायता वृत्त',
  'Counsellors': 'परामर्शदाता',
  'Financial': 'वित्तीय सहायता',
  'Resources': 'संसाधन',
  'Overview': 'अवलोकन',
  'AI Support Space': 'एआई सहायता स्थान',
  'Daily Check-in': 'दैनिक चेक-इन',
  'Check-in History': 'चेक-इन इतिहास',
  'My Profile': 'मेरी प्रोफ़ाइल',
  'Data & Privacy': 'डेटा और गोपनीयता',
  'Students': 'छात्र',
  'Attention Required': 'ध्यान आवश्यक',
  'Appointments': 'नियुक्तियां',
  'Availability': 'उपलब्धता',
  'Today / Overview': 'आज / अवलोकन',
  'Your week at a glance': 'आपके सप्ताह की एक झलक',
  'The shape of things': 'स्थिति का स्वरूप',
  'Early signal': 'प्रारंभिक संकेत',
  'Continuous record': 'निरंतर रिकॉर्ड',
  'Attendance standing': 'उपस्थिति स्थिति',
  'Active Modules': 'सक्रिय मॉड्यूल',
  'Timetable Status': 'समय-सारणी स्थिति',
  'Synced & Active': 'सिंक और सक्रिय',
  'Actionable Pacing & Attendance Suggestions': 'कार्रवाई योग्य गति और उपस्थिति सुझाव',
  'Module Attendance & Coursework Records': 'मॉड्यूल उपस्थिति और पाठ्यक्रम रिकॉर्ड',
  'Upcoming Coursework Milestones': 'आगामी पाठ्यक्रम मील के पत्थर',
  'Academic Data is Private': 'शैक्षणिक डेटा निजी है',
  'Well-being Check-in': 'स्वास्थ्य चेक-इन',
  'One-minute check-in': 'एक मिनट का चेक-इन',
  'A private snapshot of today': 'आज की एक निजी झलक',
  'Check-ins are disabled': 'चेक-इन बंद हैं',
  'What is this?': 'यह क्या है?',
  'Why do we ask?': 'हम क्यों पूछते हैं?',
  'How does it support you?': 'यह आपकी कैसे सहायता करता है?',
  'Trend Visualization': 'रुझान दृश्य',
  'Recent Logs': 'हाल के रिकॉर्ड',
  'No appointments found': 'कोई नियुक्ति नहीं मिली',
  'Critical Signals': 'महत्वपूर्ण संकेत',
  'Reviewed This Shift': 'इस शिफ्ट में समीक्षा की गई',
  'Follow-up Sessions': 'फॉलो-अप सत्र',
  'Already booked for today': 'आज के लिए पहले से बुक',
  'Today’s Sessions': 'आज के सत्र',
  "Today's Sessions": 'आज के सत्र',
  'Attention Queue': 'ध्यान कतार',
  'Academic Rhythm': 'शैक्षणिक लय',
  'Attendance Rate': 'उपस्थिति दर',
  'Well-Being Score': 'स्वास्थ्य स्कोर',
  'Wellbeing Score': 'स्वास्थ्य स्कोर',
  'Module Marks & Trends': 'मॉड्यूल अंक और रुझान',
  'Weekly Availability Matrix': 'साप्ताहिक उपलब्धता मैट्रिक्स',
  'Toggle morning and afternoon booking windows.': 'सुबह और दोपहर की बुकिंग विंडो बदलें।',
  'Current Duty Status': 'वर्तमान ड्यूटी स्थिति',
  'Visible on student booking directory': 'छात्र बुकिंग निर्देशिका में दिखाई देता है',
  'Caseload Ceiling': 'मामलों की अधिकतम सीमा',
  'Active students limit': 'सक्रिय छात्रों की सीमा',
  'Consultation Location': 'परामर्श स्थान',
  'Physical or virtual room': 'भौतिक या वर्चुअल कक्ष',
  'Morning': 'सुबह',
  'Afternoon': 'दोपहर',
  'Save Schedule': 'समय-सारणी सहेजें',
  'Preferences updated': 'प्राथमिकताएं अपडेट की गईं',
  'Schedule saved': 'समय-सारणी सहेजी गई',
  'Previous': 'पिछला',
  'Next': 'अगला',
  'Close': 'बंद करें',
  'Cancel': 'रद्द करें',
  'Save': 'सहेजें',
  'Submit': 'जमा करें',
  'Request conversation': 'बातचीत का अनुरोध करें',
  'Request submitted': 'अनुरोध जमा किया गया',
  'No support options are currently available.': 'वर्तमान में कोई सहायता विकल्प उपलब्ध नहीं है।',
  'Support Recommendations': 'सहायता सुझाव',
  'Why recommended': 'क्यों सुझाया गया',
  'Support Need Profile': 'सहायता आवश्यकता प्रोफ़ाइल',
  'Support profile': 'सहायता प्रोफ़ाइल',
  'Well-being Resources': 'स्वास्थ्य संसाधन',
  'Well-being Library': 'स्वास्थ्य पुस्तकालय',
  'Start a supportive conversation...': 'सहायक बातचीत शुरू करें...',
  'Send': 'भेजें',
  'Loading...': 'लोड हो रहा है...',
  'Retry': 'पुनः प्रयास करें',
  'Unavailable': 'उपलब्ध नहीं',
  'Scheduled': 'निर्धारित',
  'Reviewed': 'समीक्षित',
  'Down': 'कम',
  'Stress': 'तनाव',
  'Sleep': 'नींद',
  'Energy': 'ऊर्जा',
  'Workload': 'कार्यभार',
  'Steady': 'स्थिर',
  'Student Tour': 'छात्र परिचय',
  'Student Demo': 'छात्र डेमो',
  'Notifications': 'सूचनाएं',
  'Privacy & consent': 'गोपनीयता और सहमति',
  'Privacy Policy': 'गोपनीयता नीति',
  'Prototype Data Notice': 'प्रोटोटाइप डेटा सूचना',
  'Data Correction Workflow': 'डेटा सुधार प्रक्रिया',
  'Request Data Correction': 'डेटा सुधार का अनुरोध करें',
  'What Data We Have': 'हमारे पास कौन-सा डेटा है',
  'What Withdrawal Means': 'सहमति वापस लेने का अर्थ',
  'Why & How It Is Used': 'क्यों और कैसे उपयोग किया जाता है',
  'Student Data Transparency & Correction': 'छात्र डेटा पारदर्शिता और सुधार',
  'Student Consent & Choice Confirmation': 'छात्र सहमति और विकल्प की पुष्टि',
};

const TEXT_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {},
  hi: {
    'Counsellor workspace': 'परामर्शदाता कार्यक्षेत्र',
    'Daily overview & student signals.': 'दैनिक अवलोकन और छात्र संकेत।',
    'Monitor your caseload, urgent student attention alerts, scheduled appointments, and cohort academic rhythm.': 'अपने मामलों, जरूरी छात्र ध्यान अलर्ट, निर्धारित नियुक्तियों और समूह की शैक्षणिक गति पर नज़र रखें।',
    'PRD Lifecycle & Consultations': 'पीआरडी जीवनचक्र और परामर्श',
    'Appointments & consultations.': 'नियुक्तियां और परामर्श।',
    'Full lifecycle support tracking: REQUESTED → PENDING → ACCEPTED → COMPLETED → FOLLOW-UP → CLOSED.': 'पूरे जीवनचक्र की सहायता ट्रैकिंग: अनुरोधित → लंबित → स्वीकृत → पूर्ण → फॉलो-अप → बंद।',
    'Student directory & dossiers': 'छात्र निर्देशिका और डॉसियर',
    'Students & academic insights.': 'छात्र और शैक्षणिक अंतर्दृष्टि।',
    'Review appointed students, analyze real-time course marks and attendance velocity, and inspect explainable wellbeing signals.': 'नियुक्त छात्रों की समीक्षा करें, पाठ्यक्रम अंकों और उपस्थिति की गति का विश्लेषण करें, और समझाने योग्य कल्याण संकेत देखें।',
    'Triage & early intervention': 'ट्रायेज और प्रारंभिक हस्तक्षेप',
    'Students requiring attention.': 'ध्यान आवश्यक छात्र।',
    'Students flagged through explainable pattern shifts — deadline concentration, sharp attendance declines, or sustained low sleep check-ins.': 'समझाने योग्य पैटर्न बदलावों के आधार पर चिह्नित छात्र — समयसीमा का जमाव, उपस्थिति में तेज गिरावट या लगातार कम नींद चेक-इन।',
    'Counsellor Settings': 'परामर्शदाता सेटिंग्स',
    'Clinical triage & portal preferences.': 'क्लिनिकल ट्रायेज और पोर्टल प्राथमिकताएं।',
    'Configure your notification thresholds, campus availability status, FERPA security controls, and specialist credentials.': 'अपनी सूचना सीमाएं, कैंपस उपलब्धता स्थिति, FERPA सुरक्षा नियंत्रण और विशेषज्ञ क्रेडेंशियल कॉन्फ़िगर करें।',
    'Working rhythm & capacity': 'कार्य लय और क्षमता',
    'Availability & office hours.': 'उपलब्धता और कार्यालय समय।',
    'Configure your consultation schedule, open booking windows for students, and set active caseload ceilings.': 'अपना परामर्श कार्यक्रम कॉन्फ़िगर करें, छात्रों के लिए बुकिंग विंडो खोलें और सक्रिय मामलों की सीमा तय करें।',
    'Weekly Availability Matrix': 'साप्ताहिक उपलब्धता मैट्रिक्स',
    'Toggle morning and afternoon booking windows.': 'सुबह और दोपहर की बुकिंग विंडो बदलें।',
    'Save Schedule': 'समय-सारणी सहेजें',
    'Preferences updated': 'प्राथमिकताएं अपडेट की गईं',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translateText: (text: string) => text,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nivara_language') as Language;
      if (saved && (saved === 'en' || saved === 'hi')) {
        setLanguageState(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nivara_language', lang);
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const translateText = (text: string): string => {
    if (language === 'en') return text;
    return TEXT_TRANSLATIONS[language]?.[text] || COMMON_TEXT_TRANSLATIONS[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText }}>
      {children}
      <LocalizedUiBridge />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}


function LocalizedUiBridge() {
  const { language, translateText } = useLanguage();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const translateNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) return;
      const raw = node.nodeValue || '';
      const trimmed = raw.trim();
      if (!trimmed) return;
      const translated = translateText(trimmed);
      if (translated !== trimmed) {
        node.nodeValue = raw.replace(trimmed, translated);
      }
    };

    const translateAttributes = (root: ParentNode) => {
      const elements = root.querySelectorAll?.('[title], [aria-label], [placeholder]') || [];
      elements.forEach((element) => {
        for (const attr of ['title', 'aria-label', 'placeholder']) {
          const value = element.getAttribute(attr);
          if (!value) continue;
          const translated = translateText(value);
          if (translated !== value) element.setAttribute(attr, translated);
        }
      });
    };

    const scan = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) translateNode(node);
      translateAttributes(document.body);
    };

    scan();
    observerRef.current?.disconnect();
    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) {
            translateAttributes(node as Element);
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            let child: Node | null;
            while ((child = walker.nextNode())) translateNode(child);
          }
        });
      }
    });
    observerRef.current.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observerRef.current?.disconnect();
  }, [language, translateText]);

  return null;
}

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] p-1 text-[10px] font-bold uppercase tracking-[.08em] backdrop-blur-md">
      <Globe size={11} className="ml-1 text-white/40" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-label="Switch language to English"
        aria-pressed={language === 'en'}
        className={`px-1.5 py-0.5 rounded transition-all ${
          language === 'en'
            ? 'bg-[#c3f340] text-[#0d1408] font-extrabold shadow-[0_0_8px_rgba(195,243,64,0.3)]'
            : 'text-white/50 hover:text-white'
        }`}
      >
        EN
      </button>
      <span className="text-white/20">|</span>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-label="हिंदी भाषा में बदलें"
        aria-pressed={language === 'hi'}
        className={`px-1.5 py-0.5 rounded transition-all ${
          language === 'hi'
            ? 'bg-[#c3f340] text-[#0d1408] font-extrabold shadow-[0_0_8px_rgba(195,243,64,0.3)]'
            : 'text-white/50 hover:text-white'
        }`}
      >
        HI
      </button>
    </div>
  );
}
