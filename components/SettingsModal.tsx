import React, { useState } from 'react';
import { CloseIcon, DownloadIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  installPromptEvent: any;
  onInstallClick: () => void;
}

const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, installPromptEvent, onInstallClick }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [streamResponse, setStreamResponse] = useState(true);
    const [saveHistory, setSaveHistory] = useState(true);

    if (!isOpen) return null;
    
    const handleClearHistory = () => {
        if(confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
            alert('Chat history cleared.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {installPromptEvent && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Application</h3>
                            <button 
                                onClick={onInstallClick}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary hover:bg-primary-hover rounded-md text-white font-semibold transition-colors">
                                <DownloadIcon className="w-5 h-5" />
                                Install as App
                            </button>
                             <p className="text-xs text-gray-500">Install ChatXAI on your device for a native app-like experience, including offline access.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Interface</h3>
                        <Toggle label="Dark Mode" enabled={darkMode} setEnabled={setDarkMode} />
                        <p className="text-xs text-gray-500">Dark mode is currently locked on. Light mode coming soon!</p>
                    </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Chat</h3>
                        <Toggle label="Stream Responses" enabled={streamResponse} setEnabled={setStreamResponse} />
                        <Toggle label="Save Chat History" enabled={saveHistory} setEnabled={setSaveHistory} />
                    </div>

                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-gray-200">Data</h3>
                         <button 
                            onClick={handleClearHistory}
                            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-red-500/80 rounded-md text-red-400 hover:text-white transition-colors">
                            Clear Chat History
                         </button>
                    </div>
                </div>

                <div className="p-6 bg-gray-900/50 rounded-b-xl flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-md font-semibold transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};