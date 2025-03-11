import React, { FC } from "react";
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
import Logo from "../Logo";
import ThemeToggleButton from "../ThemeToggleButton";

interface NavbarProps {
  page?: string;
  logo?: boolean;
}

const Navbar: FC<NavbarProps> = ({ page, logo = false }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const handleClick = () => {
    logout();
  };

  return (
    <div data-testid="navbar">
      <Row className="pt-3 m-0 d-flex justify-content-between">
        {logo && (
          <Col>
            <Logo />
          </Col>
        )}
        {page && (
          <>
            <Col>
              <Link to={"/"}>
                <MDBBtn className="btn-menu-back text-boldgray">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span className="hidden-text">{t("app_common.go_back")}</span>
                </MDBBtn>
              </Link>
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <MDBBadge
                className="page-badge d-flex justify-content-center align-items-center text-boldgray"
                color=""
              >
                {page}
              </MDBBadge>
            </Col>
          </>
        )}
        <Col>
          <div className="d-flex justify-content-end">
            <ThemeToggleButton />
            <LanguageSelector />
            {user && (
              <MDBDropdown className="user-dropdown">
                <MDBDropdownToggle className="text-boldgray">
                  <FontAwesomeIcon icon={faUser} className="me-2" />{" "}
                  <span className="hidden-username">{user.username}</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu dark data-testid="navbar-account">
                  <Link to={"/me/settings"}>
                    <MDBDropdownItem link>
                      <p className="m-0 text-boldgray">
                        {t("pages.account.heading")}
                      </p>
                    </MDBDropdownItem>
                  </Link>
                  <Link to={`/user/${user.id}`}>
                    <MDBDropdownItem link>
                      <p className="m-0 text-boldgray">
                        {t("pages.stats.my_stats")}
                      </p>
                    </MDBDropdownItem>
                  </Link>
                  <MDBDropdownItem link onClick={handleClick}>
                    <p className="red m-0">{t("app_common.logout")}</p>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            )}
            {!user && <ConnexionBtn />}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
