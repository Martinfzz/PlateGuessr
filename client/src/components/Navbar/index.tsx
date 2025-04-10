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
          <Col xs={1} ms={6}>
            <Logo />
          </Col>
        )}
        {page && (
          <>
            <Col xs={1} className="d-flex justify-content-start">
              <Link to={"/"}>
                <MDBBtn className="btn-menu-back text-boldgray">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span className="hidden-text">{t("app_common.go_back")}</span>
                </MDBBtn>
              </Link>
            </Col>
          </>
        )}
        <Col
          xs={logo || page ? 11 : 12}
          md={logo || page ? 5 : 12}
          className="d-flex align-items-center justify-content-end"
        >
          <div className="d-flex justify-content-end">
            <ThemeToggleButton />
            <LanguageSelector />
            {user && (
              <MDBDropdown className="user-dropdown" data-testid="navbar-user">
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
        {page && (
          <Col
            xs={12}
            md={{ span: 6, offset: 3 }}
            className="d-flex justify-content-center align-items-center mt-3"
          >
            <MDBBadge
              className="page-badge d-flex justify-content-center align-items-center text-boldgray"
              color="warning"
            >
              {page}
            </MDBBadge>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Navbar;
