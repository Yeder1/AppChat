import {
  ConversationSchema,
  MessageSchema,
  UserSchema,
} from "@core/database/models";
import {
  IChatToConversationRequest,
  IChatToConversationResponse,
  IGetDetailsConversationRequest,
  IGetDetailsConversationResponse,
  IGetListConversationRequest,
  IStartConversationRequest,
  IStartConversationResponse,
} from "./conversation.interface";
import { HttpError } from "@core/interfaces/http";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import DatabaseUtils from "@core/utils/database";
import mongoose, { ObjectId } from "mongoose";

const getListConversation = async (req: IGetListConversationRequest) => {
  const conversations = await _getListConversationByUserId(req.authUser.id);

  return conversations.map((c) => ({
    _id: c.id,
    name: c.name ?? "",
    isGroup: c.isGroup,
    paticipants: c.participants,
  }));
}

const startConversation = async (
  req: IStartConversationRequest
): Promise<IStartConversationResponse> => {
  if (!req.isGroup) {
    const userIds = _.take(_.uniq(_.merge([req.authUser.id], req.userIds)), 2);

    const existingUsers = await _getUsersExistedByUserIds(userIds);
    if (existingUsers.length !== userIds.length) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }
    const existingConversation = await _getConversationExistedByUserIds(
      userIds
    );

    if (existingConversation) {
      return {
        _id: existingConversation.id,
        name: existingConversation.name ?? "",
        isGroup: existingConversation.isGroup,
        paticipants: _transformPaticipants(existingConversation.participants),
      };
    }

    return _createConversation({
      ...req,
      userIds: userIds,
    });
  }

  return _createConversation({
    ...req,
    userIds: _.union(req.userIds, [req.authUser.id]),
  });
};

const detailsConversation = async (
  req: IGetDetailsConversationRequest
): Promise<IGetDetailsConversationResponse> => {
  try {
    const conversation = await _getConversationById(req.conversationId);
    if (!conversation) {
      throw new HttpError("Conversation not found", StatusCodes.NOT_FOUND);
    }

    const userHasPermission = conversation.participants.find(
      (p) =>
        p.userId && DatabaseUtils.objectIdToString(p.userId) === req.authUser.id
    );

    if (!userHasPermission) {
      throw new HttpError(
        "You have not permission to join this conversation",
        StatusCodes.FORBIDDEN
      );
    }

    const messages = await MessageSchema.find(
      {
        conversation: DatabaseUtils.toObjectId(req.conversationId),
      },
      {
        _id: 1,
        content: 1,
        sender: 1,
        seenBy: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: "asc" });

    return {
      _id: conversation.id,
      name: conversation.name ?? "",
      isGroup: conversation.isGroup,
      paticipants: _transformPaticipants(conversation.participants),
      messages: messages.map((m) => ({
        _id: m.id,
        content: m.content,
        sender: {
          userId: DatabaseUtils.objectIdToString(m.sender),
        },
        seenBy: _transformPaticipants(m.seenBy),
        createdAt: m.createdAt,
      })),
    };
  } catch (e) {
    throw new HttpError(e);
  }
};

const chatToConversation = async (
  req: IChatToConversationRequest
): Promise<IChatToConversationResponse> => {
  const conversation = await _getConversationById(req.conversationId);
  if (!conversation) {
    throw new HttpError("Conversation not found", StatusCodes.NOT_FOUND);
  }

  const userHasPermission = conversation.participants.find(
    (p) =>
      p.userId && DatabaseUtils.objectIdToString(p.userId) === req.authUser.id
  );

  if (!userHasPermission) {
    throw new HttpError(
      "You have not permission to join this conversation",
      StatusCodes.FORBIDDEN
    );
  }

  return await _createMessage(req);
};

const _getListConversationByUserId = async (userId: string) => {
  return await ConversationSchema.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "participants.userId",
        foreignField: "_id",
        as: "participantsInfo",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        isGroup: 1,
        participants: {
          $map: {
            input: "$participantsInfo",
            as: "participant",
            in: {
              _id: "$$participant._id",
              name: "$$participant.username",
            },
          },
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
}

const _createMessage = async (req: IChatToConversationRequest) => {
  const session = await MessageSchema.startSession();
  try {
    session.startTransaction();

    const message = await MessageSchema.create({
      conversation: DatabaseUtils.toObjectId(req.conversationId),
      content: req.content,
      sender: DatabaseUtils.toObjectId(req.authUser.id),
    });

    session.commitTransaction();

    return {
      _id: message.id,
      content: message.content,
      sender: {
        userId: DatabaseUtils.objectIdToString(message.sender),
      },
      createdAt: message.createdAt,
    };
  } catch (e) {
    session.abortTransaction();
    throw new HttpError(e);
  } finally {
    session.endSession();
  }
};

const _createConversation = async (
  req: IStartConversationRequest
): Promise<IStartConversationResponse> => {
  const session = await ConversationSchema.startSession();
  session.startTransaction();

  try {
    const { isGroup, name, userIds } = req;
    const conversation = await ConversationSchema.create({
      name: name ?? "New conversation",
      isGroup,
      participants: userIds.map((userId) => ({
        userId: DatabaseUtils.toObjectId(userId),
      })),
    });

    session.commitTransaction();

    return {
      _id: conversation.id,
      name: conversation.name ?? "",
      isGroup: conversation.isGroup,
      paticipants: _transformPaticipants(conversation.participants),
    };
  } catch (e) {
    session.abortTransaction();
    throw new HttpError(e);
  } finally {
    session.endSession();
  }
};

const _getUsersExistedByUserIds = async (userIds: string[]) => {
  return await UserSchema.find(
    {
      _id: { $in: DatabaseUtils.toObjectIds(userIds) },
    },
    {
      _id: 1,
      username: 1,
    }
  );
};

const _getConversationExistedByUserIds = async (userIds: string[]) => {
  const conversation = await ConversationSchema.findOne(
    {
      isGroup: false,
      users: { $all: DatabaseUtils.toObjectIds(userIds) },
    },
    {
      _id: 1,
      name: 1,
      isGroup: 1,
      participants: 1,
    }
  );

  return conversation;
};

const _getConversationById = async (conversationId: string) => {
  return await ConversationSchema.findById(conversationId, {
    _id: 1,
    name: 1,
    isGroup: 1,
    participants: 1,
  });
};

const _transformPaticipants = (
  paticipants: { userId?: mongoose.Types.ObjectId | null }[]
) => {
  return paticipants
    .filter((p) => !!p?.userId)
    .map((p) => ({
      userId: DatabaseUtils.objectIdToString(p.userId!),
    }));
};

const ConversationService = {
  getListConversation,
  startConversation,
  detailsConversation,
  chatToConversation,
};

export default ConversationService;
