export const __prod__ = process.env.NODE_ENV === "production";

export const changePasswordPrefix = "changePassword:";
export const forgotPasswordPrefix = "forgotPassword:";
export const confirmAccountPrefix = "confirmAccount:";

export const TOKEN_EXPIRY = 60 * 60 * 24;
export const COOKIE_NAME = "qid";
export const COOKIE_LENGTH = 1000 * 60 * 60 * 24 * 365;
