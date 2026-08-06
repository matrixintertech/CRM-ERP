import { useEffect, useState } from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import PlatformUserDetailsModal from "../components/PlatformUserDetailsModal";
import PlatformUserModal from "../components/PlatformUserModal";
import PlatformUserTable from "../components/PlatformUserTable";

import { usePlatformUsers } from "../hooks/usePlatformUsers";

import type { PlatformUserFormData } from "../types/platform-user.types";

const initialFormData: PlatformUserFormData = {
  displayName: "",
  email: "",
  mobile: "",
  status: "ACTIVE",
};

const PlatformUserPage = () => {
  useDocumentTitle("Platform Users");

  const {
    users,
    selectedUser,
    loading,

    fetchUsers,
    fetchUser,

    create,
    update,
    remove,

    clearSelectedUser,
  } = usePlatformUsers();

  const [openModal, setOpenModal] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [editUuid, setEditUuid] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlatformUserFormData>(() => ({
    ...initialFormData,
  }));

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setEditUuid(null);

    setFormData({
      ...initialFormData,
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleSubmit = async () => {
    const payload = {
      displayName: formData.displayName.trim(),

      email: formData.email.trim().toLowerCase(),

      mobile: formData.mobile.trim() || undefined,
    };

    if (editUuid) {
      await update(editUuid, {
        ...payload,
        status: formData.status,
      });
    } else {
      await create(payload);
    }

    await fetchUsers();

    handleCloseModal();
  };

  const handleView = async (uuid: string) => {
    await fetchUser(uuid);

    setOpenDetails(true);
  };

  const handleEdit = async (uuid: string) => {
    const user = await fetchUser(uuid);

    setEditUuid(uuid);

    setFormData({
      displayName: user.displayName ?? "",

      email: user.email ?? "",

      mobile: user.mobile ?? "",

      status: user.status,
    });

    setOpenModal(true);
  };

  const handleDelete = async (uuid: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this platform user?",
    );

    if (!confirmed) {
      return;
    }

    await remove(uuid);
  };

  return (
    <>
      <PageHeader
        title="Platform Users"
        subtitle="Manage platform-level users"
        actions={
          <Button onClick={handleOpenCreate}>Create Platform User</Button>
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
        loading={loading}
        title={editUuid ? "Edit Platform User" : "Create Platform User"}
        isEdit={Boolean(editUuid)}
        formData={formData}
        setFormData={setFormData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <PlatformUserDetailsModal
        open={openDetails}
        loading={loading}
        user={selectedUser}
        onClose={() => {
          setOpenDetails(false);
          clearSelectedUser();
        }}
      />
    </>
  );
};

export default PlatformUserPage;
