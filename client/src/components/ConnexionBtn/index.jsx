import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const ConnexionBtn = () => {
  return (
    <div className="d-flex justify-content-end">
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
    </div>
  );
};

export default ConnexionBtn;
