import 'dart:convert';

class Conversation {
  String conversationId;
  String lastSenderName;
  String lastMessage;
  String conversationAvatar;
  String conversationName;
  int lastSendTime;
  bool isSeen;


  Conversation({
    required this.conversationId,
    required this.lastSenderName,
    required this.lastMessage,
    required this.conversationAvatar,
    required this.conversationName,
    required this.lastSendTime,
    required this.isSeen,
  });


  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      conversationId: json['conversationId'],
      lastSenderName: json['lastSenderName'],
      lastMessage: json['lastMessage'],
      conversationAvatar: json['conversationAvatar'],
      conversationName: json['conversationName'],
      lastSendTime: json['lastSendTime'],
      isSeen: json['isSeen'],
    );
  }


  Map<String, dynamic> toJson() {
    return {
      'conversationId': conversationId,
      'lastSenderName': lastSenderName,
      'lastMessage': lastMessage,
      'conversationAvatar': conversationAvatar,
      'conversationName': conversationName,
      'lastSendTime': lastSendTime,
      'isSeen': isSeen,
    };
  }
}

