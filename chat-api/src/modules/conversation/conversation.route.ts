import express from "express";
import { chatToConversation, detailConversation, startConversation, getListConversation, updateSeenMessageOfConversation,  } from "./conversation.controller";
import { validateData } from "@middlewares/validation";
import { chatToConversationSchema, startConversationSchema } from "./conversation.interface";

const conversationRouter = express.Router();

conversationRouter.get(
  "/:conversationId",
  detailConversation
);

conversationRouter.get(
  "/",
  getListConversation
);

conversationRouter.post(
  "/start",
  validateData(startConversationSchema),
  startConversation
);

conversationRouter.post(
  "/:conversationId/chat",
  validateData(chatToConversationSchema),
  chatToConversation
)

conversationRouter.put(
  "/:conversationId/seen",
  updateSeenMessageOfConversation
)

export default conversationRouter;
