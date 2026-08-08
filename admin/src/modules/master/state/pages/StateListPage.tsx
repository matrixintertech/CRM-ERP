import {
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import {
  notify,
} from "@/shared/utils/notify";

import StateDetailsModal from "../components/StateDetailsModal";
import StateModal from "../components/StateModal";
import StateTable from "../components/StateTable";

import {
  useStates,
} from "../hooks/useStates";

import type {
  State,
  StateFormData,
} from "../types/state.types";

const initialFormData:
  StateFormData = {
  name: "",
  code: "",
  gstCode: "",
  status: "ACTIVE",
};

const StateListPage = () => {
  useDocumentTitle(
    "State List",
  );

  const {
    loading,
    states,

    fetchState,

    create,
    update,
    remove,

    saving,
  } = useStates();

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    selectedState,
    setSelectedState,
  ] = useState<
    State | null
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
    useState<StateFormData>({
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

  const handleOpenCreate =
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

      setSelectedState(
        null,
      );
    };

  const handleSubmit =
    async () => {
      try {
        const payload:
          StateFormData = {
          ...formData,

          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          gstCode:
            formData.gstCode
              .trim(),
        };

        if (editId) {
          await update(
            editId,
            payload,
          );
        } else {
          await create(
            payload,
          );
        }

        handleCloseModal();
      } catch (error) {
        console.error(
          "Failed to save state:",
          error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        const state =
          await fetchState(
            uuid,
          );

        if (!state) {
          notify.error(
            "State not found.",
          );

          return;
        }

        setEditId(
          uuid,
        );

        setFormData({
          name:
            state.name,

          code:
            state.code,

          gstCode:
            state.gstCode ??
            "",

          status:
            state.status,
        });

        setOpenModal(
          true,
        );
      } catch (error) {
        console.error(
          "Failed to load state:",
          error,
        );
      }
    };

  const handleView =
    async (
      uuid: string,
    ) => {
      setSelectedState(
        null,
      );

      setOpenDetails(
        true,
      );

      try {
        const state =
          await fetchState(
            uuid,
          );

        if (!state) {
          notify.error(
            "State not found.",
          );

          setOpenDetails(
            false,
          );

          return;
        }

        setSelectedState(
          state,
        );
      } catch (error) {
        console.error(
          "Failed to load state details:",
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
          "Are you sure you want to delete this state?",
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
          "Failed to delete state:",
          error,
        );
      }
    };

  return (
    <>
      <PageHeader
        title="States"
        subtitle="Manage states"
        actions={
          <Button
            onClick={
              handleOpenCreate
            }
          >
            Create State
          </Button>
        }
      />

      <Card>
        <StateTable
          data={
            states
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

      <StateModal
        open={
          openModal
        }
        loading={
          saving
        }
        title={
          editId
            ? "Edit State"
            : "Create State"
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
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />

      <StateDetailsModal
        open={
          openDetails
        }
        loading={
          openDetails &&
          !selectedState
        }
        state={
          selectedState
        }
        onClose={
          handleCloseDetails
        }
      />
    </>
  );
};

export default StateListPage;