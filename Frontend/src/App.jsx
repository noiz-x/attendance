import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LogoutPage from "./pages/LogoutPage";
import PasswordChangePage from "./pages/PasswordChangePage";
import PasswordResetPage from "./pages/PasswordResetPage";
import PasswordResetConfirmPage from "./pages/PasswordResetConfirmPage";
import ResendEmailPage from "./pages/ResendEmailPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import TokenRefreshPage from "./pages/TokenRefreshPage";
import TokenVerifyPage from "./pages/TokenVerifyPage";
import UserPage from "./pages/UserPage";
import AttendancePage from "./pages/AttendancePage";

const App = () => {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-blue-600 text-white flex space-x-4">
        <Link to="/accounts/login/">Login</Link>
        <Link to="/accounts/registration/">Register</Link>
        <Link to="/accounts/logout/">Logout</Link>
        <Link to="/accounts/password/change/">Change Password</Link>
        <Link to="/accounts/password/reset/">Reset Password</Link>
        <Link to="/accounts/registration/resend-email/">Resend Email</Link>
        <Link to="/accounts/registration/verify-email/">Verify Email</Link>
        <Link to="/accounts/token/refresh/">Token Refresh</Link>
        <Link to="/accounts/token/verify/">Token Verify</Link>
        <Link to="/accounts/user/">User</Link>
        <Link to="/api/attendance/">Attendance</Link>
      </nav>
      <Routes>
        <Route path="/accounts/login/" element={<LoginPage />} />
        <Route path="/accounts/registration/" element={<RegisterPage />} />
        <Route path="/accounts/logout/" element={<LogoutPage />} />
        <Route path="/accounts/password/change/" element={<PasswordChangePage />} />
        <Route path="/accounts/password/reset/" element={<PasswordResetPage />} />
        <Route path="/accounts/password/reset/confirm/" element={<PasswordResetConfirmPage />} />
        <Route path="/accounts/registration/resend-email/" element={<ResendEmailPage />} />
        <Route path="/accounts/registration/verify-email/" element={<VerifyEmailPage />} />
        <Route path="/accounts/token/refresh/" element={<TokenRefreshPage />} />
        <Route path="/accounts/token/verify/" element={<TokenVerifyPage />} />
        <Route path="/accounts/user/" element={<UserPage />} />
        <Route path="/api/attendance/" element={<AttendancePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
