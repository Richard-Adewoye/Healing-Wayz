'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  caseId: string;
  avatarLetter: string;
  unread?: boolean;
  lastMessage: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    avatarLetter: 'A',
    lastMessage: 'Good question. Let me confirm the detail...',
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        text: "Thanks for reaching out — we've received your consultation request and will begin reviewing your case shortly.",
        timestamp: 'Just now',
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'm',
        timestamp: 'Just now',
      },
      {
        id: 'm3',
        sender: 'agent',
        text: 'Good question. Let me confirm the details with our clinical advisor and follow up within the day.',
        timestamp: 'Just now',
      },
    ],
  },
  {
    id: '2',
    name: 'Amara Chukwu',
    caseId: 'HW-2026-531972',
    avatarLetter: 'A',
    lastMessage: 'Thanks for reaching out — we\'ve received...',
    messages: [
      {
        id: 'm1',
        sender: 'agent',
        text: 'Thanks for reaching out — we\'ve received your request.',
        timestamp: '2h ago',
      },
    ],
  },
  {
    id: '3',
    name: 'Amara Chukwu',
    caseId: 'HW-2026-531973',
    avatarLetter: 'A',
    unread: true,
    lastMessage: 'Thank you! Also, will I need to arrange ...',
    messages: [],
  },
  {
    id: '4',
    name: 'Kwame Owusu',
    caseId: 'HW-2026-531974',
    avatarLetter: 'K',
    lastMessage: 'It was our pleasure, Kwame. Wishing you ...',
    messages: [],
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [inputText, setInputText] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const activeConversation = conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: inputText,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            lastMessage: inputText,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    setInputText('');
  };

  return (
    <div className="p-8 h-[calc(100vh-73px)] flex flex-col font-sans">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">Messages</h2>

      {/* Main Container Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex min-h-0 shadow-sm">
        {/* Left Sidebar - Conversation List */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left p-4 transition-colors relative block ${
                    isSelected
                      ? 'bg-[#ECFDF5] border-l-4 border-[#10B981]'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-sm">{conv.name}</span>
                    {conv.unread && (
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block" />
                    )}
                  </div>
                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-slate-600' : 'text-slate-500'
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Active Chat Header */}
          <div className="p-4 px-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
              {activeConversation.avatarLetter}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight">
                {activeConversation.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {activeConversation.caseId}
              </p>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeConversation.messages.map((msg) => {
              const isAgent = msg.sender === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                      isAgent
                        ? 'bg-[#34A853] text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none min-w-[80px]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1 ${
                        isAgent ? 'text-emerald-800/60' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-300 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#34A853] hover:bg-[#2e9649] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}