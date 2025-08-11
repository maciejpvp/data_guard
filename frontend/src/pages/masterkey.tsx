import AuthLayout from "@/layouts/auth";
import { useAuthStore } from "@/store/authStore";
import { useCryptoStore } from "@/store/cryptoStore";

type Props = {
  testValue: string;
};

export const MasterkeyPage = ({ testValue }: Props) => {
  const user = useAuthStore((store) => store.user);
  const setKey = useCryptoStore((store) => store.setKey);

  const handleSubmit = async () => {
    const isCorrect = await setKey("SuperHaslo123_!", testValue);
    console.log(isCorrect);
  };

  return (
    <AuthLayout>
      <h1 className="absolute top-3 left-3 text-lg font-bold text-foreground">
        Data_Guard
      </h1>
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
        <p className="text-sm text-muted mb-5">Welcome back, {user?.name}</p>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </AuthLayout>
  );
};
