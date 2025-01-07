import 'package:chatapp/screens/home.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:chatapp/dtos/requests/login_request.dart';
import 'package:chatapp/dtos/responses/error_response.dart';
import 'package:chatapp/screens/register.dart';
import 'package:chatapp/services/user_service.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _secureStorage = const FlutterSecureStorage();
  final _usernameController = TextEditingController(text: "vinhngu123");
  final _passwordController = TextEditingController(text: "Vinh12345@");

  final _userService = UserService();
  final _formKey = GlobalKey<FormState>();

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    print("Preparing to send login request...");
    
    final request = LoginRequest(
      username: _usernameController.text,
      password: _passwordController.text,
    );

    try {
      // Gửi yêu cầu đăng nhập qua UserService
      final response = await _userService.login(request);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response.message ?? '')),
      );
      // Lấy token từ phản hồi
      print(response);
      final token = response.data['jwtToken'];
      if (token != null) {
        // Lưu token vào FlutterSecureStorage
        await _secureStorage.write(key: 'jwtToken', value: token);

        String? storageToken = await _secureStorage.read(key: 'jwtToken');
        print(storageToken);
        // Hiển thị thông báo đăng nhập thành công
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login successful')),
        );

        // Chuyển hướng tới màn hình chính hoặc một màn hình khác
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) =>
                Home(), // Thay thế bằng màn hình chính của bạn
          ),
        );
      } else {
        throw Exception("Token không tồn tại trong phản hồi.");
      }
    } catch (e) {
      if (e is ErrorResponseException) {
        // Xử lý lỗi từ phản hồi API
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message)),
        );
        
      } else {
        // Xử lý các lỗi khác
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("An error occurred. Please try again.")),
        );
        print(e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.only(top: 20.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _usernameController,
                decoration: const InputDecoration(
                  label: Text("Username"),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Username cannot be empty";
                  }
                  return null;
                },
              ),
              const SizedBox(
                height: 10,
              ),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  label: Text("Password"),
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Password is required';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(
                height: 20,
              ),
              ElevatedButton(
                onPressed: _login,
                child: const Text("Login"),
              ),
              const SizedBox(
                height: 10,
              ),
              InkWell(
                child: const Text("You don't have an account? Register"),
                onTap: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const Register(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
