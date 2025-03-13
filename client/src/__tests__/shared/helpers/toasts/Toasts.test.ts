import { toast } from "react-toastify";
import {
  notifySuccess,
  notifyError,
} from "../../../../shared/helpers/toasts/Toasts";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Notification tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("notifySuccess should call toast.success with the correct parameters", () => {
    const content = "Success message";

    notifySuccess(content);

    expect(toast.success).toHaveBeenCalledWith(content, {
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
  });

  test("notifyError should call toast.error with the correct parameters", () => {
    const content = "Error message";

    notifyError(content);

    expect(toast.error).toHaveBeenCalledWith(content, {
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
  });
});
