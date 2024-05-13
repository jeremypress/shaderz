import * as React from "react";
import animate from "./three.ts";

function App() {
  React.useEffect(() => {
    animate();
  }, []);
  return (
    <>
      <h1>shaderz</h1>
      <canvas id="canvas" />
    </>
  );
}

export default App;
