import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SettingsModal } from './components/SettingsModal';
import { AIModule, Message, Attachment } from './types';
import { AI_MODULES, DEFAULT_MODULE } from './constants';
import { sendMessageStream } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentModule, setCurrentModule] = useState<AIModule>(DEFAULT_MODULE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPromptEvent(null);
  };

  const handleModuleChange = (moduleKey: string) => {
    const newModule = AI_MODULES[moduleKey];
    if (newModule && newModule.id !== currentModule.id) {
      setCurrentModule(newModule);
      setMessages([]);
    }
  };

  const handleSend = useCallback(async (inputText: string, attachment?: Attachment) => {
    if (!inputText.trim() && !attachment) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: inputText, 
      sender: 'user',
      attachment 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = { id: aiMessageId, text: '', sender: 'ai' };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const stream = sendMessageStream(currentModule, [...messages, userMessage], inputText, attachment);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunkText } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId ? { ...msg, text: 'Sorry, an error occurred. Please try again.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [currentModule, messages]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentModuleId={currentModule.id}
        onModuleChange={handleModuleChange}
        onOpenSubscriptions={() => setIsSubscriptionModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          currentModule={currentModule}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </main>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        installPromptEvent={installPromptEvent}
        onInstallClick={handleInstallClick}
      />
    </div>
  );
};

export default App;