import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

const ConnexionBtn = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <div className="d-flex justify-content-end">
      <div className="position-absolute">
        {user && (
          <MDBBtn
            rounded
            className="mt-3 me-3 text-dark"
            onClick={handleClick}
            color="danger"
          >
            Log Out
          </MDBBtn>
        )}
        {!user && (
          <>
            <Link to={"/login"}>
              <MDBBtn
                rounded
                className="mt-3 me-3 btn-login"
                type="submit"
                color="light"
              >
                Log In
              </MDBBtn>
            </Link>
            <Link to={"/signup"}>
              <MDBBtn
                rounded
                className="mt-3 me-3 btn-signup"
                type="submit"
                color="light"
              >
                Sign Up
              </MDBBtn>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnexionBtn;
