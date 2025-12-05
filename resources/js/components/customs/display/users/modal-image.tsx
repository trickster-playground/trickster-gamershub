/**
 * Node Modules
 */
import { AnimatePresence, motion } from 'framer-motion';

type ModalImageProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string | null;
  alt?: string;
};

const ModalImage = ({
  isOpen,
  onClose,
  src,
  alt = 'image preview',
}: ModalImageProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={src || ''}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalImage;
