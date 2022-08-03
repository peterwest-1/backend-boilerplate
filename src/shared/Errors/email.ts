const field = "email";

export const EMAIL_ERROR = {
  DUPLICATE: { field, message: "Email already registered" },
  INVALID: { field, message: "Invalid email address" },
  DOESNT_EXIST: { field, message: "Email does not exist" },
};
