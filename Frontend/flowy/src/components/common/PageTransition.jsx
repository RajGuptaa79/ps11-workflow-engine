import { motion } from "framer-motion";

const variants = {
  default: {
    initial: { opacity: 0, y: 18, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -12, filter: "blur(6px)" },
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
  "diagram-rail-forward": {
    initial: { opacity: 0.96, x: 120, scale: 0.985, filter: "blur(6px)" },
    animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0.88, x: -180, scale: 0.985, filter: "blur(4px)" },
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PageTransition({ children, mode = "default" }) {
  const config = variants[mode] ?? variants.default;

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
