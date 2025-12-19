import React, { useRef, useEffect } from 'react';
import { Message as MessageType, AIModule, Attachment } from '../types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { MenuIcon } from './icons/MenuIcon';
import { CodeIcon, SparklesIcon } from './icons';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  onSend: (text: string, attachment?: Attachment) => void;
  currentModule: AIModule;
  toggleSidebar: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSend, currentModule, toggleSidebar }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col bg-gray-800 h-full">
      <header className="flex items-center p-4 border-b border-gray-700 bg-gray-900 text-white sticky top-0 z-10">
        <button onClick={toggleSidebar} className="p-2 mr-2 rounded-md hover:bg-gray-700 md:hidden">
          <MenuIcon className="w-6 h-6" />
        </button>
        <SparklesIcon className="w-6 h-6 text-primary mr-3"/>
        <div>
            <h1 className="text-lg font-semibold">{currentModule.name}</h1>
            <p className="text-xs text-gray-400">{currentModule.description}</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <SparklesIcon className="w-16 h-16 mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold">ChatXAI</h2>
            <p>Start a conversation with {currentModule.name}.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
               <div className="flex items-start gap-4 p-4 md:p-6">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                   <SparklesIcon className="w-5 h-5 text-gray-900" />
                 </div>
                 <div className="flex-1 pt-1">
                   <div className="animate-pulse flex space-x-2">
                      <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                      <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                      <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
};