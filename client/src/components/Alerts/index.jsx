import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Alert from "react-bootstrap/Alert";

const Alerts = ({ children, color = "primary", icon }) => {
  return (
    <div>
      <Alert variant={color}>
        <Alert.Heading className="d-flex justify-content-center">
          <FontAwesomeIcon icon={icon} />
        </Alert.Heading>
        <span className="d-flex justify-content-center">{children}</span>
      </Alert>
    </div>
  );
};

export default Alerts;
