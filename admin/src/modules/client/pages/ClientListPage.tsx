import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import ClientDetailsModal from "../components/ClientDetailsModal";
import ClientModal from "../components/ClientModal";
import ClientTable from "../components/ClientTable";

import { useCities } from "../../master/city/hooks/useCities";
import { useStates } from "../../master/state/hooks/useStates";
import { useClients } from "../hooks/useClients";

import type {
  CreateClientDto,
} from "../types/client.types";

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

  const {
    dropdown: stateOptions,
    fetchDropdown: fetchStateDropdown,
  } = useStates();

  const {
    dropdownCities: cityOptions,
    fetchDropdownCities:
      fetchCityDropdown,
  } = useCities();

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<CreateClientDto>(
      () => ({
        ...initialFormData,
      }),
    );

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const resetForm = () => {
    setEditId(null);

    setFormData({
      ...initialFormData,
    });
  };

  const handleOpenCreateModal =
    async () => {
      try {
        await fetchStateDropdown();

        resetForm();

        setOpenModal(true);
      } catch (error) {
        console.error(
          "Failed to prepare client form:",
          error,
        );
      }
    };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleStateChange = async (
    stateUuid: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      stateUuid,
      cityUuid: "",
    }));

    if (!stateUuid) {
      return;
    }

    try {
      await fetchCityDropdown(
        stateUuid,
      );
    } catch (error) {
      console.error(
        "Failed to load cities:",
        error,
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: CreateClientDto = {
        name: formData.name.trim(),

        code: formData.code
          .trim()
          .toUpperCase()
          .replace(/\s+/g, ""),

        contactName:
          formData.contactName.trim(),

        mobile: formData.mobile.trim(),

        email:
          formData.email?.trim() ||
          undefined,

        gstNumber:
          formData.gstNumber?.trim() ||
          undefined,

        panNumber:
          formData.panNumber
            ?.trim()
            .toUpperCase() ||
          undefined,

        stateUuid:
          formData.stateUuid ||
          undefined,

        cityUuid:
          formData.cityUuid ||
          undefined,

        pincode:
          formData.pincode?.trim() ||
          undefined,

        address:
          formData.address?.trim() ||
          undefined,

        remarks:
          formData.remarks?.trim() ||
          undefined,
      };

      if (editId) {
        await update(
          editId,
          payload,
        );
      } else {
        await create(payload);
      }

      await fetchClients();

      handleCloseModal();
    } catch (error) {
      console.error(
        "Failed to save client:",
        error,
      );
    }
  };

  const handleEdit = async (
    uuid: string,
  ) => {
    try {
      await fetchStateDropdown();

      const client =
        await fetchClient(uuid);

      if (!client) {
        return;
      }

      if (client.state?.uuid) {
        await fetchCityDropdown(
          client.state.uuid,
        );
      }

      setEditId(uuid);

      setFormData({
        name: client.name,
        code: client.code,
        contactName:
          client.contactName,
        mobile: client.mobile,
        email: client.email ?? "",
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
    } catch (error) {
      console.error(
        "Failed to load client:",
        error,
      );
    }
  };

  const handleView = async (
    uuid: string,
  ) => {
    try {
      const client =
        await fetchClient(uuid);

      if (!client) {
        return;
      }

      setOpenDetails(true);
    } catch (error) {
      console.error(
        "Failed to load client details:",
        error,
      );
    }
  };

  const handleDelete = async (
    uuid: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this client?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await remove(uuid);
      await fetchClients();
    } catch (error) {
      console.error(
        "Failed to delete client:",
        error,
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage company clients"
        actions={
          <Button
            onClick={
              handleOpenCreateModal
            }
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
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
        isEdit={Boolean(editId)}
        formData={formData}
        setFormData={setFormData}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
        onStateChange={
          handleStateChange
        }
        onClose={handleCloseModal}
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