import React from "react";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import { Dialog } from "primereact/dialog";

const ModalPDF = ({ visible, onClose }) => {
  const { srcPDF } = useRequisiciones();

  const cerrar_modal = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        header={<h1>PDF</h1>}
        visible={visible}
        onHide={cerrar_modal}
        className="w-full h-full"
      >
          <iframe src={srcPDF} className="w-full h-full"></iframe>
      </Dialog>
    </>
  );
};

export default ModalPDF;
