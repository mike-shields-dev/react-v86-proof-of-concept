import "./App.css";
import { useV86EmulatorContext } from "./context/useV86EmulatorContext";

function App() {
  const { emulator, screen, canvas, toggleCanvas } = useV86EmulatorContext();
  return <div>
    <button onClick={toggleCanvas}></button>
  </div>;
}

export default App;
