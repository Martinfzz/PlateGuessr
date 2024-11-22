import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { Popup } from "react-map-gl";
import { useTranslation } from "react-i18next";

const SelectedCountry = ({ popupInfo, handleOnClose, handleOnPlay }) => {
  const { t } = useTranslation();

  return (
    <Popup
      anchor="bottom"
      longitude={Number(popupInfo.longitude)}
      latitude={Number(popupInfo.latitude)}
      onClose={handleOnClose}
      closeButton={false}
    >
      <div>
        <img
          width="100%"
          className="mapboxgl-popup-img"
          alt="country flag"
          src={`/images/${popupInfo.name.toLowerCase()}.jpg`}
        />
        <div className="col text-center mt-3">
          <p className="mapboxgl-popup-name">
            {t(`countries.names.${popupInfo.name.toLowerCase()}`)}
          </p>
          <MDBBtn
            outline
            rounded
            className="mx-2 text-center"
            color="dark"
            onClick={handleOnPlay}
          >
            {t("app_common.play")}
          </MDBBtn>
        </div>
      </div>
    </Popup>
  );
};

export default SelectedCountry;
