import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaXmark } from "react-icons/fa6";

import { Requirements } from "@/pages/createvault";

type Props = {
  requirements: Requirements;
  requirementsStatus: boolean[];
  focus: boolean;
};

export const MasterKeyRequirements = ({
  requirements,
  requirementsStatus,
  focus,
}: Props) => {
  return (
    <motion.ul
      animate={{ height: focus ? "auto" : 0, opacity: focus ? 1 : 0 }}
      className="ml-1"
      initial={false}
      style={{
        listStyle: "none",
        paddingLeft: 0,
        marginTop: 8,
        overflow: "hidden",
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {requirements.map((req, i) => {
        const satisfied = requirementsStatus[i];

        return (
          <motion.li
            key={req.label}
            layout
            animate={{
              color: satisfied ? "green" : "red",
              fontWeight: satisfied ? 700 : 400,
            }}
            className="flex flex-row justify-left items-center gap-2"
            transition={{ duration: 0.25 }}
          >
            <AnimatePresence initial={false} mode="wait">
              {satisfied ? (
                <motion.span
                  key="check"
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCheck />
                </motion.span>
              ) : (
                <motion.span
                  key="xmark"
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaXmark />
                </motion.span>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={satisfied ? "text-yes" : "text-no"}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: satisfied ? 10 : -10 }}
                initial={{ opacity: 0, x: satisfied ? -10 : 10 }}
                transition={{ duration: 0.25 }}
              >
                {req.label}
              </motion.span>
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};
