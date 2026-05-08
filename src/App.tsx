import { Header } from "./components/Header";
import { MainList } from "./components/MainList";
import { UpdatePrompt } from "./components/UpdatePrompt";
import "./index.css";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <Header />
      <main style={{ paddingTop: "2rem" }}>
        <MainList />
      </main>
      <UpdatePrompt />
    </div>
  );
}

export default App;
