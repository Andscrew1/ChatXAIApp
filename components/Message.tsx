import React, { useState, useEffect } from 'react';
import { Message as MessageType } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';
// FIX: Import `tomorrow` style directly. React.lazy is for components, but `tomorrow` is a style object.
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Lazy load markdown and syntax highlighter for better performance
const ReactMarkdown = React.lazy(() => import('react-markdown'));
const SyntaxHighlighter = React.lazy(() => import('react-syntax-highlighter').then(module => ({ default: module.Prism })) ) as any;

const CodeBlock: React.FC<{ language: string | undefined; value: string }> = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative my-2 rounded-lg bg-gray-900">
       <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
        <span className="text-sm text-gray-400">{language || 'code'}</span>
        <button onClick={handleCopy} className="text-sm text-gray-400 hover:text-white transition-colors">
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <React.Suspense fallback={<div className="p-4">Loading code...</div>}>
          <SyntaxHighlighter language={language} style={tomorrow} PreTag="div">
              {String(value).replace(/\n$/, '')}
          </SyntaxHighlighter>
      </React.Suspense>
    </div>
  );
};

export const Message: React.FC<{ message: MessageType }> = ({ message }) => {
    const isUser = message.sender === 'user';
    
    // Fallback for Suspense
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const renderers = {
        code: ({node, inline, className, children, ...props}: any) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
          ) : (
            <code className="bg-gray-700 text-primary rounded px-1" {...props}>
              {children}
            </code>
          );
        },
    };
    
    return (
        <div className={`flex items-start gap-4 p-4 md:p-6 ${isUser ? 'bg-gray-800' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gray-600' : 'bg-primary'}`}>
                {isUser ? <UserIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5 text-gray-900" />}
            </div>
            <div className="flex-1 pt-1 overflow-hidden">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                   {isClient ? (
                        <React.Suspense fallback={<div>{message.text}</div>}>
                            <ReactMarkdown components={renderers}>
                                {message.text}
                            </ReactMarkdown>
                        </React.Suspense>
                   ) : (
                       <div>{message.text}</div>
                   )}
                </div>
            </div>
        </div>
    );
};