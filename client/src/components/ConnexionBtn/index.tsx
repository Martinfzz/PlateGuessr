import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ConnexionBtn = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="connexion-btn">
      <Link to={"/login"}>
        <MDBBtn rounded className=" me-3 btn-login" type="submit" color="light">
          {t("app_common.login")}
        </MDBBtn>
      </Link>
      <Link to={"/signup"}>
        <MDBBtn rounded className="me-3 btn-signup" type="submit" color="light">
          {t("app_common.signup")}
        </MDBBtn>
      </Link>
    </div>
  );
};

export default ConnexionBtn;
