import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Form from "./Form";
import { MDBBtn } from "mdb-react-ui-kit";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useDeleteUser } from "../../hooks/useDeleteUser";
import { notifyError } from "../../shared/helpers/toasts/Toasts";

const Account = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteUser, isLoading, error } = useDeleteUser();

  const handleOnClick = async () => {
    await deleteUser();
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (error) notifyError("Something went wrong");
  }, [error]);

  return (
    <>
      <header>
        <Navbar page={"Account"} />
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Form />
        </div>
      </header>
      <div className="d-flex justify-content-center text-center mb-4 fixed-bottom">
        <MDBBtn
          rounded
          className=""
          onClick={() => setShowDeleteModal(true)}
          color="danger"
        >
          Delete account
        </MDBBtn>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          showModal={showDeleteModal}
          handleOnClick={handleOnClick}
          handleOnClose={() => setShowDeleteModal(false)}
          title={"Are you sure ?"}
          text={"You can't undo this action."}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Account;
