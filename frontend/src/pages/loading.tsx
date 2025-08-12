import AuthLayout from "@/layouts/auth";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/spinner";

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
