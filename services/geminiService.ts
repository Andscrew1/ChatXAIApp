import { GoogleGenAI, GenerateContentResponse, Part, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { AIModule, Message, Attachment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function messageToGeminiParts(message: Message): Part[] {
    const parts: Part[] = [{ text: message.text }];
    if (message.attachment) {
        parts.push({
            inlineData: {
                mimeType: message.attachment.type,
                data: message.attachment.data.split(',')[1] // Remove the base64 prefix
            }
        });
    }
    return parts;
}

export async function* sendMessageStream(
  module: AIModule,
  history: Message[],
  newMessage: string,
  attachment?: Attachment
): AsyncGenerator<GenerateContentResponse, void, unknown> {

  // CRITICAL: Unrestricted and Uncensored configuration
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const chat = ai.chats.create({
    model: module.model,
    config: {
        systemInstruction: module.systemInstruction,
        safetySettings: safetySettings,
        temperature: 0.9, // Higher temperature for more creative/expansive output
        topP: 0.95,
        topK: 40,
    },
    history: history.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: messageToGeminiParts(msg)
    }))
  });

  const messageParts: Part[] = [{ text: newMessage }];
  if (attachment) {
      messageParts.push({
          inlineData: {
              mimeType: attachment.type,
              data: attachment.data.split(',')[1] 
          }
      });
  }

  const stream = await chat.sendMessageStream({ message: messageParts });

  for await (const chunk of stream) {
    yield chunk as GenerateContentResponse;
  }
}