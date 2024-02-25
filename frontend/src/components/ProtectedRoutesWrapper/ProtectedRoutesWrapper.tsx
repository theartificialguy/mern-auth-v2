import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";

const ProtectedRoutesWrapper = () => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  if (!auth.data) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesWrapper;
