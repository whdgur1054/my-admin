//src\App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import MainRoutes from "./routes/MainRoutes";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 안 해도 접근 가능한 라우트 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 로그인한 사용자만 접근 */}
        <Route path="/main/*" element={<PrivateRoute />}>
          <Route path="*" element={<MainRoutes />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
