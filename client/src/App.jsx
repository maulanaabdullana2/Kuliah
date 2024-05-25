import "./App.css";
import Protected from "./components/Protected";
import DashboardComponents from "./pages/dashboard";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrderComponents from "./pages/Users";
import "primereact/resources/themes/lara-light-cyan/theme.css";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard/users"
            element={
              <Protected>
                <OrderComponents />
              </Protected>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <Protected>
                <DashboardComponents />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
