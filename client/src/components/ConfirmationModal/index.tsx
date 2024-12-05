import React, { FC } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  showModal: boolean;
  handleOnClick: () => void;
  handleOnClose: () => void;
  title: string;
  text: string;
  isLoading?: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  showModal,
  handleOnClick,
  handleOnClose,
  title,
  text,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <MDBModal open={showModal} onClose={handleOnClose} tabIndex="-1">
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{title}</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>{text}</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                onClick={handleOnClose}
                color="dark"
                outline
                disabled={isLoading}
              >
                {t("app_common.cancel")}
              </MDBBtn>
              <MDBBtn
                onClick={handleOnClick}
                color="danger"
                outline
                disabled={isLoading}
              >
                {t("app_common.confirm")}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default ConfirmationModal;
