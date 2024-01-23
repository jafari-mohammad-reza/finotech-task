export interface TokenInterface {
  userId: number;
  exp: number;
}
export interface TokenDecodeResponse {
  identifier: number | string;
  iat: number;
  exp: number;
}
