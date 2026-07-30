import CompanyProfileForm from "../components/forms/CompanyProfileForm";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

const CompanyProfilePage = () => {
  const {
    company,
    loading,
    saving,
    saveCompanyProfile,
  } = useCompanyProfile();

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