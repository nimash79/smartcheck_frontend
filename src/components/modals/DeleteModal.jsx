import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "../icons/CloseIcon";
import CustomButton from '../shared/CustomButton';

const DeleteModal = ({ isOpen, onClose, count, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="custom-modal delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="custom-modal-close" onClick={onClose}>
              <CloseIcon />
            </div>
            <p className="title">آیا از حذف {count} ردیف انتخاب شده اطمینان دارید؟</p>
            <div className="delete-modal-buttons">
                <button type="button" onClick={onSubmit}>بله حذف</button>
                <button type="button" onClick={onClose}>بازگشت</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
