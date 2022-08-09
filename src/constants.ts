export const __prod__ = process.env.NODE_ENV === "production";

export const changePasswordPrefix = "changePassword:";
export const confirmAccountPrefix = "confirmAccount:";

export const userSessionIDPrefix = "userSess:";
export const redisSessionPrefix = "sess:";

export const TOKEN_EXPIRY = 1200; //20 minutes
export const COOKIE_NAME = "qid";
export const COOKIE_LENGTH = 1000 * 60 * 60 * 24 * 365;

//TODO: Set
export const APP_NAME = "Backend Boiler";
export const FROM_EMAIL = `"Backend Bob 👻" <bob@backend.com>`;
