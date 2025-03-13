import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { AuthActionType } from "../shared.types";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: AuthActionType.LOGOUT });

    navigate("/");
  };

  return { logout };
};
