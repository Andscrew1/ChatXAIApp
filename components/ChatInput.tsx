import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { SendIcon, AttachmentIcon, CloseIcon } from './icons';
import { fileToBase64, validateFile } from '../utils/fileUtils';
import { Attachment } from '../types';

interface ChatInputProps {
  onSend: (text: string, attachment?: Attachment) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [text]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { isValid, error } = validateFile(file);
      if (isValid) {
        setAttachment(file);
      } else {
        alert(error);
        setAttachment(null);
      }
    }
    // Reset file input value to allow re-selecting the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!text.trim() && !attachment) || isLoading) return;

    let attachmentPayload: Attachment | undefined = undefined;
    if (attachment) {
      try {
        const base64Data = await fileToBase64(attachment);
        attachmentPayload = {
          name: attachment.name,
          type: attachment.type,
          data: base64Data,
        };
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Could not process the attached file. Please try again.");
        return;
      }
    }

    onSend(text, attachmentPayload);
    setText('');
    setAttachment(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="max-w-4xl mx-auto">
        {attachment && (
          <div className="mb-2 bg-gray-700 p-2 rounded-lg flex items-center justify-between text-sm">
            <span className="truncate text-gray-300">{attachment.name}</span>
            <button
              onClick={() => setAttachment(null)}
              className="p-1 rounded-full hover:bg-gray-600"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here, or attach a file..."
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pl-12 pr-12 border border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
            rows={1}
            style={{ maxHeight: '200px' }}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <AttachmentIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || (!text.trim() && !attachment)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">ChatXAI can make mistakes. Consider checking important information.</p>
    </div>
  );
};