import { EventUtil } from "@/utils/EventUtil";

function FileInput({ children, filetypes = [], className, onChange }) {
  const handleFileChange = async (event) => {
    await onChange(event.target.files[0]);
    event.target.value = '';
  };

  const handleDrop = async (event) => {
    EventUtil.stop(event);


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
      className={className}
      onClick={EventUtil.stopPropagation}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label>
        {children}
        <input
          type="file"
          accept={filetypes.join(", ")}
          className="hidden"
          onChange={handleFileChange}
          onFocus={console.log}
          onBlur={console.log}
        />
      </label>
    </div>
  );
}

export { FileInput };
