import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

const INITIAL_PROFILE: UserProfile = {
  weight: 0,
  height: 0,
  activityLevel: 'moderate',
  physicalState: 'average',
  mentalState: 'stable',
  goals: '',
};

const FloatingChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'form' | 'chat'>('intro');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

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
      const greeting: ChatMessage = {
        role: 'assistant',
        content: t('chatbot.greeting', {
          weight: userProfile.weight,
          height: userProfile.height,
          activity: t(`chatbot.activity.${userProfile.activityLevel}`),
          goals: userProfile.goals,
        }),
        timestamp: new Date(),
      };
      setMessages([greeting]);
      setStep('chat');
    } catch {
      showNotification(t('chatbot.errors.startError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    const text = inputValue.trim();
    setInputValue('');

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await api.post('/nutrition/chat-recommendation', {
        userMessage: text,
        userProfile,
        conversationHistory: messages,
        language: i18n.language,
      });
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.data.recommendation,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
      const msg = error instanceof Error && (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      showNotification(msg || t('chatbot.errors.sendError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setStep('intro');
    setMessages([]);
    setUserProfile(INITIAL_PROFILE);
    setFormErrors([]);
  };

  return createPortal(
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? t('common.close') : t('chatbot.title')}
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-2xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 hover:scale-110 focus:outline-none"
        style={{ animation: isOpen ? 'none' : 'botPulse 2s ease-in-out infinite' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span aria-hidden="true">🤖</span>
        )}
      </button>

      {/* ── Chat widget panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-amber-200 flex flex-col overflow-hidden"
          style={{ height: 'min(520px, calc(100vh - 110px))', animation: 'chatSlideUp 0.25s ease-out both' }}
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white shrink-0">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🤖</span>
              <span className="font-bold text-sm">{t('chatbot.title')}</span>
            </div>
            <div className="flex items-center gap-2">
              {step === 'chat' && (
                <button onClick={resetChat} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition" aria-label={t('chatbot.newChat')}>
                  {t('chatbot.newChat')}
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition" aria-label={t('common.close')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Intro step ── */}
          {step === 'intro' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <p className="text-center text-amber-700 text-sm font-medium">{t('chatbot.subtitle')}</p>
              <div className="space-y-3">
                {[
                  { icon: '🎯', key: 'feature1' as const },
                  { icon: '📊', key: 'feature2' as const },
                  { icon: '💬', key: 'feature3' as const },
                ].map(({ icon, key }) => (
                  <div key={key} className="flex gap-2 items-start">
                    <span className="text-lg shrink-0" aria-hidden="true">{icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{t(`chatbot.${key}`)}</p>
                      <p className="text-xs text-slate-500">{t(`chatbot.${key}Desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep('form')}
                className="mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow transition-all hover:scale-105"
              >
                {t('chatbot.startButton')}
              </button>
            </div>
          )}

          {/* ── Form step ── */}
          {step === 'form' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <button onClick={() => setStep('intro')} className="text-amber-600 text-sm hover:underline flex items-center gap-1">
                ← {t('common.cancel')}
              </button>

              {formErrors.length > 0 && (
                <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                  {formErrors.map((e, i) => <p key={i}>• {e}</p>)}
                </div>
              )}

              {[
                { label: `⚖️ ${t('chatbot.weight')} (kg)`, type: 'number', key: 'weight' as const, min: 1, max: 500, placeholder: '70' },
                { label: `📏 ${t('chatbot.height')} (cm)`, type: 'number', key: 'height' as const, min: 1, max: 300, placeholder: '175' },
              ].map(({ label, type, key, min, max, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                  <input
                    type={type}
                    min={min}
                    max={max}
                    placeholder={placeholder}
                    value={(userProfile[key] as number) || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, [key]: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none"
                  />
                </div>
              ))}

              {[
                {
                  label: `🏃 ${t('chatbot.activityLevel')}`, key: 'activityLevel' as const,
                  options: ['sedentary', 'light', 'moderate', 'active', 'veryActive'].map((v) => ({ value: v, label: t(`chatbot.activity.${v}`) })),
                },
                {
                  label: `💪 ${t('chatbot.physicalStateLabel')}`, key: 'physicalState' as const,
                  options: ['poor', 'average', 'good', 'excellent'].map((v) => ({ value: v, label: t(`chatbot.physicalState.${v}`) })),
                },
                {
                  label: `🧠 ${t('chatbot.mentalStateLabel')}`, key: 'mentalState' as const,
                  options: ['stressed', 'anxious', 'stable', 'positive'].map((v) => ({ value: v, label: t(`chatbot.mentalState.${v}`) })),
                },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                  <select
                    value={userProfile[key] as string}
                    onChange={(e) => setUserProfile({ ...userProfile, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none"
                  >
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">🎯 {t('chatbot.goals')}</label>
                <textarea
                  value={userProfile.goals}
                  onChange={(e) => setUserProfile({ ...userProfile, goals: e.target.value })}
                  rows={3}
                  placeholder={t('chatbot.goalsPlaceholder')}
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={startChat}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow transition-all hover:scale-105"
              >
                {loading ? t('chatbot.loading') : t('chatbot.continueButton')}
              </button>
            </div>
          )}

          {/* ── Chat step ── */}
          {step === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none'
                        : 'bg-amber-50 text-slate-800 rounded-bl-none border border-amber-100'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-amber-100' : 'text-amber-500'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-amber-50 border border-amber-100 px-3 py-2 rounded-2xl rounded-bl-none flex gap-1 items-center">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="shrink-0 p-3 border-t border-amber-100 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  disabled={loading}
                  placeholder={t('chatbot.inputPlaceholder')}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border-2 border-amber-200 focus:border-amber-500 outline-none disabled:opacity-50"
                  aria-label={t('chatbot.inputPlaceholder')}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !inputValue.trim()}
                  aria-label={t('chatbot.sendButton')}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 text-white transition shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
};

export default FloatingChatBot;
