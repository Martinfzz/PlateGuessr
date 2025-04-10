import React, { FC } from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { Popup } from "react-map-gl";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setPopupInfo } from "../../features/game/gameSlice";
import { PopupInfo } from "shared.types";

interface SelectedCountryProps {
  handleOnPlay: () => void;
}

interface GameState {
  game: {
    popupInfo: PopupInfo;
  };
}

const SelectedCountry: FC<SelectedCountryProps> = ({ handleOnPlay }) => {
  const { t } = useTranslation();
  const { popupInfo } = useSelector((state: GameState) => state.game);
  const dispatch = useDispatch();

  const handleClosePopup = () => {
    dispatch(
      setPopupInfo({
        longitude: null,
        latitude: null,
        zoom: null,
        countryId: null,
        name: "",
        color: "#fff",
      })
    );
  };

  return (
    <div data-testid="selected-country">
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={handleClosePopup}
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
                data-testid="country-play-btn"
              >
                {t("app_common.play")}
              </MDBBtn>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default SelectedCountry;
