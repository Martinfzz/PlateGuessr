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
      {user && (
        <MDBBtn rounded className="m-2" onClick={handleClick} color="success">
          Log Out
        </MDBBtn>
      )}
      {!user && (
        <>
          <Link to={"/login"}>
            <MDBBtn rounded className="m-2" type="submit" color="success">
              Log In
            </MDBBtn>
          </Link>
          <Link to={"/signin"}>
            <MDBBtn rounded className="m-2" type="submit" color="info">
              Sign In
            </MDBBtn>
          </Link>
        </>
      )}
    </div>
  );
};

export default ConnexionBtn;
