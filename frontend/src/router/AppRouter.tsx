import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";


const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes here */}
    </Routes>
  </Router>
);

export default AppRouter;
