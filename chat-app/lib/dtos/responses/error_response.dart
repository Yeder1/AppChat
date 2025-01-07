class ErrorResponseException implements Exception {
  final int code;
  final String message;

  ErrorResponseException({
    required this.code,
    required this.message,
  });

  factory ErrorResponseException.fromJson(Map<String, dynamic> json) {
    return ErrorResponseException(
      code: json['code'] as int,
      message: json['message'] as String,
    );
  }

  // Convert the exception to a JSON map
  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'message': message,
    };
  }

  @override
  String toString() {
    return 'ErrorResponseException(code: $code, message: $message)';
  }
}