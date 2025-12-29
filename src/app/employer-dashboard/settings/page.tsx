import SettingForm from "@/features/employer/components/setting-form";
import { getCurrentEmployerDetails } from "@/features/employer/server/employers.queries";
import { EmployerProfileData } from "@/features/employer/employer.schema";
import { redirect } from "next/navigation";

const SettingPage = async () => {
  const current_user = await getCurrentEmployerDetails();
  if (!current_user) return redirect("/login");

  return (
    <SettingForm
      initialData={
        {
          name: current_user.employerDetails.name,
          description: current_user.employerDetails.description,
          organizationType: current_user.employerDetails.organizationType,
          teamSize: current_user.employerDetails.teamSize,
          location: current_user.employerDetails.location,
          websiteUrl: current_user.employerDetails.websiteUrl,
          yearOfEstablishment:
            current_user.employerDetails.yearOfEstablishment?.toString(),
          avatarUrl: current_user.employerDetails.avatarUrl,
          bannerImageUrl: current_user.employerDetails.bannerImageUrl,
        } as EmployerProfileData
      }
    />
  );
};

export default SettingPage;
