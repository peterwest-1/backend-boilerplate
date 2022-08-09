import { MailOptions } from "nodemailer/lib/json-transport";
import { FROM_EMAIL, APP_NAME } from "../constants";

export const generateResetMailOptions = (email: string, changePassLink: string) => {
  const subject = `Reset your password for ${APP_NAME}`;

  const text = `
      
      Hello,
  
      Follow this link to reset your ${APP_NAME} password for your ${email} account.
  
      ${changePassLink}
  
      If you didn’t ask to reset your password, you can ignore this email.
  
      Thanks,
  
      Your ${APP_NAME} team`;

  const html = `
      
      <p>Hello,</p>
  
      <p>Follow this link to reset your <strong>${APP_NAME}</strong> password for your <strong>${email}</strong> account.</p>
  
      <a href="${changePassLink}">Change Password</a>
  
      <p>If you didn't ask to reset your password, you can safely ignore this email.</p>
  
      <br/> 

      <p>Thanks,</p>
  
      <p>Your ${APP_NAME} team</p>`;

  return { from: FROM_EMAIL, to: email, subject, text, html };
};

export const generateVerifyMailOptions = (email: string, verifyLink: string) => {
  const subject = `Verify your email for ${APP_NAME}`;

  const text = `
    
    Hello,
  
    <p>Follow this link below to verify your email address.</p>
  
    ${verifyLink}
  
    If you didn't ask to verify this address, you can safely ignore this email.
  
    Thanks,
  
    Your ${APP_NAME} team`;

  const html = `
    
    <p>Hello,</p>
  
    <p>Follow this link below to verify your email address.</p>
  
    <a href="${verifyLink}">Verify Account</a>
  
    <p>If you didn't ask to verify this address, you can safely ignore this email.</p>
  
    <br/>
  
    <p>Thanks,</p>
  
    <p>Your ${APP_NAME} team</p>`;

  return { from: FROM_EMAIL, to: email, subject, text, html };
};
