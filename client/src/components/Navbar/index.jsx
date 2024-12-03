import React from "react";
import ConnexionBtn from "../ConnexionBtn";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBadge,
  MDBBtn,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import LanguageSelector from "../LanguageSelector/index";
import { useTranslation } from "react-i18next";

const Navbar = ({ page }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const handleClick = () => {
    logout();
  };

  return (
    <>
      <Row className="pt-3 m-0 d-flex justify-content-between">
        {page && (
          <>
            <Col>
              <Link to={"/"}>
                <MDBBtn className="btn-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span className="hidden-text">{t("app_common.go_back")}</span>
                </MDBBtn>
              </Link>
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <MDBBadge
                className="page-badge d-flex justify-content-center align-items-center"
                color=""
              >
                {page}
              </MDBBadge>
            </Col>
          </>
        )}
        <Col>
          <div className="d-flex justify-content-end">
            <LanguageSelector />
            {user && (
              <MDBDropdown className="user-dropdown">
                <MDBDropdownToggle>
                  <FontAwesomeIcon icon={faUser} className="me-2" />{" "}
                  <span className="hidden-username">{user.username}</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu dark>
                  <Link to={"/me/settings"}>
                    <MDBDropdownItem link>
                      {t("pages.account.heading")}
                    </MDBDropdownItem>
                  </Link>
                  <Link to={`/user/${user.id}`}>
                    <MDBDropdownItem link>
                      {t("pages.stats.my_stats")}
                    </MDBDropdownItem>
                  </Link>
                  <MDBDropdownItem link onClick={handleClick}>
                    <span className="red">{t("app_common.logout")}</span>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            )}
            {!user && <ConnexionBtn />}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Navbar;
