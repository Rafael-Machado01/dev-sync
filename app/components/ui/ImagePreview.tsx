export default function ImagePreview() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <Input
        id="image"
        type="file"
        onChange={handleImageChange}
        name="image"
        accept="image/*"
      />
      {selectedImage && (
        <input type="hidden" value={selectedImage.name} name="imageFile" />
      )}
    </div>
  );
}
