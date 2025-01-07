class RegisterRequest {
  final String displayName;
  final String username;
  final String password;
  final String confirmationPassword;

  RegisterRequest({
    required this.displayName,
    required this.username,
    required this.password,
    required this.confirmationPassword,
  });

  Map<String, dynamic> toJson(){
    return {
      'displayName': displayName,
      'username': username,
      'password': password,
      'confirmationPassword': confirmationPassword
    };
  }
}