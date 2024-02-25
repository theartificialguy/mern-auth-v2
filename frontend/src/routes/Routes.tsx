import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Login, Register, Verify, NotFound } from "../pages";
import {
  RootWrapper,
  PublicRoutesWrapper,
  ProtectedRoutesWrapper,
} from "../components";

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutesWrapper />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify_account" element={<Verify />} />
        </Route>
        {/* Private Routes */}
        <Route element={<ProtectedRoutesWrapper />}>
          <Route element={<RootWrapper />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/verify" element={<Verify />} />
        </Route>
        {/* Not Found Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
