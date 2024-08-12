export enum Environment {
  Development = "development",
  Production = "production",
}

type AppendPrefix<Prefix extends string, T extends Record<string, unknown>> = {
  [K in keyof T as `${Prefix}${string & K}`]: T[K];
};

export type Api = AppendPrefix<
  "VITE_",
  {
    readonly DATABASE_USER: string;
    readonly DATABASE_PASSWORD: string;
    readonly DATABASE_PORT: string;
    readonly DATABASE_HOST: string;
    readonly DATABASE_NAME: string;
    readonly PORT: string;
    readonly CORS: string;
    readonly NODE_ENV: Environment;
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRES_IN: string;
    readonly REFRESH_JWT_EXPIRES_IN: string;
    readonly RESEND_API_KEY: string;
    readonly HOSTNAME: string;
  }
>;

export interface Web {
  server: {
    NODE_ENV: Environment;
    JWT_EXPIRES_IN: string;
    REFRESH_JWT_EXPIRES_IN: string;
    NEXTAUTH_SECRET: string;
    DATABASE_REF: string;
    DATABASE_SERVICE_KEY: string;
    RESEND_API_KEY: string;
    DEFAULT_ASSIGNEE_ID: string;
  };
  client: {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_HOSTNAME: string;
  };
}
