import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      className="dark-surface fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      onAnimationComplete={() => document.body.style.overflow = 'auto'}
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative aspect-square w-[min(82vw,620px)]"
      >
        <div className="absolute inset-0 z-10 overflow-hidden">
          <img
            src="/images/loading-logo.jpg"
            alt="Chandima Kosala logo"
            className="h-full w-full scale-[1.45] object-contain"
          />
        </div>
        <motion.div 
          className="absolute -inset-4 border border-primary/30 rounded-full"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
