import Header from "./components/header";
import Footer from "./components/footer";
import Landing from "./pages/landing";
import { BrowserRouter, Routes, Route } from "react-router";
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
  const isVerified = useSelector((state) => state.auth.isVerified);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <style>{style}</style>
      {/* Flex container for sticky footer */}
      <div className="flex flex-col min-h-screen bg-gray-950 font-sans text-white antialiased">
        <Header />
        {error && <ErrorToast message={error.message} />}
        {/* Main content grows to fill remaining space */}
        <main className="grow mt-0 pt-14">
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
              <Route index element={<Admin />} /> {/* /admin */}
              <Route path="Add" element={<AddProblem />} />{" "}
              <Route path="Edit/:id" element={<EditProblem />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
