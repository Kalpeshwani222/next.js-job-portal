import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerCards from "@/features/employer/components/employer-cards";
import ProfileCompletion from "@/features/employer/components/profile-completion";

const EmployerDashboard = async () => {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, <span className="capitalize">{user?.name.toLowerCase()}</span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and appLications
        </p>
      </div>

      <EmployerCards />
      <ProfileCompletion />
    </div>
  );
};

export default EmployerDashboard;
