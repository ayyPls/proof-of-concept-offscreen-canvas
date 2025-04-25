import { useState } from "react";
import "./App.css";
import { ViewerLayout } from "./layout";

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <ViewerLayout>
      <button onClick={() => setCounter((count) => (count += 1))}>
        {counter}
      </button>
    </ViewerLayout>
  );
}

export default App;
