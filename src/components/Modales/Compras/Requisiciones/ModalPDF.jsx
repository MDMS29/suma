import useRequisiciones from "../../../../hooks/Compras/useRequisiciones";
import { Dialog } from "primereact/dialog";
import Loader from "../../../Loader";

const ModalPDF = ({ visible, onClose }) => {
  
  const { srcPDF } = useRequisiciones();
  const { data, requisicion } = srcPDF;

  const cerrar_modal = () => {
    onClose();
  };

  return (
    <Dialog
      header={
        <h1 className="font-sans fw-bold text-2xl">
          PDF Requisición ({requisicion})
        </h1>
      }
      visible={visible}
      onHide={cerrar_modal}
      className="w-2/3 h-full"
    >
      {!data ? (
        <Loader />
      ) : (
        <embed src={data} type="application/pdf" className="w-full h-full" />
      )}
    </Dialog>
  );
};

export default ModalPDF;
