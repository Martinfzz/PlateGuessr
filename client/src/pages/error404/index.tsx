import React from "react";
import { useTranslation } from "react-i18next";

const Error404 = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        backgroundSize: "cover",
        height: "100vh",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="text-center p-7 overflow-hidden align-items-center">
        <div>
          <h3>{t("pages.error404.text")}</h3>
        </div>
      </div>
    </div>
  );
};

export default Error404;
