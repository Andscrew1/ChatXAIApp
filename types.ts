export type Sender = 'user' | 'ai';

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 encoded string
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  attachment?: Attachment;
}

export interface AIModule {
  id: string;
  name: string;
  description: string;
  model: string;
  systemInstruction: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
}