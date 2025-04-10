import React, { FC, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "react-bootstrap/Alert";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AlertsProps {
  children: ReactNode;
  color?: string;
  icon: IconProp;
}

const Alerts: FC<AlertsProps> = ({ children, color = "primary", icon }) => {
  return (
    <div>
      <Alert variant={color}>
        <Alert.Heading className="d-flex justify-content-center">
          <FontAwesomeIcon icon={icon} data-testid="alert-icon" />
        </Alert.Heading>
        <span
          className="d-flex justify-content-center"
          data-testid="alert-message"
        >
          {children}
        </span>
      </Alert>
    </div>
  );
};

export default Alerts;
