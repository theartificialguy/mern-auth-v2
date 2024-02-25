import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/register";
import { errorResolver } from "../../utils/errorResolver";
import { showToast } from "../../utils/showToast";
import DetailsForm from "./detailsForm/DetailsForm";
import UploadAvatar from "./uploadAvatar/UploadAvatar";
import { convertToBase64 } from "../../utils/convertToBase64";
import styles from "./Register.module.css";

export type TRegistrationStatus = "DETAILS" | "AVATAR";

export type TFormData = {
  username: string;
  avatar: null | {
    file: File;
    base64: string;
  };
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationStatus, setRegistrationStatus] =
    useState<TRegistrationStatus>("DETAILS");
  const [formData, setFormData] = useState<TFormData>({
    username: "",
    email: "",
    avatar: null,
    password: "",
    confirmPassword: "",
  });

  const setAvatar = async (file: File) => {
    const base64 = await convertToBase64(file);
    setFormData((prevState) => ({
      ...prevState,
      avatar: {
        file: file,
        base64: base64 as string,
      },
    }));
  };

  const handleRegistrationStatus = (status: TRegistrationStatus) => {
    setRegistrationStatus(status);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.avatar
    )
      return;
    if (formData.password !== formData.confirmPassword) return;
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("email", formData.email);
      payload.append("username", formData.username);
      payload.append("password", formData.password);
      payload.append("avatar", formData.avatar.file);
      const response = await registerUser(payload);
      setLoading(false);
      response?.message &&
        navigate("/verify_account", { state: { emailId: formData.email } });
    } catch (error) {
      const err = errorResolver(error);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <form onSubmit={onSubmitHandler} className={styles.registerFormCon}>
        {registrationStatus === "DETAILS" ? (
          <DetailsForm
            formData={formData}
            onChangeHandler={onChangeHandler}
            handleRegistrationStatus={handleRegistrationStatus}
          />
        ) : (
          <UploadAvatar
            loading={loading}
            setAvatar={setAvatar}
            selectedAvatar={formData.avatar?.base64 || null}
            handleRegistrationStatus={handleRegistrationStatus}
          />
        )}
      </form>
    </div>
  );
};

export default Register;
