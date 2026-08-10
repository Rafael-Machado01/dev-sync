"use client";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import Modal from "@/app/components/ui/Modal";

export default function EditProfile() {
  const [state, setState] = useState(false);
  const handleClickEdit = () => {
    setState(!state);
  };
  return (
    <>
      <Button
        onClick={handleClickEdit}
        className="mt-3.5 w-full text-sm rounded-lg border border-drac-purple bg-transparent text-drac-purple hover:bg-drac-darker hover:text-drac-cyan"
      >
        [ EDITAR PERFIL ]
      </Button>
      {state ? <Modal title="Edit Profile">a</Modal> : ""}
    </>
  );
}
