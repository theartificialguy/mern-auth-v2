import { createRef, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUserAccount } from "../../api/verify";
import { errorResolver } from "../../utils/errorResolver";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchAuthAction } from "../../store/store";
import { showToast } from "../../utils/showToast";
import { Loader } from "../../components";
import styles from "./Verify.module.css";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const emailId = auth.data ? auth.data.email : location.state.emailId;

  const [loading, setLoading] = useState<boolean>(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    new Array(4).fill(0).map(() => createRef<HTMLInputElement>())
  );

  const handleOnChange = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputLength = inputRefs.current[index].current?.value.length;

    if (e.key === "Backspace" && inputLength === 0 && index !== 0) {
      inputRefs.current[index - 1].current?.focus();
    }

    // move forward if not last inp box and entered a value
    if (index !== 3 && inputLength === 1) {
      inputRefs.current[index + 1].current?.focus();
    }

    // if on last inp box and entered the value
    if (index === 3 && inputLength === 1) {
      submitBtnRef.current?.focus();
    }
  };

  const onSubmitHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const enteredOtp = inputRefs.current
        .map((otpRef) => otpRef?.current?.value)
        .join("");

      if (enteredOtp.length < 4) return;

      const response = await verifyUserAccount({
        email: emailId!,
        otp: enteredOtp,
      });
      if (response?.message) {
        setLoading(false);
        if (auth.data) {
          await dispatch(fetchAuthAction()).unwrap();
          showToast("Account verified!", "success");
        } else {
          showToast("Account created and verified!", "success");
        }
        navigate("/", { replace: true });
      }
    } catch (error) {
      const err = errorResolver(error);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verifyWrapper}>
      <div className={styles.verifyCon}>
        <h3 className={styles.verifyTitle}>Enter OTP to verify</h3>
        <div className={styles.otpCon}>
          {inputRefs.current?.map((inputRef, index) => (
            <input
              key={index}
              ref={inputRef}
              minLength={1}
              maxLength={1}
              type="text"
              inputMode="numeric"
              autoFocus={index === 0}
              autoComplete="one-time-code"
              className={styles.otpInputCon}
              onKeyUp={(e) => handleOnChange(e, index)}
            />
          ))}
        </div>
        <div className={styles.verifyBtnCon}>
          <button
            ref={submitBtnRef}
            onClick={onSubmitHandler}
            className={styles.verifyBtn}
          >
            {loading ? <Loader /> : "submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
