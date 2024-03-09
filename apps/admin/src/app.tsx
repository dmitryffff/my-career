import type { FC} from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@repo/ui/button";


export const App: FC = () => {
  const [greetMsg, setGreetMsg] = useState("");

  async function greet(): Promise<void> {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      {greetMsg}
      <Button onClick={greet}>Greet!</Button>
    </div>
  );
}
