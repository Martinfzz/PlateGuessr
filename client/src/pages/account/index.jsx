import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Form from "./Form";
import { MDBBtn } from "mdb-react-ui-kit";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useDeleteUser } from "../../hooks/useDeleteUser";
import { notifyError } from "../../shared/helpers/toasts/Toasts";
import { useTranslation } from "react-i18next";

const Account = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteUser, isLoading, error } = useDeleteUser();
  const { t } = useTranslation();

  const handleOnClick = async () => {
    await deleteUser();
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (error) notifyError("notifications.something_went_wrong");
  }, [error]);

  return (
    <>
      <header>
        <Navbar page={t("pages.account.heading")} />
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Form />
        </div>
      </header>
      <div className="d-flex justify-content-center text-center mb-4 fixed-bottom">
        <MDBBtn
          rounded
          className="btn-back"
          onClick={() => setShowDeleteModal(true)}
          color="danger"
        >
          {t("pages.account.delete_account")}
        </MDBBtn>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          showModal={showDeleteModal}
          handleOnClick={handleOnClick}
          handleOnClose={() => setShowDeleteModal(false)}
          title={t("pages.account.are_you_sure")}
          text={t("pages.account.cannot_undo_action")}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Account;
