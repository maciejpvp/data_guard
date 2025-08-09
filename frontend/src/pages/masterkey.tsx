import AuthLayout from "@/layouts/auth";
import { useAuthStore } from "@/store/authStore";

export const MasterkeyPage = () => {
  const user = useAuthStore((store) => store.user);

  console.log(user);

  return (
    <AuthLayout>
      <h1 className="absolute top-3 left-3 text-lg font-bold text-foreground">
        Data_Guard
      </h1>
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
        <p className="text-sm text-muted mb-5">Welcome back</p>
      </div>
    </AuthLayout>
  );
};
