import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../store/store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { errorResolver } from "../../utils/errorResolver";
import { showToast } from "../../utils/showToast";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onLogoutHandler = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await dispatch(logoutAction()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      const err = errorResolver(error);
      showToast(err.message, "error");
    }
  };

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.titleCon}>
        <h3 className={styles.titleText}>Council of cattos</h3>
      </div>
      <div className={styles.navbarRightCon}>
        <div className={styles.needHelpCon}>
          <span className={styles.needHelpText}>Need help?</span>
        </div>
        <div className={styles.logoutBtnCon} onClick={onLogoutHandler}>
          <span className={styles.logoutBtn}>logout</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
