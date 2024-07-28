import { setupDropToDraw } from "@/hooks/useDropToDraw";

function EditModeBehavior({ children }) {
  const setup = setupDropToDraw({ id: "canvas" });
  return children({ register: {}, connect: setup });
}

export { EditModeBehavior };
