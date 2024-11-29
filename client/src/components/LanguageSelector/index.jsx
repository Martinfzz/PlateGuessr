import React from "react";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";
import { toAbsoluteUrl } from "../../helpers";

const languages = [
  {
    id: 1,
    lang: "en",
    name: "English",
    flag: toAbsoluteUrl("/media/flags/uk.svg"),
  },
  {
    id: 2,
    lang: "fr",
    name: "Français",
    flag: toAbsoluteUrl("/media/flags/france.svg"),
  },
  {
    id: 3,
    lang: "de",
    name: "Deutsch",
    flag: toAbsoluteUrl("/media/flags/germany.svg"),
  },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const lang = localStorage.getItem("i18nextLng") ?? "en";
  const currentLanguage = languages.find((x) => x.lang === lang);

  const changeLanguage = (lng) => {
    localStorage.setItem("i18nextLng", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div className="d-flex align-items-center me-3">
      <MDBDropdown className="language-selector">
        <MDBDropdownToggle className="">
          <img
            className="rounded-1"
            src={currentLanguage?.flag}
            alt="country flag"
          />
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          {languages.map((l) => (
            <MDBDropdownItem
              link
              onClick={() => changeLanguage(l.lang)}
              key={l.id}
            >
              <img className="rounded-1" src={l.flag} alt="country flag" />{" "}
              {l.name}
            </MDBDropdownItem>
          ))}
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  );
};

export default LanguageSelector;
