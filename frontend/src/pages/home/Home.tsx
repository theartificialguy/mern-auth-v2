import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { errorResolver } from "../../utils/errorResolver";
import DefaultAvatar from "../../../assets/default.png";
import { showToast } from "../../utils/showToast";
import { sendOTP } from "../../api/sendOTP";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const onVerifyHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const response = await sendOTP({ email: auth.data?.email! });
      response?.message && navigate("/verify");
    } catch (error) {
      const err = errorResolver(error);
      showToast(err.message, "error");
    }
  };

  if (!auth.data?.isVerified) {
    return (
      <div className={styles.homeWrapper}>
        <h3>Warning</h3>
        <p>Account not verified</p>
        <button onClick={onVerifyHandler}>Verify</button>
      </div>
    );
  }

  return (
    <div className={styles.homeWrapper}>
      <h3>Home</h3>
      <img
        alt="user-avatar"
        src={auth.data?.avatar || DefaultAvatar}
        style={{
          height: 100,
          width: 100,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <p>Welcome {auth.data?.username}</p>
    </div>
  );
};

export default Home;
