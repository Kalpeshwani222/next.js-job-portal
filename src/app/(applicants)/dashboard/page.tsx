import { Button } from "@/components/ui/button";
import { logoutUserAction } from "@/features/auth/server/auth.actions";

const ApplicantDashboard = () => {
  return (
    <div>
      Applicant Dashboard
      <Button onClick={logoutUserAction}>Logout</Button>
    </div>
  );
};

export default ApplicantDashboard;
