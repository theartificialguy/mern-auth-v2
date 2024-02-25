import { useNavigate } from "react-router-dom";
import { TRegistrationStatus } from "../Register";
import styles from "./DetailsForm.module.css";

type TDetailsForm = {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  handleRegistrationStatus: (status: TRegistrationStatus) => void;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DetailsForm = ({
  formData,
  onChangeHandler,
  handleRegistrationStatus,
}: TDetailsForm) => {
  const navigate = useNavigate();

  const goToUploadAvatarPage = () => {
    if (!formData.username || !formData.email || !formData.password) return;
    if (formData.password !== formData.confirmPassword) return;
    handleRegistrationStatus("AVATAR");
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <>
      <h3 className={styles.registerTitle}>Create an account</h3>
      <div className={styles.registerUsernameCon}>
        <span className={styles.registerUsernameText}>
          USERNAME <span className={styles.requiredAsterix}>*</span>
        </span>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChangeHandler}
          className={styles.registerUsernameInput}
        />
      </div>
      <div className={styles.registerEmailCon}>
        <span className={styles.registerEmailText}>
          EMAIL <span className={styles.requiredAsterix}>*</span>
        </span>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          className={styles.registerEmailInput}
        />
      </div>
      <div className={styles.registerPassCon}>
        <span className={styles.registerPassText}>
          PASSWORD <span className={styles.requiredAsterix}>*</span>
        </span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={onChangeHandler}
          className={styles.registerPassInput}
        />
      </div>
      <div className={styles.registerConfirmPassCon}>
        <span className={styles.registerConfirmPassText}>
          CONFIRM PASSWORD <span className={styles.requiredAsterix}>*</span>
        </span>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={onChangeHandler}
          className={styles.registerConfirmPassInput}
        />
      </div>
      <div className={styles.registerBtnCon}>
        <button className={styles.registerBtn} onClick={goToUploadAvatarPage}>
          Continue
        </button>
      </div>
      <div className={styles.haveAccountWrapper} onClick={goToLoginPage}>
        <div className={styles.haveAccountCon}>
          <span className={styles.haveAccountText}>
            Already have an account?
          </span>
        </div>
      </div>
    </>
  );
};

export default DetailsForm;
