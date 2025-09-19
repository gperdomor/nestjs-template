export interface IJwtPayload {
  sub: string;
  email: string;
  emailVerified?: boolean;
  roles: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
}
