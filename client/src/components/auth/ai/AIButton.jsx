import { Bot, X } from "lucide-react";
import { motion } from "framer-motion";

const AIButton = ({ open, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#6072D8] text-white shadow-lg shadow-[#6072D8]/25 transition-colors hover:bg-[#5264CC] md:bottom-6 md:right-6"
      aria-label={open ? "Close CareerShield AI" : "Open CareerShield AI"}
    >
      {open ? (
        <X size={22} strokeWidth={2} />
      ) : (
        <Bot size={23} strokeWidth={2} />
      )}
    </motion.button>
  );
};

export default AIButton;
