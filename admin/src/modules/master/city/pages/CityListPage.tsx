import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import { useCities } from "../hooks/useCities";

import CityTable from "../components/CityTable";
import CityModal from "../components/CityModal";
import CityDetailsModal from "../components/CityDetailsModal";

import type { CityFormData } from "../types/city.types";

const initialFormData: CityFormData =
  {
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
      initialFormData,
    );

  useEffect(() => {
    fetchCities();
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

      await fetchCities();

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
      const city =
        await fetchCity(uuid);

      if (!city) return;

      setEditId(uuid);

      setFormData({
        stateUuid:
          city.stateUuid,
        name: city.name,
        status: city.status,
      });

      setOpenModal(true);
    };

  return (
    <>
      <PageHeader
        title="Cities"
        subtitle="Manage cities"
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
            Create City
          </Button>
        }
      />

      <Card>
        <CityTable
          data={cities}
          loading={loading}
          onView={async (
            uuid,
          ) => {
            await fetchCity(
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

            await fetchCities();
          }}
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

      <CityDetailsModal
        open={openDetails}
        loading={loading}
        city={
          selectedCity
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

export default CityListPage;