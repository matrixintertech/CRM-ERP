import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import {
  useProjects,
} from "../hooks/useProjects";


import {
  useClients,
} from "../../client/hooks/useClients";


import {
  useStates,
} from "../../master/state/hooks/useStates";


import {
  useCities,
} from "../../master/city/hooks/useCities";


import {
  useProjectCategories,
} from "../../project-category/hooks/useProjectCategory";


import {
  useOrganizationUnits,
} from "../../organization-unit/hooks/useOrganizationUnits";


import ProjectTable from "../components/ProjectTable";

import ProjectModal from "../components/ProjectModal";

import ProjectDetailsModal from "../components/ProjectDetailsModal";


import type {
  CreateProjectRequest,
} from "../types/project.types";



const initialFormData:
  CreateProjectRequest = {

  clientUuid: "",

  categoryUuid: "",

  organizationUnitUuid: "",

  name: "",

  stateUuid: "",

  cityUuid: "",

  address: "",

  pincode: "",

  startDate: "",

  expectedEndDate: "",

  remarks: "",

};




const ProjectListPage = () => {


  const {
    loading,

    projects,

    total,

    selectedProject,


    fetchProjects,

    fetchProject,


    create,

    update,

    remove,

  } = useProjects();





  const {
    dropdown:
      clientOptions,

    fetchDropdown:
      fetchClientDropdown,

  } = useClients();





  const {
    dropdown:
      stateOptions,

    fetchDropdown:
      fetchStateDropdown,

  } = useStates();





  const {
    dropdownCities:
      cityOptions,

    fetchDropdownCities:
      fetchCityDropdown,

  } = useCities();





  const {

    categories,

    fetchCategories,

  } = useProjectCategories();





 const {
  organizationUnits,
  fetchOrganizationUnits,
} = useOrganizationUnits();


console.log(
  "organizationUnits",
  organizationUnits,
);


  const [
    openModal,
    setOpenModal,
  ] = useState(false);





  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);





  const [
    editId,
    setEditId,
  ] = useState<string | null>(null);





  const [
    formData,
    setFormData,
  ] =
  useState<CreateProjectRequest>(
    initialFormData,
  );





  useEffect(() => {

    fetchProjects();

  }, []);







  const handleOpenCreateModal =
    async () => {


      await Promise.all([

  fetchClientDropdown(),

  fetchStateDropdown(),

  fetchCategories(),

  fetchOrganizationUnits(),

]);



      setEditId(null);



      setFormData(
        initialFormData,
      );



      setOpenModal(true);

    };







  const handleStateChange =
    async (
      stateUuid:string,
    ) => {

      await fetchCityDropdown(
        stateUuid,
      );

    };







  const handleSubmit =
    async () => {


      if(editId){

        await update(
          editId,
          formData,
        );

      }
      else{

        await create(
          formData,
        );

      }



      await fetchProjects();



      setOpenModal(false);



      setEditId(null);



      setFormData(
        initialFormData,
      );

    };







  const handleEdit =
    async (
      uuid:string,
    ) => {


     await Promise.all([

  fetchClientDropdown(),

  fetchStateDropdown(),

  fetchCategories(),

  fetchOrganizationUnits(),

]);



      const response =
        await fetchProject(
          uuid,
        );



      if(
        !response?.project
      ){
        return;
      }



      const project =
        response.project;





      if(project.state?.uuid){

        await fetchCityDropdown(
          project.state.uuid,
        );

      }





      setEditId(uuid);




      setFormData({

        clientUuid:
          project.client?.uuid ??
          "",


        categoryUuid:
          project.category?.uuid ??
          "",


        organizationUnitUuid:
          project.organizationUnit?.uuid ??
          "",



        name:
          project.name,



        stateUuid:
          project.state?.uuid ??
          "",



        cityUuid:
          project.city?.uuid ??
          "",



        address:
          project.address ??
          "",



        pincode:
          project.pincode ??
          "",



        startDate:
          project.startDate
            ? project.startDate.slice(
                0,
                10,
              )
            : "",



        expectedEndDate:
          project.expectedEndDate
            ? project.expectedEndDate.slice(
                0,
                10,
              )
            : "",



        remarks:
          project.remarks ??
          "",

      });



      setOpenModal(true);

    };







  const categoryOptions =
  categories.map(
    (item) => ({
      label: item.name,
      value: item.uuid,
    }),
  );


const branchOptions =
  organizationUnits
    .filter(
      (item) =>
        item.status === "ACTIVE",
    )
    .map(
      (item) => ({
        label:
          `${item.name} (${item.code})`,

        value:
          item.uuid,
      }),
    );






  return (
    <>

      <PageHeader

        title="Projects"

        subtitle="Manage company projects"

        actions={

          <Button
            onClick={
              handleOpenCreateModal
            }
          >
            Create Project
          </Button>

        }

      />



      <Card>

        <ProjectTable

          data={
            projects
          }

          loading={
            loading
          }

          onView={
            async(uuid)=>{

              await fetchProject(
                uuid,
              );

              setOpenDetails(
                true,
              );

            }
          }


          onEdit={
            handleEdit
          }


          onDelete={
            async(uuid)=>{

              await remove(
                uuid,
              );

              await fetchProjects();

            }
          }

        />

      </Card>





      <ProjectModal

        open={
          openModal
        }

        loading={
          loading
        }


        title={
          editId
            ? "Edit Project"
            : "Create Project"
        }


        isEdit={
          !!editId
        }


        formData={
          formData
        }


        setFormData={
          setFormData
        }


        clientOptions={
          clientOptions
        }


        categoryOptions={
          categoryOptions
        }


        branchOptions={
          branchOptions
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


        onClose={()=>
          setOpenModal(false)
        }


        onSubmit={
          handleSubmit
        }

      />





      <ProjectDetailsModal

        open={
          openDetails
        }


        loading={
          loading
        }


        project={
          selectedProject
        }


        onClose={()=>
          setOpenDetails(false)
        }

      />


    </>
  );

};


export default ProjectListPage;