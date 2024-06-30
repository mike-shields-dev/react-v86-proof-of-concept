import { useContext } from "react";
import { V86EmulatorContext, V86EmulatorContextType } from "./V86EmulatorContext";

export const useV86EmulatorContext = (): V86EmulatorContextType => {
  return useContext(V86EmulatorContext);
};
