import type { DefaultUser } from "next-auth";

declare module "next-auth/jwt/types" {
  interface JWT {
    provider?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      id: string;
    };
  }
}


