
import React from 'react';
import { AI_MODULES } from '../constants';
import { CodeIcon, SettingsIcon, PremiumIcon, CloseIcon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentModuleId: string;
  onModuleChange: (moduleKey: string) => void;
  onOpenSubscriptions: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  currentModuleId,
  onModuleChange,
  onOpenSubscriptions,
  onOpenSettings,
}) => {
  const handleModuleClick = (key: string) => {
    onModuleChange(key);
    if (window.innerWidth < 768) { // Close sidebar on mobile after selection
        setIsOpen(false);
    }
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
            <CodeIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold ml-2">ChatXAI</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-600 md:hidden">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-400 px-2">AI Modules</p>
        {Object.entries(AI_MODULES).map(([key, module]) => (
          <button
            key={key}
            onClick={() => handleModuleClick(key)}
            className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentModuleId === key
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {module.name}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button onClick={onOpenSubscriptions} className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            <PremiumIcon className="w-5 h-5 mr-3 text-yellow-400" />
            Go Premium
        </button>
        <button onClick={onOpenSettings} className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
        </button>
      </div>
    </>
  );

  return (
    <>
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 border-r border-gray-700 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex`}>
            {sidebarContent}
        </aside>
        {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden"></div>}
    </>
  );
};
