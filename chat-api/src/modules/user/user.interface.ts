export interface IGetUserRequest {
  authUser: IAuthUser;
  search: string;
}

export interface IGetUserResponse {
  _id: string;
  avatar: string;
  displayName: string;
}