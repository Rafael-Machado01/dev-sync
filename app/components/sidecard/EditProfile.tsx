"use client";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import Modal from "@/app/components/ui/Modal";

export default function EditProfile() {
  const [toggle, setToggle] = useState(false);
  const handleClickEdit = () => {
    setToggle(!toggle);
  };
  return (
    <>
      <Button
        onClick={handleClickEdit}
        className="mt-3.5 w-full text-sm rounded-lg border border-drac-purple bg-transparent text-drac-purple hover:bg-drac-darker hover:text-drac-cyan"
      >
        [ EDITAR PERFIL ]
      </Button>
      <Modal isOpen={toggle} onClose={handleClickEdit} title="Edit Profile">
        a
      </Modal>
    </>
  );
}
