import {
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import ClientDetailsModal from "../components/ClientDetailsModal";
import ClientModal from "../components/ClientModal";
import ClientTable from "../components/ClientTable";

import {
  useCities,
} from "../../master/city/hooks/useCities";

import {
  useStates,
} from "../../master/state/hooks/useStates";

import {
  useClients,
} from "../hooks/useClients";

import type {
  Client,
  ClientFormData,
  CreateClientDto,
  UpdateClientDto,
} from "../types/client.types";

const initialFormData:
  ClientFormData = {
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
  status: "ACTIVE",
};

const ClientListPage = () => {
  const {
    loading,

    clients,

    fetchClient,

    create,
    update,
    remove,

    saving,
  } = useClients();

const {
  dropdown:
    stateOptions,
} = useStates();

const {
  dropdownCities:
    cityOptions,
} = useCities();

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    selectedClient,
    setSelectedClient,
  ] = useState<
    Client | null
  >(null);

  const [
    editId,
    setEditId,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<ClientFormData>({
      ...initialFormData,
    });

  const resetForm = () => {
    setEditId(
      null,
    );

    setFormData({
      ...initialFormData,
    });
  };

 const handleOpenCreateModal =
  () => {
    resetForm();

    setOpenModal(
      true,
    );
  };


  const handleCloseModal =
    () => {
      setOpenModal(
        false,
      );

      resetForm();
    };

  const handleCloseDetails =
    () => {
      setOpenDetails(
        false,
      );

      setSelectedClient(
        null,
      );
    };

const handleStateChange = (
  stateUuid: string,
) => {
  setFormData(
    (previous) => ({
      ...previous,

      stateUuid,

      cityUuid: "",
    }),
  );
};

  const getBasePayload =
    (): CreateClientDto => ({
      name:
        formData.name.trim(),

      code:
        formData.code
          .trim()
          .toUpperCase()
          .replace(
            /\s+/g,
            "",
          ),

      contactName:
        formData.contactName
          .trim(),

      mobile:
        formData.mobile.trim(),

      email:
        formData.email
          ?.trim() ||
        undefined,

      gstNumber:
        formData.gstNumber
          ?.trim() ||
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
        formData.pincode
          ?.trim() ||
        undefined,

      address:
        formData.address
          ?.trim() ||
        undefined,

      remarks:
        formData.remarks
          ?.trim() ||
        undefined,
    });

  const handleSubmit =
    async () => {
      try {
        const basePayload =
          getBasePayload();

        if (editId) {
          const updatePayload:
            UpdateClientDto = {
            ...basePayload,

            status:
              formData.status,
          };

          await update(
            editId,
            updatePayload,
          );
        } else {
          await create(
            basePayload,
          );
        }

        handleCloseModal();
      } catch (error) {
        console.error(
          "Failed to save client:",
          error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        await fetchStateDropdown();

        const client =
          await fetchClient(
            uuid,
          );

        if (
          client.state?.uuid
        ) {
          await fetchCityDropdown(
            client.state.uuid,
          );
        }

        setEditId(
          uuid,
        );

        setFormData({
          name:
            client.name,

          code:
            client.code,

          contactName:
            client.contactName,

          mobile:
            client.mobile,

          email:
            client.email ??
            "",

          gstNumber:
            client.gstNumber ??
            "",

          panNumber:
            client.panNumber ??
            "",

          stateUuid:
            client.state?.uuid ??
            "",

          cityUuid:
            client.city?.uuid ??
            "",

          pincode:
            client.pincode ??
            "",

          address:
            client.address ??
            "",

          remarks:
            client.remarks ??
            "",

          status:
            client.status,
        });

        setOpenModal(
          true,
        );
      } catch (error) {
        console.error(
          "Failed to load client:",
          error,
        );
      }
    };

  const handleView =
    async (
      uuid: string,
    ) => {
      setSelectedClient(
        null,
      );

      setOpenDetails(
        true,
      );

      try {
        const client =
          await fetchClient(
            uuid,
          );

        setSelectedClient(
          client,
        );
      } catch (error) {
        console.error(
          "Failed to load client details:",
          error,
        );

        setOpenDetails(
          false,
        );
      }
    };

  const handleDelete =
    async (
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
        await remove(
          uuid,
        );
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
          data={
            clients
          }
          loading={
            loading
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      </Card>

      <ClientModal
        open={
          openModal
        }
        loading={
          saving
        }
        title={
          editId
            ? "Edit Client"
            : "Create Client"
        }
        isEdit={
          Boolean(
            editId,
          )
        }
        formData={
          formData
        }
        setFormData={
          setFormData
        }
        stateOptions={
          stateOptions
        }
        cityOptions={
          cityOptions
        }
        onStateChange={
          handleStateChange
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />

      <ClientDetailsModal
        open={
          openDetails
        }
        loading={
          openDetails &&
          !selectedClient
        }
        client={
          selectedClient
        }
        onClose={
          handleCloseDetails
        }
      />
    </>
  );
};

export default ClientListPage;