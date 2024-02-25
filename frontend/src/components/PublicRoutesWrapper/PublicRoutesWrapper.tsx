import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";

const PublicRoutesWrapper = () => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  if (!auth.data) return <Outlet />;

  return <Navigate to={"/"} state={{ from: location }} replace />;
};

export default PublicRoutesWrapper;
