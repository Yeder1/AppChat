import 'dart:convert';
import 'dart:math';
import 'package:chatapp/dtos/requests/register_request.dart';
import 'package:chatapp/dtos/responses/api_response.dart';
import 'package:chatapp/services/api_constants.dart';
import 'package:chatapp/services/http_service.dart';
import 'package:http/http.dart' as http;

class UserService {
  Future<ApiResponse> register(RegisterRequest request) async {
      final response = await HttpService.post(
        '/auth/register',
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );
      return response;
  }
}
