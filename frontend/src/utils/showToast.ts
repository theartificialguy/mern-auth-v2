import { toast, TypeOptions } from "react-toastify";

export const showToast = (message: string, type: TypeOptions) => {
  toast(message, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    type,
  });
};
