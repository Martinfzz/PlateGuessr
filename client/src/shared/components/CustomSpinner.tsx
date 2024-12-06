import React, { FC } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
  center?: boolean;
}

const CustomSpinner: FC<Props> = ({ center }) => {
  return (
    <div className={`${center && "text-center"} m-2`}>
      <Spinner animation="border" variant="danger" role="status" />
    </div>
  );
};

export default CustomSpinner;
