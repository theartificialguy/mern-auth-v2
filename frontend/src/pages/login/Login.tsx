import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../../store/store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { errorResolver } from "../../utils/errorResolver";
import { showToast } from "../../utils/showToast";
import { Loader } from "../../components";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const goToRegisterPage = () => {
    navigate("/register");
  };

  const forgotPasswordHandler = () => {};

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) return;
    setLoading(true);
    try {
      await dispatch(loginAction({ email, password })).unwrap();
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      const err = errorResolver(error);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form onSubmit={onSubmit} className={styles.loginFormCon}>
        <h3 className={styles.loginTitle}>Welcome back!</h3>
        <div className={styles.loginEmailCon}>
          <span className={styles.loginEmailText}>
            EMAIL <span className={styles.requiredAsterix}>*</span>
          </span>
          <input
            type="text"
            value={email}
            className={styles.loginEmailInput}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.loginPassCon}>
          <span className={styles.loginPassText}>
            PASSWORD <span className={styles.requiredAsterix}>*</span>
          </span>
          <input
            type="password"
            value={password}
            className={styles.loginPassInput}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div onClick={forgotPasswordHandler} className={styles.forgotPassCon}>
            <span className={styles.forgotPassText}>Forgot your password?</span>
          </div>
        </div>
        <div className={styles.loginBtnCon}>
          <button type="submit" className={styles.loginBtn}>
            {loading ? <Loader /> : "Log In"}
          </button>
          <div className={styles.loginBtnNeedAccountCon}>
            <span className={styles.needAccountText}>Need an account?</span>
            <div onClick={goToRegisterPage} className={styles.loginRegisterCon}>
              <span className={styles.registerText}>Register</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
