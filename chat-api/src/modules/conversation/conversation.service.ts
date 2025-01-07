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
  IGetListConversationResponse,
  IStartConversationRequest,
  IStartConversationResponse,
  IUpdateSeenMessage,
} from "./conversation.interface";
import { HttpError, IResponse } from "@core/interfaces/http";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import DatabaseUtils from "@core/utils/database";
import mongoose from "mongoose";
import SocketService from "@modules/socket/socket.service";

const getListConversation = async (req: IGetListConversationRequest): Promise<IResponse<IGetListConversationResponse[]>> => {
  const conversations = await _getListConversationByUserId(req.authUser.id);

  const result = conversations.map((c) => {
    return ({
      _id: c.id,
      name: c.name ?? "",
      isSeen: c.isSeen,
      lastMessage: c.lastMessage,
      isGroup: c.isGroup,
      paticipants: c.participants,
    });
  });

  return {
    message: "Get list conversation successfully",
    data: result
  }
}

const startConversation = async (
  req: IStartConversationRequest
): Promise<IResponse<IStartConversationResponse>> => {
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
        message: "Conversation already existed",
        data: {
          _id: existingConversation.id,
          name: existingConversation.name ?? "",
          isGroup: existingConversation.isGroup,
          paticipants: _transformPaticipants(existingConversation.participants),
        }
      }
    }

    return {
      message: "Create conversation successfully",
      data: await _createConversation({
        ...req,
        userIds,
      }),
    }
  }

  return {
    message: "Create conversation successfully",
    data: await _createConversation({
      ...req,
      userIds: _.union(req.userIds, [req.authUser.id]),
    })
  }
};

const detailsConversation = async (
  req: IGetDetailsConversationRequest
): Promise<IResponse<IGetDetailsConversationResponse>> => {
  try {
    const conversation = await _getConversationAndCheckPermission(req.conversationId, req.authUser.id);
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
      message: "Get conversation successfully",
      data: {
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
          seenBy: m.seenBy.filter(s => !!s.userId).map((s) => ({
            userId: DatabaseUtils.objectIdToString(s.userId!),
            seenAt: s.seenAt,
          })),
          createdAt: m.createdAt,
        })),
      }
    };
  } catch (e) {
    throw new HttpError(e);
  }
};

const chatToConversation = async (
  req: IChatToConversationRequest
): Promise<IResponse<IChatToConversationResponse>> => {
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
  const message = await _createMessage(req);
  const socket = SocketService.getSocketServer();
  socket?.emit("chat", message);
  return {
    message: "Send message successfully",
    data: message,
  };
};

const updateSeenMessageOfConversation = async (req: IUpdateSeenMessage) => {
  try {
    const conversation = await _getConversationAndCheckPermission(req.conversationId, req.authUser.id);
    await MessageSchema.updateMany({
      conversation: conversation._id,
      $nor: [
        {
          seenBy: {
            $elemMatch: { userId: req.authUser.id },
          },
        },
      ],
    }, {
      $addToSet: {
        seenBy: {
          userId: req.authUser.id,
        },
      },
    });


  } catch (e) {
    throw new HttpError(e);
  }
}

const _getConversationAndCheckPermission = async (conversationId: string, userId: string) => {
  const conversation = await _getConversationById(conversationId);
  if (!conversation) {
    throw new HttpError("Conversation not found", StatusCodes.NOT_FOUND);
  }

  const userHasPermission = conversation.participants.find(
    (p) =>
      p.userId && DatabaseUtils.objectIdToString(p.userId) === userId
  );

  if (!userHasPermission) {
    throw new HttpError(
      "You have not permission to join this conversation",
      StatusCodes.FORBIDDEN
    );
  }
  return conversation;
}

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
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'conversation',
        as: 'messages'
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: [{ $sortArray: { input: '$messages', sortBy: { createdAt: -1 } } }, 0] },
      },
    },
    {
      $addFields: {
        "lastMessage.seenBy": {
          $ifNull: ["$lastMessage.seenBy", []],
        },
      },
    },
    {
      $addFields: {
        isSeen: {
          $cond: {
            if: {
              $in: [DatabaseUtils.toObjectId(userId), "$lastMessage.seenBy.userId"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.sender',
        foreignField: '_id',
        as: 'lastMessage.senderData',
      },
    },
    {
      $addFields: {
        'lastMessage.sender': { $arrayElemAt: ['$lastMessage.senderData', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        isGroup: 1,
        isSeen: 1,
        lastMessage: {
          _id: 1,
          content: 1,
          sender: {
            _id: 1,
            username: 1,
            displayName: 1,
            avatar: 1
          },
        },
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
  updateSeenMessageOfConversation,
};

export default ConversationService;
