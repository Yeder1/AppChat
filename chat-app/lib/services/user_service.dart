import 'dart:convert';
import 'dart:math';
import 'package:chatapp/dtos/requests/register_request.dart';
import 'package:chatapp/dtos/responses/api_response.dart';
import 'package:chatapp/services/api_constants.dart';
import 'package:http/http.dart' as http;

class UserService {
  Future<ApiResponse> register(RegisterRequest request) async {
    final url = Uri.parse('${ApiConstants.baseUrl}/auth/register');
    try{
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );
        return ApiResponse.fromJson(
          jsonDecode(response.body),
          (_) => null,
        );
    }
    catch (e)
    {
      throw Exception('Failed to connect to server: $e');
    }
  }
}
