"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { 
  Send, 
  Paperclip, 
  Search, 
  Plus, 
  MessageSquare, 
  Globe, 
  Mail, 
  MessageCircle,
  MoreVertical,
  X,
  Bot,
  User as UserIcon,
  TrendingDown,
  Zap,
  BarChart3,
  Layout
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

// History items can be persisted to a database or local storage in the future.
// For now, we'll maintain a clean sidebar as requested.
const chatHistoryItems = [];

const suggestions = [
  { text: "Analyze my revenue", icon: TrendingDown },
  { text: "Compare AdMob vs AppLovin", icon: Zap },
  { text: "Show DAU trends", icon: BarChart3 },
  { text: "Generate dashboard", icon: Layout },
];

export default function ChatbotPage() {
  const { messages, sendMessage, status, setMessages, error } = useChat({
    api: '/api/chat',
    onError: (err) => {
      console.error('Chat Error:', err);
      toast.error(err.message || 'Failed to get a response from the AI');
    }
  });
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('adstack_chat_history');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adstack_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleNewChat = () => {
    // Save current chat if it has messages
    if (messages.length > 0) {
      saveCurrentChatToHistory();
    }
    setMessages([]);
    setInput('');
    setCurrentChatId(null);
  };

  const saveCurrentChatToHistory = () => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage 
      ? (firstUserMessage.parts.find(p => p.type === 'text')?.text.substring(0, 30) + '...')
      : 'New Conversation';
    
    const newHistoryItem = {
      id: currentChatId || Date.now().toString(),
      title,
      messages: [...messages],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      platform: 'Web'
    };

    setChatHistory(prev => {
      const filtered = prev.filter(item => item.id !== newHistoryItem.id);
      return [newHistoryItem, ...filtered];
    });
  };

  const handleLoadChat = (item) => {
    setMessages(item.messages);
    setCurrentChatId(item.id);
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const currentInput = input;
    setInput('');
    await sendMessage({ text: currentInput });
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#090B10]">
      {/* Sidebar - Chat History */}
      <div className="w-80 border-r border-[#1E293B] flex flex-col bg-[#0B0E14]">
        <div className="p-4 space-y-4">
          <button 
            onClick={handleNewChat}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5C59E8] to-[#8B5CF6] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand/20 active:scale-95"
          >
            <Plus size={18} />
            New Chat
          </button>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#151921] border border-[#1E293B] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all text-white placeholder:text-[#475569]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 opacity-40">
              <MessageSquare size={32} className="text-[#475569]" />
              <p className="text-xs text-[#475569]">No recent chats</p>
            </div>
          ) : (
            chatHistory
              .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleLoadChat(item)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all",
                  currentChatId === item.id ? "bg-brand/10 border border-brand/20" : "hover:bg-[#151921]"
                )}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                   <Globe size={16} className={currentChatId === item.id ? "text-brand" : "text-[#475569]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "text-sm font-medium truncate",
                      currentChatId === item.id ? "text-brand" : "text-white"
                    )}>{item.title}</h3>
                    <span className="text-[10px] text-[#475569] shrink-0">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      currentChatId === item.id ? "bg-brand/10 text-brand" : "bg-blue-400/10 text-blue-400"
                    )}>
                      {item.platform}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#090B10]">
        {/* Header */}
        <div className="h-16 border-b border-[#1E293B] flex items-center justify-between px-6 bg-[#090B10]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <X 
              className="text-[#475569] cursor-pointer hover:text-white transition-colors" 
              size={20} 
              onClick={handleNewChat}
            />
            <h1 className="text-lg font-bold text-white">AI Chatbot</h1>
          </div>
          <button className="p-2 hover:bg-[#151921] rounded-lg transition-colors">
            <MoreVertical size={20} className="text-[#475569]" />
          </button>
        </div>

        {/* Messages / Welcome Screen */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-[#151921] rounded-[24px] flex items-center justify-center shadow-xl border border-[#1E293B]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-[#8B5CF6] flex items-center justify-center">
                  <MessageSquare className="text-white" size={20} />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  What can I help you with?
                </h2>
                <p className="text-[#94A3B8] text-lg max-w-md mx-auto leading-relaxed">
                  Ask about ad revenue, compare networks, analyze performance, or generate dynamic dashboards.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="px-6 py-3 bg-[#11141D] hover:bg-[#151921] border border-[#1E293B] rounded-2xl text-sm font-semibold text-white transition-all flex items-center gap-2 hover:border-brand/50 hover:shadow-lg active:scale-95"
                  >
                    <s.icon size={16} className="text-brand" />
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-10">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={cn(
                    "flex gap-4 group",
                    m.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-[#1E293B]",
                    m.role === 'user' ? "bg-brand/10 border-brand/20" : "bg-[#11141D]"
                  )}>
                    {m.role === 'user' ? <UserIcon size={18} className="text-brand" /> : <Bot size={18} className="text-brand" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] space-y-2",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-5 py-3.5 rounded-3xl transition-all",
                      m.role === 'user' 
                        ? "bg-brand text-white rounded-tr-sm" 
                        : "bg-[#11141D] border border-[#1E293B] text-slate-200 rounded-tl-sm shadow-sm"
                    )}>
                      {m.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return <div key={i} className="text-[15px] leading-relaxed whitespace-pre-wrap">{part.text}</div>;
                        }
                        if (part.type === 'reasoning') {
                           return <div key={i} className="text-[13px] text-slate-400 italic mb-2">Reasoning: {part.text}</div>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#11141D] border border-[#1E293B] flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-brand animate-pulse" />
                  </div>
                  <div className="px-5 py-3.5 bg-[#11141D] border border-[#1E293B] rounded-3xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 md:px-10 md:pb-10 pt-0">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="bg-[#11141D] border border-[#1E293B] rounded-[24px] focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 transition-all shadow-2xl p-2.5 flex items-center gap-1">
              <textarea 
                placeholder="Type your message... (Enter=send, Alt+Enter=newline)" 
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-[#475569] px-4 py-2.5 text-sm resize-none custom-scrollbar"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.altKey) {
                    e.preventDefault();
                    handleSubmit();
                  } else if (e.key === 'Enter' && e.altKey) {
                    setInput(prev => prev + '\n');
                  }
                }}
              />
              <div className="flex items-center gap-1.5 px-2">
                <button 
                  type="button" 
                  className="p-2.5 text-[#475569] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <Paperclip size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={!input?.trim() || isLoading}
                  className="p-2.5 bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:hover:bg-brand text-white rounded-xl transition-all shadow-lg shadow-brand/20 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
