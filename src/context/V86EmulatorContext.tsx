import cssModule from "./V86Emulator.module.css";

import {
  ComponentProps,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { V86Starter } from "v86";
import v86Wasm from "v86/build/v86.wasm?url";
import bios from "v86/bios/seabios.bin?url";
import vgabios from "v86/bios/vgabios.bin?url";
import cdrom from "../assets/images/linux.iso?url";

// The v86 library has no TS definitions,
// the interface below is a manual work around
interface V86Emulator {
  running: boolean;
  stop: () => void;
  destroy: () => void;
  keyboard_set_status: (bool: boolean) => void;
  screen_go_fullscreen: () => void;
  // Add other methods and properties as needed
}

export interface V86EmulatorContextType {
  emulator: V86Emulator | null;
  screen: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  toggleCanvas: (() => void) | null;
}

export const V86EmulatorContext = createContext<V86EmulatorContextType>({
  emulator: null,
  screen: null,
  canvas: null,
  toggleCanvas: null,
});

export const V86EmulatorProvider = ({
  children,
}: ComponentProps<keyof JSX.IntrinsicElements>) => {
  const [emulator, setEmulator] = useState<V86Emulator | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const displayRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  function toggleCanvas() {
    setShowCanvas(!showCanvas);
  }

  useEffect(() => {
    if (!emulator && screenRef.current) {
      initialise();
    }
    
    function initialise() {
      if (screenRef.current) {
        try {
          setEmulator(
            new V86Starter({
              wasm_path: v86Wasm,
              memory_size: 32 * 1024 * 1024,
              vga_memory_size: 2 * 1024 * 1024,
              bios: { url: bios },
              screen_container: screenRef.current,
              cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
              vga_bios: { url: vgabios },
              cdrom: { url: cdrom },
              autostart: true,
            })
          );
        } catch (error) {
          console.error("Error initializing V86Starter:", error);
        }
      }
    }

    if (emulator) {
      emulator.keyboard_set_status(true);
    }

    return () => {
      if (emulator?.running) {
        emulator.stop();
        emulator.destroy();
      }
    };
  }, [emulator, screenRef]);


  return (
    <V86EmulatorContext.Provider
      value={{ emulator, screen: screenRef.current, canvas: canvasRef.current, toggleCanvas }}
    >
      <div ref={screenRef}>
        <div ref={displayRef} className={cssModule.display}></div>
        <canvas ref={canvasRef} style={{ display:  showCanvas ? "block" : "none" }}></canvas>
      </div>
      {children}
    </V86EmulatorContext.Provider>
  );
};
