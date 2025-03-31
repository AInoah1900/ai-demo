// DeepSeek R1聊天API路由

// 设置边缘运行时以支持流式响应
export const runtime = 'edge';

// 定义消息类型
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 定义API响应类型
interface DeepSeekResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    }
  }>;
  error?: {
    message: string;
  }
}

// DeepSeek可用模型ID
const MODELS = {
  primary: 'deepseek-reasoner', // 主要推理模型 (适用于需要思考的复杂问题)
  fallback: 'deepseek-chat',    // 备用对话模型 (如果主要模型不可用)
};

export async function POST(req: Request) {
  try {
    // 解析请求
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // 检查是否配置了DeepSeek API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.log('未找到DeepSeek API密钥，使用模拟响应');
      return getSimulatedResponse(userMessage);
    }

    // 尝试使用主要模型，如果失败则回退到备用模型
    let modelToUse = MODELS.primary;
    let errorMessage = null;
    
    try {
      // 调用真实的DeepSeek API
      const response = await fetchFromDeepSeek(apiKey, modelToUse, messages);
      
      // 提取AI助手的回复
      const assistantMessage = response.choices[0].message.content;
      
      return new Response(JSON.stringify({
        content: assistantMessage,
        id: response.id || Date.now().toString()
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (primaryModelError: unknown) {
      console.error(`使用模型 ${modelToUse} 调用API失败:`, primaryModelError);
      errorMessage = primaryModelError instanceof Error ? primaryModelError.message : '未知错误';
      
      // 尝试使用备用模型
      try {
        console.log(`尝试使用备用模型 ${MODELS.fallback}`);
        modelToUse = MODELS.fallback;
        
        const response = await fetchFromDeepSeek(apiKey, modelToUse, messages);
        
        // 提取AI助手的回复
        const assistantMessage = response.choices[0].message.content;
        
        return new Response(JSON.stringify({
          content: assistantMessage,
          id: response.id || Date.now().toString(),
          modelUsed: modelToUse  // 告知客户端使用了哪个模型
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (fallbackModelError) {
        console.error(`使用备用模型 ${modelToUse} 调用API失败:`, fallbackModelError);
        // 两个模型都失败了，回退到模拟响应
        return getSimulatedResponse(
          userMessage, 
          `(注意: DeepSeek API调用失败，错误信息: ${errorMessage}，使用模拟响应)`
        );
      }
    }
  } catch (error) {
    console.error("Chat API错误:", error);
    return new Response(
      JSON.stringify({
        error: "处理请求时出现错误",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// 封装API调用函数
async function fetchFromDeepSeek(
  apiKey: string, 
  modelId: string, 
  messages: Message[]
): Promise<DeepSeekResponse> {
  // 过滤消息，确保第一条消息是用户消息
  // 如果是深度推理模型，则需要特别处理
  let processedMessages = messages;
  
  if (modelId === MODELS.primary) {
    // 确保消息数组中的第一条非系统消息是用户消息
    // 移除任何可能导致问题的初始助手消息
    processedMessages = messages.filter((msg, index) => {
      // 保留所有用户消息
      if (msg.role === 'user') return true;
      // 保留系统消息
      if (msg.role === 'system') return true;
      // 如果是助手消息，确保前面有用户消息
      if (msg.role === 'assistant') {
        // 查找此消息之前是否有用户消息
        const hasPreviousUserMessage = messages.slice(0, index).some(m => m.role === 'user');
        return hasPreviousUserMessage;
      }
      return false;
    });
    
    // 如果没有用户消息，无法调用API
    if (!processedMessages.some(msg => msg.role === 'user')) {
      throw new Error('需要至少一条用户消息才能调用推理模型');
    }
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: `你是DeepSeek AI助手，一个专注于复杂推理的智能模型。
${modelId === MODELS.primary ? `作为推理专家，你的特点是能够"思考后回答"，使用<think>标签进行内部推理。

请按照以下格式回复：
1. 对于复杂问题，首先使用<think>标签进行详细推理，分析问题的各个方面
2. 然后给出最终答案，确保答案简洁明了但内容全面` : '你应该提供有深度的、精确的回答'}

你的风格应该是：
- 专业且精确
- 回答要有深度和洞察力
- 语言要流畅易懂
- 倾向于使用中文回复中文问题

对于数学、科学和编程问题，尤其要展示清晰的解题思路。`
        },
        ...processedMessages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('DeepSeek API错误:', data);
    throw new Error(data.error?.message || '调用DeepSeek API时出错');
  }
  
  return data;
}

// 模拟响应函数（改名避免与React Hook命名冲突）
function getSimulatedResponse(userMessage: string, prefix = '') {
  // 构建模拟的DeepSeek R1响应
  const response = `<think>
这是一个用户问题，我需要思考如何回答："${userMessage}"
作为DeepSeek AI助手，我应该表现得非常专业、友好，并提供详细、准确的回答。
我应该先理解用户的问题，然后组织我的回答结构。
</think>

${prefix ? prefix + '\n\n' : ''}作为DeepSeek AI助手，我已收到您的问题。${userMessage.includes('?') || userMessage.includes('？') ? '' : '关于"' + userMessage + '"，'}我可以提供以下信息：

这是一个模拟响应。要使用真实的DeepSeek模型，您需要设置DEEPSEEK_API_KEY环境变量，并确保您的账号可以访问所需的模型。`;

  // 返回模拟响应
  return new Response(JSON.stringify({ 
    content: response,
    id: Date.now().toString() 
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
} 