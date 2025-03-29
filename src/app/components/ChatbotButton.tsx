'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import InfoIcon from '@mui/icons-material/Info'

// 消息类型定义
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// API响应类型
interface ChatResponse {
  id: string;
  content: string;
  modelUsed?: string; // 可选字段，API返回使用的模型
}

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是DeepSeek AI助手，专注于复杂推理和深度思考。我可以展示思考过程，帮助您解决各种问题。有什么我可以帮助您的吗？'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // 处理聊天窗口的打开和关闭
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // 筛选出所有用户消息和对应的助手回复
      // 确保不发送初始欢迎消息
      const messagesToSend = messages
        .filter((msg, index) => {
          // 跳过初始欢迎消息（仅当是第一条消息且是助手消息时）
          if (index === 0 && msg.role === 'assistant' && messages.length === 1) {
            return false;
          }
          return true;
        })
        .concat([userMessage]);
      
      // 调用API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messagesToSend
        })
      });
      
      const data: ChatResponse = await response.json();
      
      // 设置使用的模型
      if (data.modelUsed) {
        setCurrentModel(data.modelUsed);
        setIsSimulated(false);
      } else {
        // 检查响应内容是否为模拟内容
        setIsSimulated(data.content.includes('这是一个模拟响应'));
      }
      
      // 添加AI回复
      setMessages(prev => [...prev, {
        id: data.id || Date.now().toString(),
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      // 添加错误消息
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '很抱歉，处理您的请求时发生了错误。请稍后再试。'
      }]);
      setIsSimulated(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 解析消息内容，提取推理部分
  const parseMessageContent = (content: string) => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) {
      return {
        reasoning: thinkMatch[1].trim(),
        content: content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
      };
    }
    return { content };
  };

  // 获取模型状态显示
  const getModelStatusText = () => {
    if (isSimulated) {
      return '模拟模式';
    }
    return currentModel ? `使用: ${currentModel}` : '真实模式';
  };

  // 获取模型状态颜色
  const getModelStatusColor = () => {
    if (isSimulated) {
      return 'text-orange-500';
    }
    return 'text-green-500';
  };

  return (
    <>
      {/* 悬浮图标按钮 */}
      <button
        onClick={toggleChat}
        className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-20"
        aria-label="Open DeepSeek R1 Chat"
      >
        {isOpen ? (
          <CloseIcon className="text-white text-2xl" />
        ) : (
          <div className="relative w-10 h-10">
            <Image
              src="/img/deepseek.jpg"
              alt="DeepSeek R1"
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
      </button>

      {/* 聊天对话框 */}
      {isOpen && (
        <div className="fixed right-8 bottom-24 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-10 border border-gray-200">
          {/* 聊天头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-3">
                <Image
                  src="/img/deepseek.jpg"
                  alt="DeepSeek R1"
                  fill
                  className="rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">DeepSeek AI助手</h3>
                <p className="text-xs opacity-80">强大的推理引擎，能够展示思考过程</p>
              </div>
              <div className="flex items-center">
                <InfoIcon className="text-sm mr-1 opacity-80" fontSize="small" />
                <span className={`text-xs font-medium ${getModelStatusColor()}`}>
                  {getModelStatusText()}
                </span>
              </div>
            </div>
          </div>
          
          {/* 聊天内容区 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => {
              const { reasoning, content } = message.role === 'assistant' 
                ? parseMessageContent(message.content) 
                : { reasoning: undefined, content: message.content };
              
              return (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {reasoning && (
                      <div className="mb-2 p-2 bg-gray-100 text-gray-700 text-sm rounded-md">
                        <div className="font-medium text-xs text-gray-500 mb-1">思考过程:</div>
                        <div className="whitespace-pre-wrap">{reasoning}</div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框区域 */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入您的问题..."
                className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-full p-2 px-4 ${
                  isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                disabled={isLoading || !input.trim()}
              >
                <SendIcon fontSize="small" />
              </button>
            </div>
            {isLoading && (
              <div className="text-xs text-gray-500 mt-1 text-center">
                DeepSeek R1正在思考中...
              </div>
            )}
          </form>
        </div>
      )}
    </>
  )
}

export default ChatbotButton 