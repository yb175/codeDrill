import Header from "./components/header";
import Footer from "./components/footer";
import Landing from "./pages/landing";
import { BrowserRouter, Routes, Route, useLocation } from "react-router"; // Import useLocation
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkToken } from "./slice/authSlice";
import ErrorToast from "./assets/errorToast";
import VerifyEmailFailed from "./pages/emailVerifiedFailed";
import VerifyEmailSuccess from "./pages/emailverified";
import AuthPage from "./pages/signup-login";
import Admin from "./pages/admin";
import AddProblem from "./pages/addProblem";
import EditProblem from "./pages/editProblem";
import AdminLayout from "./layout/adminLayout";
import ProblemsPage from "./pages/problemlist";
import ProblemWorkSpace from "./pages/problems";

// Create a wrapper component to use useLocation hook
function AppContent() {
  const location = useLocation();
  const isVerified = useSelector((state) => state.auth.isVerified);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  // Check if current route is a problem workspace
  // Matches /problems/1, /problems/two-sum, etc.
  const isWorkspace = /^\/problems\/[^/]+$/.test(location.pathname);

  // If it's a workspace, we want exactly 100vh and no scroll on the body
  // If standard page, we want min-h-screen and normal scroll
  const containerClass = isWorkspace
    ? "flex flex-col h-screen overflow-hidden bg-gray-950 font-sans text-white antialiased"
    : "flex flex-col min-h-screen bg-gray-950 font-sans text-white antialiased";

  return (
    <div className={containerClass}>
      <Header />
      {error && <ErrorToast message={error.message} />}

      {/* If workspace: grow, but overflow-hidden to let the workspace manage its own scroll. 
         mt-0 and pt-14 usually account for fixed header height.
      */}
      <main className={`grow mt-0 ${isWorkspace ? "pt-14 overflow-hidden" : "pt-14"}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Landing />} />
          <Route path="/signup-login" element={<AuthPage />} />
          <Route
            path="/verify-email-failed"
            element={isVerified ? <Landing /> : <VerifyEmailFailed />}
          />
          <Route
            path="/verify-email-success"
            element={isVerified ? <Landing /> : <VerifyEmailSuccess />}
          />
          <Route
            path="/admin"
            element={user?.role === "admin" ? <AdminLayout /> : <AuthPage />}
          >
            <Route index element={<Admin />} />
            <Route path="Add" element={<AddProblem />} />
            <Route path="Edit/:id" element={<EditProblem />} />
          </Route>
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:id" element={<ProblemWorkSpace />} />
        </Routes>
      </main>

      {/* Conditionally render footer */}
      {!isWorkspace && <Footer />}
    </div>
  );
}

function App() {
  const style = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  .animate-spin-slow {
    animation: spin-slow 15s linear infinite;
  }
  html {
    scroll-behavior: smooth;
  }
  `;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <style>{style}</style>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;