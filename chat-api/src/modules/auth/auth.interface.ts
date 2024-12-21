import { z } from "zod";

export interface IRegisterRequest {
  username: string;
  password: string;
  confirmationPassword: string;
}

export const registerSchema = z
  .object({
    username: z.string().min(8).max(64),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,64}$/, {
        message:
          "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character (!@#$%^&*). Minimum length is 8 characters.",
      }),
    confirmationPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Confirmation password and password must match",
    path: ["confirmationPassword"],
  });

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  jwtToken: string;
}

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export interface IGetInfoRequest {
  username: string;
}
