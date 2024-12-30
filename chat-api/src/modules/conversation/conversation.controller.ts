import { NextFunction, Request, Response } from "express";
import ConversationService from "./conversation.service";
import { StatusCodes } from "http-status-codes";

const getListConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversations = await ConversationService.getListConversation({
      authUser: req.user!,
    });
    res.status(StatusCodes.OK).send(conversations);
  } catch (e) {
    next(e);
  }
}

const startConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await ConversationService.startConversation({
      ...req.body,
      authUser: req.user!,
    });
    res.status(StatusCodes.CREATED).send(conversation);
  } catch (e) {
    next(e);
  }
};

const detailConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await ConversationService.detailsConversation({
      conversationId: req.params.conversationId,
      authUser: req.user!,
    });
    res.status(StatusCodes.OK).send(conversation);
  } catch (e) {
    next(e);
  }
};

const chatToConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await ConversationService.chatToConversation({
      ...req.body,
      conversationId: req.params.conversationId,
      authUser: req.user!,
    });
    res.status(StatusCodes.OK).send(conversation);
  } catch (e) {
    next(e);
  }
}

export { startConversation, detailConversation, chatToConversation, getListConversation };
