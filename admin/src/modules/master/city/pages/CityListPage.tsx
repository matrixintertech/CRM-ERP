import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import CityDetailsModal from "../components/CityDetailsModal";
import CityModal from "../components/CityModal";
import CityTable from "../components/CityTable";

import { useCities } from "../hooks/useCities";

import type {
  CityFormData,
} from "../types/city.types";

const initialFormData: CityFormData = {
  stateUuid: "",
  name: "",
  status: "ACTIVE",
};

const CityListPage = () => {
  const {
    loading,
    cities,
    selectedCity,
    fetchCities,
    fetchCity,
    create,
    update,
    remove,
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
    useState<CityFormData>(
      () => ({
        ...initialFormData,
      }),
    );

  useEffect(() => {
    void fetchCities();
  }, [fetchCities]);

  const resetForm = () => {
    setEditId(null);

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
    try {
      const payload: CityFormData = {
        ...formData,
        stateUuid:
          formData.stateUuid.trim(),
        name: formData.name.trim(),
      };

      if (editId) {
        await update(
          editId,
          payload,
        );
      } else {
        await create(payload);
      }

      await fetchCities();

      handleCloseModal();
    } catch (error) {
      console.error(
        "Failed to save city:",
        error,
      );
    }
  };

  const handleEdit = async (
    uuid: string,
  ) => {
    try {
      const city =
        await fetchCity(uuid);

      if (!city) {
        return;
      }

      setEditId(uuid);

      setFormData({
        stateUuid:
          city.stateUuid,
        name: city.name,
        status: city.status,
      });

      setOpenModal(true);
    } catch (error) {
      console.error(
        "Failed to load city:",
        error,
      );
    }
  };

  const handleView = async (
    uuid: string,
  ) => {
    try {
      const city =
        await fetchCity(uuid);

      if (!city) {
        return;
      }

      setOpenDetails(true);
    } catch (error) {
      console.error(
        "Failed to load city details:",
        error,
      );
    }
  };

  const handleDelete = async (
    uuid: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this city?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await remove(uuid);
      await fetchCities();
    } catch (error) {
      console.error(
        "Failed to delete city:",
        error,
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Cities"
        subtitle="Manage cities"
        actions={
          <Button
            onClick={
              handleOpenCreate
            }
          >
            Create City
          </Button>
        }
      />

      <Card>
        <CityTable
          data={cities}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <CityModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit City"
            : "Create City"
        }
        isEdit={Boolean(editId)}
        formData={formData}
        setFormData={setFormData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <CityDetailsModal
        open={openDetails}
        loading={loading}
        city={selectedCity}
        onClose={() => {
          setOpenDetails(false);
        }}
      />
    </>
  );
};

export default CityListPage;