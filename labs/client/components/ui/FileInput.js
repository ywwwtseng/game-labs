function FileInput({ children, filetypes = [], onChange }) {
  const handleFileChange = async (event) => {
    await onChange(event.target.files[0]);
    event.target.value = '';
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }

    const file = files[0];

    if (filetypes.length > 0 && !filetypes.includes(file.type)) {
      return;
    }

    await onChange(files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label htmlFor="dropzone-file">
        {children}
        <input
          id="dropzone-file"
          type="file"
          accept={filetypes.join(", ")}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

export { FileInput };
