import Sidebar from "./pages/Dashboard";
import AppRouter from "./router/index";

function App() {
  return (
    <Sidebar>
      <AppRouter />
    </Sidebar>
  );
}

export default App;