import React, {
  createContext,
  useReducer,
  useEffect,
  FC,
  ReactNode,
} from "react";
import { AuthActionType, User } from "../shared.types";

interface AuthState {
  user: User | null | undefined;
}

interface AuthAction {
  type: AuthActionType;
  payload?: User;
}

export const AuthContext = createContext<
  | {
      user: User | null | undefined;
      dispatch: React.Dispatch<AuthAction>;
    }
  | undefined
>(undefined);

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_USER":
      return { user: action.payload };
    case "DELETE_USER":
      return { user: null };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user") || "null"),
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user && user.isVerified) {
      dispatch({ type: AuthActionType.LOGIN, payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
