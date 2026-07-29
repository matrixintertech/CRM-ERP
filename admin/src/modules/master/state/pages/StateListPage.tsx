import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import { useStates } from "../hooks/useStates";

import StateTable from "../components/StateTable";
import StateModal from "../components/StateModal";
import StateDetailsModal from "../components/StateDetailsModal";

import type { StateFormData } from "../types/state.types";

const initialFormData: StateFormData =
  {
    name: "",
    code: "",
    gstCode: "",
    status: "ACTIVE",
  };

const StateListPage = () => {
  const {
    loading,
    states,
    selectedState,
    fetchStates,
    fetchState,
    create,
    update,
    remove,
  } = useStates();

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<StateFormData>(
      initialFormData,
    );

  useEffect(() => {
    fetchStates();
  }, []);

  const handleSubmit =
    async () => {
      if (editId) {
        await update(
          editId,
          formData,
        );
      } else {
        await create(formData);
      }

      await fetchStates();

      setOpenModal(false);

      setEditId(null);

      setFormData(
        initialFormData,
      );
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      const state =
        await fetchState(uuid);

      if (!state) return;

      setEditId(uuid);

      setFormData({
        name: state.name,
        code: state.code,
        gstCode:
          state.gstCode ?? "",
        status: state.status,
      });

      setOpenModal(true);
    };

  return (
    <>
      <PageHeader
        title="States"
        subtitle="Manage states"
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
            Create State
          </Button>
        }
      />

      <Card>
        <StateTable
          data={states}
          loading={loading}
          onView={async (
            uuid,
          ) => {
            await fetchState(
              uuid,
            );

            setOpenDetails(
              true,
            );
          }}
          onEdit={
            handleEdit
          }
          onDelete={async (
            uuid,
          ) => {
            await remove(
              uuid,
            );

            await fetchStates();
          }}
        />
      </Card>

      <StateModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit State"
            : "Create State"
        }
        isEdit={!!editId}
        formData={formData}
        setFormData={
          setFormData
        }
        onClose={() =>
          setOpenModal(false)
        }
        onSubmit={
          handleSubmit
        }
      />

      <StateDetailsModal
        open={openDetails}
        loading={loading}
        state={
          selectedState
        }
        onClose={() =>
          setOpenDetails(
            false,
          )
        }
      />
    </>
  );
};

export default StateListPage;