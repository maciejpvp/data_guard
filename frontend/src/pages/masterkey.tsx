import { FormEvent, useState } from "react";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import AuthLayout from "@/layouts/auth";
import { useAuthStore } from "@/store/authStore";
import { useCryptoStore } from "@/store/cryptoStore";
import { checkKey, getKeyFromMaster } from "@/utils/crypto";
import { logout } from "@/utils/auth";

type Props = {
  testValue: string;
};

export const MasterkeyPage = ({ testValue }: Props) => {
  const user = useAuthStore((store) => store.user);
  const setKey = useCryptoStore((store) => store.setKey);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const masterKey = formData.get("masterKey") as string;

    const key = await getKeyFromMaster(masterKey);
    const isCorrect = await checkKey(key, testValue);

    if (isCorrect) {
      setStatus("success");
      setTimeout(() => setKey(masterKey), 1000);
      // setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 800);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          animate={
            status === "error"
              ? { x: [0, -10, 10, -8, 8, -5, 5, 0] }
              : status === "success"
                ? { scale: [1, 1.05, 1] }
                : {}
          }
          transition={{ duration: status === "error" ? 0.4 : 0.3 }}
        >
          <motion.div
            animate={
              status === "error"
                ? { x: [0, -10, 10, -8, 8, -5, 5, 0] }
                : status === "success"
                  ? { y: [0, 10, 30, 1000], opacity: [1, 1, 0.8, 0] }
                  : {}
            }
            transition={{
              duration: status === "success" ? 0.8 : 0.3,
              ease: status === "success" ? "easeIn" : "easeOut",
            }}
          >
            <Card
              className={`flex flex-col p-2 w-96 shadow-lg shadow-black/20 transition-colors duration-300 ${
                status === "error"
                  ? "border-2 border-red-500"
                  : status === "success"
                    ? "border-2 border-green-500"
                    : ""
              }`}
            >
              <CardHeader className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="open"
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      initial={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <GiPadlockOpen
                        className="drop-shadow text-green-400"
                        size={64}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="closed"
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      initial={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <GiPadlock
                        className={`drop-shadow ${
                          status === "error" ? "text-red-400" : "text-blue-400"
                        }`}
                        size={64}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center">
                  <h1 className="text-lg font-semibold">
                    Your vault is locked
                  </h1>
                  <p className="text-sm leading-relaxed text-pretty text-center opacity-80">
                    {user?.email}
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      //eslint-disable-next-line
                      autoFocus
                      className={`transition-all duration-200 focus:scale-[1.02] ${
                        status === "error"
                          ? "border-red-500 border-2"
                          : status === "success"
                            ? "border-green-500 border-2"
                            : ""
                      }`}
                      defaultValue="SuperHaslo123_!"
                      label="Master Key"
                      name="masterKey"
                      placeholder="Enter master key"
                      type="password"
                    />
                  </div>
                  <div className="flex flex-col w-full items-center gap-2">
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button className="w-full" color="primary" type="submit">
                        <span className="font-semibold text-neutral-950">
                          Unlock
                        </span>
                      </Button>
                    </motion.div>
                    <p className="opacity-60 text-sm">or</p>
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        className="w-full border-3"
                        color="primary"
                        type="button"
                        variant="bordered"
                        onPress={logout}
                      >
                        <span className="font-semibold text-blue-300">
                          Log Out
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};
