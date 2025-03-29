// 为AI SDK提供类型定义

declare module 'ai' {
  export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
    content: string;
    createdAt?: Date;
    reasoning?: string;
  }

  export interface UseChatOptions {
    api?: string;
    initialMessages?: Message[];
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    onResponse?: (response: Response) => void | Promise<void>;
    onFinish?: (message: Message) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
  }

  export interface ChatResponse {
    messages: Message[];
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    stop: () => void;
  }

  export function OpenAIStream(response: any): ReadableStream;
  export class StreamingTextResponse extends Response {
    constructor(stream: ReadableStream);
  }
  
  export function streamText(options: any): {
    toDataStreamResponse: (options?: { sendReasoning?: boolean }) => Response;
  };

  // 添加原来在ai/react模块中的类型
  export function useChat(options?: UseChatOptions): ChatResponse;
}

declare module 'openai' {
  export default class OpenAI {
    constructor(options: { apiKey: string });
    chat: {
      completions: {
        create: (options: any) => Promise<any>;
      };
    };
  }
} 