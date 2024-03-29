declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TESTING_DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      CORS_ORIGIN: string;
      SESSION_SECRET: string;
    }
  }
}

export {}
