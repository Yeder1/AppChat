class ApiResponse<T> {
  final String? message;
  final T? data;

  ApiResponse({
    this.message,
    this.data,
  });

  factory ApiResponse.fromJson(
      Map<String, dynamic> json) {
    return ApiResponse<T>(
      message: json['message'],
      data: json['data'],
    );
  }
}
