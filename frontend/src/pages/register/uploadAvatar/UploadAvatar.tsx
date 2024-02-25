import DefaultAvatar from "../../../../assets/default.png";
import BackArrow from "../../../components/Icons/BackArrow";
import { Loader } from "../../../components";
import { TRegistrationStatus } from "../Register";
import styles from "./UploadAvatar.module.css";

type TUploadAvatar = {
  loading: boolean;
  selectedAvatar: string | null;
  setAvatar: (file: File) => Promise<void>;
  handleRegistrationStatus: (status: TRegistrationStatus) => void;
};

const UploadAvatar = ({
  loading,
  setAvatar,
  selectedAvatar,
  handleRegistrationStatus,
}: TUploadAvatar) => {
  const backHandler = () => {
    handleRegistrationStatus("DETAILS");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files![0];
      if (!file) return;
      setAvatar(file);
    } catch (error) {}
  };

  return (
    <div className={styles.uploadAvatarCon}>
      <div className={styles.avatarHeaderCon}>
        <BackArrow className={styles.backBtn} onClick={backHandler} />
        <h3 className={styles.uploadAvatarTitle}>Upload your Avatar!</h3>
      </div>
      <label htmlFor="file-upload" className={styles.avatarCon}>
        <img
          src={selectedAvatar || DefaultAvatar}
          alt="avatar-placeholder"
          className={styles.avatar}
        />
      </label>
      <input
        type="file"
        name="avatar"
        id="file-upload"
        accept=".jpeg, .png, .jpg"
        onChange={handleAvatarUpload}
      />
      <div className={styles.uploadAvatarBtnCon}>
        <button className={styles.uploadAvatarBtn} type="submit">
          {loading ? <Loader /> : "Create Account"}
        </button>
      </div>
    </div>
  );
};

export default UploadAvatar;
