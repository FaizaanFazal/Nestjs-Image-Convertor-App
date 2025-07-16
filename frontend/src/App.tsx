import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Sidebar from "./components/sections/Sidebar";

const App: React.FC = () => (
  <BrowserRouter>
    <Sidebar />
    <div className="md:pl-20">
      <AppRouter />
    </div>
  </BrowserRouter>
);

export default App;