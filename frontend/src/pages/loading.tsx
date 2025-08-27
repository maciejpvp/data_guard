import { Spinner } from "@heroui/spinner";

import AuthLayout from "@/layouts/auth";

export const LoadingPage = () => {
  return (
    <AuthLayout>
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        size="lg"
        variant="gradient"
      />
    </AuthLayout>
  );
};
