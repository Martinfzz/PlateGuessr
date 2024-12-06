import React, { FC, ReactNode } from "react";

interface ValidationsAlertsProps {
  children: ReactNode;
}

const ValidationsAlerts: FC<ValidationsAlertsProps> = ({ children }) => {
  return <div className="validations-alerts-help-block">{children}</div>;
};

export default ValidationsAlerts;
