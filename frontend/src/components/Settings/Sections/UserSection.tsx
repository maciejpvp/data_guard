import { useAuthStore } from "@/store/authStore";
import { User } from "@heroui/user";

export const UserSection = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <div className="p-2">
      <h1 className="text-xl">Account</h1>
      <div className="bg-content2 p-2 rounded-md">
        <User
          avatarProps={{
            src: user?.avatar,
            size: "lg",
          }}
          className=""
          description="Free Account"
          name={`${user?.name} ${user?.surname}`}
        />
      </div>
    </div>
  );
};
