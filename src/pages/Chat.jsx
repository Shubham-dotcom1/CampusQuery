import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { generateResponse } from '../services/gemini';

const SUGGESTIONS = [
    { label: "📅 Exam Schedule", query: "When are the final exams?" },
    { label: "📍 Find Lab", query: "Where is the Computer Science Lab?" },
    { label: "📢 Latest Notices", query: "Show me the latest notices for CS department." },
    { label: "🍔 Canteen Menu", query: "What's on the menu today?" },
];

const INITIAL_MESSAGES = [
    {
        id: '1',
        role: 'ai',
        content: "Hi there! I'm your CampusQuery AI assistant. I can help you find notices, events, locations, and more. How represents can I help you today?",
        timestamp: new Date().toISOString(),
    }
];

export default function Chat() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateResponse(text);

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: response.answer,
                actions: response.actions,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Sorry, something went wrong. Please try again.",
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">

            {/* Header / Title Area */}
            <div className="mb-6 flex-none">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                    Ask AI Assistant
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    Powered by Google Gemini • Smart Campus Brain
                </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-6 pb-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            relative max-w-[85%] lg:max-w-[70%] p-5 rounded-2xl shadow-sm text-sm leading-relaxed
                            ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-br-none'
                                : 'bg-white/80 backdrop-blur-md border border-white/50 text-slate-700 rounded-bl-none shadow-glass-sm'
                            }
                            animate-fade-in
                        `}>
                            {/* Role Label */}
                            <div className="mb-1 text-[10px] uppercase tracking-wider font-bold opacity-70">
                                {msg.role === 'user' ? 'You' : 'CampusQuery AI'}
                            </div>

                            {/* Content */}
                            <div className="whitespace-pre-wrap">{msg.content}</div>

                            {/* Actions if any */}
                            {msg.actions && msg.actions.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-200/50">
                                    {msg.actions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-lg transition-colors border border-brand-200"
                                            onClick={() => window.alert(`Navigating to: ${action.value}`)} // Placeholder action handler
                                        >
                                            {action.label} ↗
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className={`text-[10px] mt-2 text-right opacity-60`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/60 backdrop-blur-md px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 border border-white/40">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input & Suggestions Area */}
            <div className="flex-none pt-4">
                {/* Suggestions - Only show when chat is empty or specifically requested (simplified here to always show for demo) */}
                {messages.length < 3 && !isLoading && (
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(suggestion.query)}
                                className="flex-none px-4 py-2 bg-white/50 hover:bg-white border border-white/40 
                                           rounded-full text-xs font-medium text-slate-600 hover:text-brand-600 
                                           shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Box */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-300 to-accent-300 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative flex gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-white/50 shadow-glass"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about campus notice, events..."
                            className="flex-1 border-none bg-transparent focus:ring-0 shadow-none text-base pl-4"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className={`rounded-xl aspect-square px-0 w-12 flex items-center justify-center transition-all duration-300
                                ${input.trim()
                                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/30'
                                    : 'bg-slate-200 text-slate-400'
                                }`}
                        >
                            Ask
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
