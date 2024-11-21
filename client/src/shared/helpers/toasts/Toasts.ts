import { toast } from "react-toastify";

export const notifySuccess = (content: string | React.ReactElement) =>
  toast.success(content, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    className: "green",
  });

export const notifyError = (content: string | React.ReactElement) =>
  toast.error(content, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    className: "red",
  });
