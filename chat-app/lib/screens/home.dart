import 'package:chatapp/dtos/conversation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class Home extends StatelessWidget {
  List<Conversation> conversations = [
    Conversation(
      conversationId: "afafsi1",
      lastSenderName: "Bach",
      lastMessage: "data1",
      conversationAvatar: "link1",
      conversationName: "Bach",
      lastSendTime: 1,
      isSeen: true,
    ),
    Conversation(
      conversationId: "afafsi2",
      lastSenderName: "trung",
      lastMessage: "data2",
      conversationAvatar: "link2",
      conversationName: "trung",
      lastSendTime: 2,
      isSeen: false,
    ),
    Conversation(
      conversationId: "afafsi3",
      lastSenderName: "linh",
      lastMessage: "data3",
      conversationAvatar: "link3",
      conversationName: "linh",
      lastSendTime: 3,
      isSeen: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Column(
        children: [
          const TextField(
            decoration: InputDecoration(hintText: "Search"),
          ),
          SingleChildScrollView(
            child: Column(
              children: conversations.map((e) {
                return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        Expanded(
                            child: Row(
                          children: [
                            Container(
                                width: 24,
                                height: 24,
                                color: Colors.pinkAccent),
                            const SizedBox(
                              width: 20,
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(e.conversationName),
                                Row(
                                  children: [
                                    Text("${e.lastSenderName}: "),
                                    Text("${e.lastMessage} "),
                                    Text("${e.lastSendTime}")
                                  ],
                                )
                              ],
                            ),
                          ],
                        )),
                        const Icon(Icons.notifications)
                      ],
                    ));
              }).toList(),
            ),
          )
        ],
      ),
    );
  }
}
