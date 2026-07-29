// src/modules/client/pages/ClientListPage.tsx

import { useEffect, useState } from "react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import { useClients } from "../hooks/useClients";

import ClientTable from "../components/ClientTable";
import ClientModal from "../components/ClientModal";
import ClientDetailsModal from "../components/ClientDetailsModal";

import type { CreateClientDto } from "../types/client.types";

const initialFormData: CreateClientDto = {
  name: "",
  code: "",

  contactName: "",
  mobile: "",
  email: "",

  gstNumber: "",
  panNumber: "",

  stateUuid: "",
  cityUuid: "",

  pincode: "",
  address: "",

  remarks: "",
};

const ClientListPage = () => {
  const {
    loading,
    clients,
    total,
    selectedClient,

    fetchClients,
    fetchClient,

    create,
    update,
    remove,
  } = useClients();

  const [openModal, setOpenModal] =
    useState(false);

  const [openDetails, setOpenDetails] =
    useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<CreateClientDto>(
      initialFormData,
    );

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await update(editId, formData);
    } else {
      await create(formData);
    }

    await fetchClients();

    setOpenModal(false);

    setEditId(null);

    setFormData(initialFormData);
  };

  const handleEdit = async (
    uuid: string,
  ) => {
    const client =
      await fetchClient(uuid);

    if (!client) return;

    setEditId(uuid);

    setFormData({
      name: client.name,
      code: client.code,

      contactName:
        client.contactName,

      mobile: client.mobile,

      email:
        client.email ?? "",

      gstNumber:
        client.gstNumber ?? "",

      panNumber:
        client.panNumber ?? "",

      stateUuid:
        client.state?.uuid ?? "",

      cityUuid:
        client.city?.uuid ?? "",

      pincode:
        client.pincode ?? "",

      address:
        client.address ?? "",

      remarks:
        client.remarks ?? "",
    });

    setOpenModal(true);
  };

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage company clients"
        actions={
          <Button
            onClick={() => {
              setEditId(null);

              setFormData(
                initialFormData,
              );

              setOpenModal(true);
            }}
          >
            Create Client
          </Button>
        }
      />

      <Card>
        <ClientTable
          data={clients}
          loading={loading}
          total={total}
          onView={async (uuid) => {
            await fetchClient(uuid);

            setOpenDetails(true);
          }}
          onEdit={handleEdit}
          onDelete={async (uuid) => {
            await remove(uuid);

            await fetchClients();
          }}
        />
      </Card>

      <ClientModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit Client"
            : "Create Client"
        }
        isEdit={!!editId}
        formData={formData}
        setFormData={setFormData}
        onClose={() =>
          setOpenModal(false)
        }
        onSubmit={handleSubmit}
      />

      <ClientDetailsModal
        open={openDetails}
        loading={loading}
        client={selectedClient}
        onClose={() =>
          setOpenDetails(false)
        }
      />
    </>
  );
};

export default ClientListPage;