import 'dart:convert';
import 'dart:io';
import 'package:chatapp/dtos/responses/api_response.dart';
import 'package:chatapp/dtos/responses/error_response.dart';
import 'package:chatapp/services/api_constants.dart';
import 'package:http/http.dart' as http;

class HttpService {
  static final String baseUrl = ApiConstants.baseUrl;

  /// GET request
  static Future<dynamic> get(String endpoint, {Map<String, String>? headers}) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl$endpoint'), headers: headers);
      return _handleResponse(response);
    } catch (e) {
      _handleException(e);
    }
  }

  /// POST request
  static Future<dynamic> post(String endpoint, {Map<String, String>? headers, dynamic body}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: body,
      );
      return _handleResponse(response);
    } catch (e) {
      _handleException(e);
    }
  }

  /// PUT request
  static Future<dynamic> put(String endpoint, {Map<String, String>? headers, dynamic body}) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(body),
      );
      return _handleResponse(response);
    } catch (e) {
      _handleException(e);
    }
  }

  /// DELETE request
  static Future<dynamic> delete(String endpoint, {Map<String, String>? headers}) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl$endpoint'), headers: headers);
      return _handleResponse(response);
    } catch (e) {
      _handleException(e);
    }
  }

  /// Handles HTTP response and parses JSON
  static ApiResponse _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return ApiResponse.fromJson(
        jsonDecode(response.body),
            (_) => null,
      );
    } else {
      throw HttpException(response.body);
    }
  }

  static dynamic _handleException(dynamic error){
    if(error is HttpException){
      throw ErrorResponseException.fromJson(jsonDecode(error.message));
    }
    throw ErrorResponseException(code: 500, message: error.toString());
  }
}
