import { useAppSelector } from "../../../hooks/useAppSelector";
import DefaultProfile from "../../../../assets/default.png";
import SearchIcon from "../../Icons/Search";
import styles from "./SidePanel.module.css";

const SidePanel = () => {
  const auth = useAppSelector((state) => state.auth);
  return (
    <div className={styles.sidePanelWrapper}>
      <div className={styles.sidePanelHeaderCon}>
        <div className={styles.sidePanelUserProfileImageCon}>
          <img
            alt="user-profile-pic"
            src={auth.data?.avatar || DefaultProfile}
            className={styles.sidePanelUserProfileImage}
          />
        </div>
        <div className={styles.inputCon}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Messages, Chats, Groups..."
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
