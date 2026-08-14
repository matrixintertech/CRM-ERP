import { useState } from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import PlatformUserDetailsModal from "../components/PlatformUserDetailsModal";
import PlatformUserModal from "../components/PlatformUserModal";
import PlatformUserTable from "../components/PlatformUserTable";

import { usePlatformUsers } from "../hooks/usePlatformUsers";

import type {
  PlatformUserFormData,
} from "../types/platform-user.types";


const initialFormData: PlatformUserFormData = {
  displayName: "",
  email: "",
  mobile: "",
  platformRoleUuid: "",
  status: "ACTIVE",
};


const PlatformUserPage = () => {
  useDocumentTitle(
    "Platform Users",
  );

  const {
    users,
    selectedUser,

    loading,
    detailsLoading,
    saving,

    fetchUser,

    create,
    update,
    remove,

    clearSelectedUser,
  } = usePlatformUsers();


  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    editUuid,
    setEditUuid,
  ] = useState<string | null>(
    null,
  );

  const [
    formData,
    setFormData,
  ] =
    useState<PlatformUserFormData>({
      ...initialFormData,
    });


  const resetForm = () => {
    setEditUuid(
      null,
    );

    setFormData({
      ...initialFormData,
    });
  };


  const handleOpenCreate = () => {
    resetForm();

    setOpenModal(
      true,
    );
  };


  const handleCloseModal = () => {
    setOpenModal(
      false,
    );

    resetForm();
  };


  const handleCloseDetails = () => {
    setOpenDetails(
      false,
    );

    clearSelectedUser();
  };


  const handleSubmit = async () => {
    try {
      const platformRoleUuid =
        formData.platformRoleUuid.trim();

      if (!platformRoleUuid) {
        return;
      }


      const payload = {
        displayName:
          formData.displayName.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        mobile:
          formData.mobile.trim() ||
          undefined,

        platformRoleUuid,
      };


      if (editUuid) {
        await update(
          editUuid,
          {
            ...payload,

            status:
              formData.status,
          },
        );
      } else {
        await create(
          payload,
        );
      }


      handleCloseModal();
    } catch (error) {
      console.error(
        "Failed to save platform user:",
        error,
      );
    }
  };


  const handleView = async (
    uuid: string,
  ) => {
    try {
      clearSelectedUser();

      setOpenDetails(
        true,
      );

      await fetchUser(
        uuid,
      );
    } catch (error) {
      console.error(
        "Failed to load platform user details:",
        error,
      );

      setOpenDetails(
        false,
      );
    }
  };


  const handleEdit = async (
    uuid: string,
  ) => {
    try {
      const user =
        await fetchUser(
          uuid,
        );


      setEditUuid(
        uuid,
      );


      setFormData({
        displayName:
          user.displayName ??
          "",

        email:
          user.email ??
          "",

        mobile:
          user.mobile ??
          "",

        platformRoleUuid:
          user.platformRole?.uuid ??
          "",

        status:
          user.status,
      });


      setOpenModal(
        true,
      );
    } catch (error) {
      console.error(
        "Failed to load platform user:",
        error,
      );
    }
  };


  const handleDelete = async (
    uuid: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this platform user?",
      );

    if (!confirmed) {
      return;
    }


    try {
      await remove(
        uuid,
      );
    } catch (error) {
      console.error(
        "Failed to delete platform user:",
        error,
      );
    }
  };


  return (
    <>
      <PageHeader
        title="Platform Users"
        subtitle="Manage platform-level users"
        actions={
          <Button
            onClick={
              handleOpenCreate
            }
          >
            Create Platform User
          </Button>
        }
      />


      <Card>
        <PlatformUserTable
          data={users}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>


      <PlatformUserModal
        open={openModal}
        loading={saving}
        title={
          editUuid
            ? "Edit Platform User"
            : "Create Platform User"
        }
        isEdit={
          Boolean(
            editUuid,
          )
        }
        formData={
          formData
        }
        setFormData={
          setFormData
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />


      <PlatformUserDetailsModal
        open={openDetails}
        loading={
          detailsLoading
        }
        user={
          selectedUser
        }
        onClose={
          handleCloseDetails
        }
      />
    </>
  );
};


export default PlatformUserPage;