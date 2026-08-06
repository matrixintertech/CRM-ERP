import CompanyProfileForm from "../components/forms/CompanyProfileForm";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

const CompanyProfilePage = () => {
  useDocumentTitle("Company Profile");
  const { company, loading, saving, saveCompanyProfile } = useCompanyProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CompanyProfileForm
      company={company}
      saving={saving}
      onSubmit={saveCompanyProfile}
    />
  );
};

export default CompanyProfilePage;
