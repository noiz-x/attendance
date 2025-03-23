// Frontend/src/services/accountService.js

import api from "./api";

const AccountService = {
  // Login
  login: (credentials) => {
    // POST /accounts/login/
    return api.post("accounts/login/", credentials);
  },

  // Logout (using POST method; you can also implement the GET endpoint as needed)
  logout: () => {
    // POST /accounts/logout/
    return api.post("accounts/logout/");
  },

  // Registration
  registration: (data) => {
    // POST /accounts/registration/
    return api.post("accounts/registration/", data);
  },

  // Resend verification email
  resendEmail: (data) => {
    // POST /accounts/registration/resend-email/
    return api.post("accounts/registration/resend-email/", data);
  },

  // Verify email
  verifyEmail: (data) => {
    // POST /accounts/registration/verify-email/
    return api.post("accounts/registration/verify-email/", data);
  },

  // Change password
  passwordChange: (data) => {
    // POST /accounts/password/change/
    return api.post("accounts/password/change/", data);
  },

  // Reset password
  passwordReset: (data) => {
    // POST /accounts/password/reset/
    return api.post("accounts/password/reset/", data);
  },

  // Confirm password reset
  passwordResetConfirm: (data) => {
    // POST /accounts/password/reset/confirm/
    return api.post("accounts/password/reset/confirm/", data);
  },

  // Token refresh
  tokenRefresh: (data) => {
    // POST /accounts/token/refresh/
    return api.post("accounts/token/refresh/", data);
  },

  // Token verify
  tokenVerify: (data) => {
    // POST /accounts/token/verify/
    return api.post("accounts/token/verify/", data);
  },

  // Get user details
  getUser: () => {
    // GET /accounts/user/
    return api.get("accounts/user/");
  },

  // Update user (full update)
  updateUser: (data) => {
    // PUT /accounts/user/
    return api.put("accounts/user/", data);
  },

  // Partial update of user
  partialUpdateUser: (data) => {
    // PATCH /accounts/user/
    return api.patch("accounts/user/", data);
  },
};

export default AccountService;
