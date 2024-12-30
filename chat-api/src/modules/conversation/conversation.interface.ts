import { z } from "zod";

export interface IGetListConversationRequest {
  authUser: IAuthUser;
}

export interface IStartConversationRequest {
  name: string;
  userIds: string[];
  isGroup: boolean;
  authUser: IAuthUser;
}

export const startConversationSchema = z.object({
  name: z.string().optional(),
  userIds: z.array(z.string()),
  isGroup: z.boolean().default(false),
});

export interface IPaticipant {
  userId: string;
}

export interface IStartConversationResponse {
  _id: string;
  name: string;
  paticipants: IPaticipant[];
  isGroup: boolean;
}

export interface IGetDetailsConversationRequest {
  conversationId: string;
  authUser: IAuthUser;
}

export interface IMessage {
  _id: string;
  content: string;
  sender: IPaticipant;
  seenBy: IPaticipant[];
  createdAt: Date;
}

export interface IGetDetailsConversationResponse {
  _id: string;
  name: string;
  paticipants: IPaticipant[];
  isGroup: boolean;
  messages: IMessage[];
}

export interface IChatToConversationRequest {
  conversationId: string;
  content: string;
  authUser: IAuthUser;
}

export const chatToConversationSchema = z.object({
  content: z.string(),
});

export interface IChatToConversationResponse {
  _id: string;
  content: string;
  sender: IPaticipant;
  createdAt: Date;
}