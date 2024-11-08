import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { Popup } from "react-map-gl";

const SelectedCountry = ({ popupInfo, handleOnClose, handleOnPlay }) => {
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
          <p className="mapboxgl-popup-name">{popupInfo.name}</p>
          <MDBBtn
            outline
            rounded
            className="mx-2 text-center"
            color="dark"
            onClick={handleOnPlay}
          >
            Play
          </MDBBtn>
        </div>
      </div>
    </Popup>
  );
};

export default SelectedCountry;
