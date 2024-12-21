import 'package:chatapp/screens/register.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class Login extends StatelessWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.only(top: 20.0),
        child: Column(
          children: [
            TextFormField(
              decoration: const InputDecoration(
                  label: Text("Username"), border: OutlineInputBorder()),
            ),
            const SizedBox(
              height: 10,
            ),
            TextFormField(
              decoration: const InputDecoration(
                  label: Text("Password"), border: OutlineInputBorder()),
            ),
            const SizedBox(
              height: 20,
            ),
            ElevatedButton(onPressed: () => {}, child: const Text("Login")),
            InkWell(
              child: const Text("You haven't an account?, Register"),
              onTap: () => {
                Navigator.pushReplacement(context,
                    MaterialPageRoute(builder: (context) => const Register()))
              },
            )
          ],
        ),
      ),
    );
  }
}
