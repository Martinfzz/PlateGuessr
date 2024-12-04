import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { Popup } from "react-map-gl";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setPopupInfo } from "../../features/game/gameSlice";

const SelectedCountry = ({ handleOnPlay }) => {
  const { t } = useTranslation();
  const { popupInfo } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  return (
    <>
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => dispatch(setPopupInfo(null))}
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
      )}
    </>
  );
};

export default SelectedCountry;
