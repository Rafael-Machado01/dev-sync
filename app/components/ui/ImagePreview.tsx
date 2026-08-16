"use client";
import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Label from "@/app/components/ui/Label";
import Image from "next/image";
export default function ImagePreview() {
  const [imageSelect, setImageSelect] = useState<string | null>(null);
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onClickRemove = () => {
    setImageSelect("");
  };
  return (
    <div>
      {imageSelect && (
        <div>
          <Image
            src={imageSelect}
            height={100}
            width={200}
            className="rounded-lg object-fill shadow-md w-[200] h-[100]"
            alt="Pré visualização de imagem."
          />
          <button
            onClick={onClickRemove}
            className="text-drac-comment text-sm cursor-pointer"
          >
            Remover Imagem
          </button>
        </div>
      )}
      <Label
        text={"📷 foto"}
        className="cursor-pointer bg-drac-surface p-2 rounded-lg"
      >
        <Input
          type="file"
          name="image"
          onChange={handleChangeImage}
          accept="image/*"
          className="hidden"
        />
      </Label>
    </div>
  );
}
