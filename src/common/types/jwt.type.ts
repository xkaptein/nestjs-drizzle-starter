export type JwtBody = {
  iat: number;
  nbf: number;
  exp: number;
  jti: string;
};

export type JwtAuth = {
  userId: string;
  roleId: string;
};
