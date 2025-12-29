import LoginFrom from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

const Login: React.FC = async () => {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "applicant") return redirect("/dashboard");
    if (user.role === "employer") return redirect("/employer-dashboard");
  }

  return <LoginFrom />;
};

export default Login;
