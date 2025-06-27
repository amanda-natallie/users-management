export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterSuccessResponse {
  id: number;
  token: string;
}

export interface RegisterErrorResponse {
  error: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  token: string;
}

export interface LoginErrorResponse {
  error: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
