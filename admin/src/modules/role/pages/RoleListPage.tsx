import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import { useRoles } from "../hooks/useRoles";

import RoleTable from "../components/RoleTable";
import RoleModal from "../components/RoleModal";
import RoleDetailsModal from "../components/RoleDetailsModal";

import type { RoleFormData } from "../types/role.types";


const RoleListPage = () => {
  const navigate = useNavigate();


  const { companyId } =
    useParams();

  const {
    loading,
    roles,
    selectedRole,
    fetchRoles,
    fetchRole,
    create,
    update,
    remove,
  } = useRoles();

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<RoleFormData>({
      companyId: Number(companyId),

      name: "",

      code: "",

      description: "",

      isSystem: false,
    });

  useEffect(() => {
    if (companyId) {
      fetchRoles(companyId);
    }
  }, [companyId]);

const handleSubmit = async () => {
  if (editId) {
    const {
      companyId,
      ...payload
    } = formData;

    await update(
      editId,
      payload,
    );
  } else {
    await create(formData);
  }

  await fetchRoles(companyId!);

  setOpenModal(false);

  setEditId(null);

  setFormData({
    companyId: Number(companyId),
    name: "",
    code: "",
    description: "",
    isSystem: false,
  });
};


const handleEdit = async (
  id: string,
) => {
  const role =
    await fetchRole(id);

  if (!role) return;

  setEditId(id);

  setFormData({
    companyId: Number(companyId),
    name: role.name,
    code: role.code,
    description:
      role.description ?? "",
    isSystem: role.isSystem,
  });

  setOpenModal(true);
};


const handlePermissions = (
  id: string,
) => {
  navigate(
    `/companies/${companyId}/roles/${id}/permissions`,
  );
};

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="Manage company roles"
        actions={
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  "/companies",
                )
              }
            >
              Back
            </Button>

            <Button
              onClick={() => {
                setEditId(null);

                setFormData({
                  companyId: Number(companyId),
                  name: "",
                  code: "",
                  description: "",
                  isSystem: false,
                });

                setOpenModal(true);
              }}
            >
              Create Role
            </Button>
          </div>
        }
      />

      <Card>
        <RoleTable
          data={roles}
          loading={loading}
          onView={async (
            id,
          ) => {
            await fetchRole(id);

            setOpenDetails(true);
          }}
           onEdit={handleEdit}
          onDelete={async (
            id,
          ) => {
            await remove(id);

            await fetchRoles(
              companyId!,
            );
          }}
           onPermissions={handlePermissions}
        />
      </Card>

      <RoleModal
        open={openModal}
        loading={loading}
         title={
            editId
              ? "Edit Role"
              : "Create Role"
          }
          isEdit={!!editId}
        formData={formData}
        setFormData={setFormData}
        onClose={() =>
          setOpenModal(false)
        }
        onSubmit={handleSubmit }
      />

      <RoleDetailsModal
        open={openDetails}
        role={selectedRole}
        loading={loading}
        onClose={() =>
          setOpenDetails(false)
        }
      />
    </>
  );
};

export default RoleListPage;