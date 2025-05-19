'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
  FiSettings,
  FiUsers,
  FiPieChart,
} from 'react-icons/fi';
import { generateAnswer } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';



type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg: Message = {
    id: Date.now(),
    role: 'user',
    text: input,
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput('');
  setIsTyping(true);

  try {
    const botReply = await generateAnswer(userMsg.text);

    const botMsg: Message = {
      id: Date.now() + 1,
      role: 'bot',
      text: botReply || 'Sorry, no reply from Gemini.',
    };

    setMessages((prev) => [...prev, botMsg]);
  } catch (error) {
    console.error('Error getting Gemini reply:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Oops, something went wrong with Gemini API.',
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div
      className={`min-h-screen flex ${
        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-gray-100'
      } transition-colors duration-400`}
    >
      {/* Left Panel */}
      <AnimatePresence>
        {showLeftPanel && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 w-64 p-6 flex flex-col
              bg-opacity-90 backdrop-blur-md rounded-r-2xl shadow-md
              ${
                theme === 'light'
                  ? 'bg-white border border-gray-200 text-gray-900'
                  : 'bg-gray-800 border border-gray-700 text-gray-100'
              }`}
          >
            <h2 className="text-2xl font-semibold mb-10 tracking-wide select-none">
              Navigation
            </h2>

            <nav className="flex flex-col gap-5 flex-grow">
              {[
                { label: 'Dashboard', icon: <FiPieChart size={22} /> },
                { label: 'Chats', icon: <FiUsers size={22} /> },
                { label: 'Settings', icon: <FiSettings size={22} /> },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  aria-label={label}
                  type="button"
                >
                  <span className={theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}>
                    {icon}
                  </span>
                  <span className="font-medium text-base">{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={toggleTheme}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Toggle theme"
                type="button"
              >
                Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 transition font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Hide left panel"
                type="button"
              >
                <FiArrowLeft size={16} />
                Hide Panel
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Left Panel Toggle Button */}
      {!showLeftPanel && (
        <button
          onClick={() => setShowLeftPanel(true)}
          className="fixed top-28 left-0 z-50 hidden md:flex items-center justify-center w-10 h-10 rounded-r-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open left panel"
          type="button"
        >
          <FiArrowRight size={18} />
        </button>
      )}

      {/* Middle Chat Area */}
      <main className="flex flex-col flex-grow p-6 max-h-screen">
        <div
          className={`flex flex-col flex-grow rounded-2xl overflow-hidden border ${
            theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
          } shadow-md`}
        >
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`flex items-end ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'bot' && (
                    <div
                      className={`w-7 h-7 rounded-full mr-2 flex items-center justify-center text-xs select-none
                        ${
                          theme === 'light'
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                    >
                      🤖
                    </div>
                  )}
                  <div
  className={`px-5 py-3 rounded-xl shadow-sm text-base break-words select-text prose dark:prose-invert prose-sm
    ${
      msg.role === 'user'
        ? 'max-w-xs bg-indigo-600 text-white rounded-br-none prose-headings:text-white prose-p:text-white'
        : theme === 'light'
        ? 'max-w-3xl md:max-w-2xl bg-gray-100 text-gray-900 rounded-bl-none'
        : 'max-w-3xl md:max-w-2xl bg-gray-700 text-gray-100 rounded-bl-none'
    }`}
>
  {msg.role === 'bot' ? (
    <ReactMarkdown>{msg.text}</ReactMarkdown>
  ) : (
    msg.text
  )}
</div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 ml-2 flex items-center justify-center text-xs text-white select-none">
                      👤
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div
                className={`text-sm italic ml-10 select-none ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                Bot is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className={`border-t flex items-center gap-3 px-5 py-4 ${
              theme === 'light'
                ? 'border-gray-200 bg-white'
                : 'border-gray-700 bg-gray-800'
            }`}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className={`flex-1 px-4 py-3 rounded-lg border bg-white text-base placeholder-gray-400 focus:ring-2 outline-none transition
                ${
                  theme === 'light'
                    ? 'border-gray-300 text-black focus:ring-indigo-500'
                    : 'border-gray-600 bg-gray-700 text-black focus:ring-indigo-400'
                }`}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Send message"
              type="button"
            >
              <FiSend size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className={`flex items-center justify-center p-3 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 ${
                theme === 'light'
                  ? 'bg-gray-300 hover:bg-gray-400 text-gray-700 focus:ring-red-500'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200 focus:ring-red-400'
              }`}
              aria-label="Clear chat"
              type="button"
            >
              <FiTrash2 size={20} />
            </motion.button>
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <AnimatePresence>
        {showRightPanel && (
          <motion.aside
            initial={{ x: 260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 260, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 w-64 p-6 flex flex-col
              bg-opacity-90 backdrop-blur-md rounded-l-2xl shadow-md
              ${
                theme === 'light'
                  ? 'bg-white border border-gray-200 text-gray-900'
                  : 'bg-gray-800 border border-gray-700 text-gray-100'
              }`}
          >
            <h2 className="text-2xl font-semibold mb-8 tracking-wide select-none">
              Profile
            </h2>
            <div
              className={`flex flex-col gap-3 text-base select-text
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            >
              <p>
                <span className="font-semibold">Name:</span> Admin
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span className="flex items-center gap-1 text-green-500 select-none">
                  Online <span>●</span>
                </span>
              </p>
              <p className="mt-3 font-semibold">Activity:</p>
              <ul
                className={`list-disc pl-5 space-y-1 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {['Updated settings', 'Chat with users', 'Cleared logs'].map((activity) => (
                  <li
                    key={activity}
                    className={`cursor-pointer hover:text-indigo-600 transition ${
                      theme === 'light' ? '' : 'hover:text-indigo-400'
                    }`}
                    tabIndex={0}
                  >
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowRightPanel(false)}
              className="mt-auto flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 transition font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Hide right panel"
              type="button"
            >
              Hide Panel
              <FiArrowRight size={16} />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Right Panel Toggle Button */}
      {!showRightPanel && (
        <button
          onClick={() => setShowRightPanel(true)}
          className="fixed top-28 right-0 z-50 hidden lg:flex items-center justify-center w-10 h-10 rounded-l-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open right panel"
          type="button"
        >
          <FiArrowLeft size={18} />
        </button>
      )}
    </div>
  );
}
