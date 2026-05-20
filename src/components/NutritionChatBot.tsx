import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { showNotification } from './NotificationProvider';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserProfile {
  weight: number;
  height: number;
  activityLevel: string;
  physicalState: string;
  mentalState: string;
  goals: string;
}

const NutritionChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'form' | 'chat'>('intro');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    weight: 0,
    height: 0,
    activityLevel: 'moderate',
    physicalState: 'average',
    mentalState: 'stable',
    goals: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (userProfile.weight <= 0 || userProfile.weight > 500) errors.push(t('chatbot.errors.invalidWeight'));
    if (userProfile.height <= 0 || userProfile.height > 300) errors.push(t('chatbot.errors.invalidHeight'));
    if (!userProfile.goals.trim()) errors.push(t('chatbot.errors.emptyGoals'));
    setFormErrors(errors);
    return errors.length === 0;
  };

  const startChat = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Initial greeting message from chatbot
      const greeting: ChatMessage = {
        role: 'assistant',
        content: t('chatbot.greeting', {
          weight: userProfile.weight,
          height: userProfile.height,
          activity: t(`chatbot.activity.${userProfile.activityLevel}`),
          goals: userProfile.goals
        }),
        timestamp: new Date()
      };
      setMessages([greeting]);
      setStep('chat');
    } catch (error) {
      showNotification(t('chatbot.errors.startError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await api.post('/nutrition/chat-recommendation', {
        userMessage,
        userProfile,
        conversationHistory: messages,
        language: i18n.language,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.recommendation,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      showNotification(error.response?.data?.message || t('chatbot.errors.sendError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-10 page-animate">
        <div className="max-w-2xl mx-auto px-4">
          <div className="rounded-[32px] bg-white/95 border border-amber-200 shadow-2xl backdrop-blur-xl p-5 sm:p-8 text-center">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🤖</div>
            <h1 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-3 sm:mb-4">{t('chatbot.title')}</h1>
            <p className="text-lg text-amber-700 mb-6">{t('chatbot.subtitle')}</p>

            <div className="grid gap-4 mb-8 text-left">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-amber-900">{t('chatbot.feature1')}</h3>
                  <p className="text-sm text-amber-700">{t('chatbot.feature1Desc')}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-amber-900">{t('chatbot.feature2')}</h3>
                  <p className="text-sm text-amber-700">{t('chatbot.feature2Desc')}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">💪</span>
                <div>
                  <h3 className="font-semibold text-amber-900">{t('chatbot.feature3')}</h3>
                  <p className="text-sm text-amber-700">{t('chatbot.feature3Desc')}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setStep('form')} className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg transition-all duration-200 hover:scale-105">
              {t('chatbot.startButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-10 page-animate">
        <div className="max-w-2xl mx-auto px-4">
          <div className="rounded-[32px] bg-white/95 border border-amber-200 shadow-2xl backdrop-blur-xl p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <button onClick={() => setStep('intro')} className="text-2xl hover:scale-110 transition">
                ←
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">{t('chatbot.formTitle')}</h1>
            </div>

            {formErrors.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2">{t('chatbot.errors.title')}</h3>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {formErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">⚖️ {t('chatbot.weight')} (kg)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={userProfile.weight || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition"
                  placeholder="70"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">📏 {t('chatbot.height')} (cm)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={userProfile.height || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, height: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition"
                  placeholder="175"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">🏃 {t('chatbot.activityLevel')}</label>
                <select value={userProfile.activityLevel} onChange={(e) => setUserProfile({ ...userProfile, activityLevel: e.target.value })} className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition">
                  <option value="sedentary">{t('chatbot.activity.sedentary')}</option>
                  <option value="light">{t('chatbot.activity.light')}</option>
                  <option value="moderate">{t('chatbot.activity.moderate')}</option>
                  <option value="active">{t('chatbot.activity.active')}</option>
                  <option value="veryActive">{t('chatbot.activity.veryActive')}</option>
                </select>
              </div>

              {/* Physical State */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">💪 {t('chatbot.physicalStateLabel')}</label>
                <select value={userProfile.physicalState} onChange={(e) => setUserProfile({ ...userProfile, physicalState: e.target.value })} className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition">
                  <option value="poor">{t('chatbot.physicalState.poor')}</option>
                  <option value="average">{t('chatbot.physicalState.average')}</option>
                  <option value="good">{t('chatbot.physicalState.good')}</option>
                  <option value="excellent">{t('chatbot.physicalState.excellent')}</option>
                </select>
              </div>

              {/* Mental State */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">🧠 {t('chatbot.mentalStateLabel')}</label>
                <select value={userProfile.mentalState} onChange={(e) => setUserProfile({ ...userProfile, mentalState: e.target.value })} className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition">
                  <option value="stressed">{t('chatbot.mentalState.stressed')}</option>
                  <option value="anxious">{t('chatbot.mentalState.anxious')}</option>
                  <option value="stable">{t('chatbot.mentalState.stable')}</option>
                  <option value="positive">{t('chatbot.mentalState.positive')}</option>
                </select>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">🎯 {t('chatbot.goals')}</label>
                <textarea
                  value={userProfile.goals}
                  onChange={(e) => setUserProfile({ ...userProfile, goals: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition resize-none"
                  rows={4}
                  placeholder={t('chatbot.goalsPlaceholder')}
                />
              </div>

              <button onClick={startChat} disabled={loading} className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold shadow-lg transition-all duration-200 hover:scale-105">
                {loading ? t('chatbot.loading') : t('chatbot.continueButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-10 page-animate">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-amber-200 shadow-2xl backdrop-blur-xl p-8 flex flex-col h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">{t('chatbot.chatTitle')}</h1>
                <p className="text-sm text-amber-700">{t('chatbot.chatSubtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('intro');
                setMessages([]);
              }}
              className="px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition"
            >
              {t('chatbot.newChat')}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${msg.role === 'user' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none' : 'bg-amber-100 text-amber-900 rounded-bl-none'}`}>
                  <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-amber-100' : 'text-amber-700'}`}>{msg.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-amber-100 text-amber-900 px-4 py-3 rounded-lg rounded-bl-none animate-pulse">{t('chatbot.typingIndicator')}</div>
              </div>
            )}
          </div>

          {/* Input */}
          <ChatInput onSendMessage={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !disabled) handleSend();
        }}
        disabled={disabled}
        placeholder={t('chatbot.inputPlaceholder')}
        className="flex-1 px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition disabled:opacity-50"
      />
      <button onClick={handleSend} disabled={disabled || !message.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold transition">
        {t('chatbot.sendButton')}
      </button>
    </div>
  );
};

export default NutritionChatBot;
