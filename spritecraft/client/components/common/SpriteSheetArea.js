import { useContext, useState } from "react";
import useSWR from "swr";
import cx from "classnames";

import { AppContext } from "@/store/AppContext";
import { FileInput } from "@/components/ui/FileInput";
import { SpriteSheetSettings } from "@/components/common/SpriteSheetSettings";
import { AreaHeader } from "@/components/common/AreaHeader";
import { CheckIcon } from "@/components/icon/CheckIcon";

function SpriteSheetArea() {
  const { state } = useContext(AppContext);
  const [selectedSpriteSheet, selectSpriteSheet] = useState(null);
  const { mutate } = useSWR("/api/sprites");

  const upload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="relative rounded w-64 h-full max-h-full flex flex-col ml-1 z-10">
      <div className="flex flex-col rounded w-full h-[245px] bg-[#282828]">
        <AreaHeader
          icon={
            <svg
              className="w-4 h-4 text-white mr-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
              />
            </svg>
          }
          title="SpriteSheets"
          actions={[
            <FileInput key="create-spritesheet" onChange={upload}>
              <svg
                className="w-4 h-4 text-white cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                  clipRule="evenodd"
                />
              </svg>
            </FileInput>,
          ]}
        />

        <div className="flex-1 overflow-y-scroll no-scrollbar">
          {Object.keys(state.spriteSheets).map((filename) => (
            <div
              key={filename}
              className={cx(
                "flex items-center cursor-pointer text-xs whitespace-nowrap px-1 py-0.5 odd:bg-[#2B2B2B] hover:text-white",
                {
                  "text-zinc-400": selectedSpriteSheet !== filename,
                  "text-white": selectedSpriteSheet === filename,
                }
              )}
              onClick={() =>
                selectSpriteSheet(
                  selectedSpriteSheet === filename ? null : filename
                )
              }
            >
              <div className="w-4 h-4 mr-1">
                {selectedSpriteSheet === filename && <CheckIcon />}
              </div>
              {filename}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded w-full flex-1 bg-[#282828] mt-1 flex flex-col">
        {selectedSpriteSheet && (
          <SpriteSheetSettings
            key={selectedSpriteSheet}
            spriteSheet={state.spriteSheets[selectedSpriteSheet]}
          />
        )}
      </div>
    </div>
  );
}

export { SpriteSheetArea };
