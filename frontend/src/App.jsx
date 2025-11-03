import Header from "./components/header";
import Footer from "./components/footer";
import Landing from "./pages/landing";
import SignupLoginPage from "./pages/signup-login";
import { BrowserRouter, Routes, Route } from "react-router";
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

  return (
     <BrowserRouter>
      <style>{style}</style>
      {/* Flex container for sticky footer */}
      <div className="flex flex-col min-h-screen bg-gray-950 font-sans text-white antialiased">
        <Header />

        {/* Main content grows to fill remaining space */}
        <main className="grow mt-0 pt-14">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup-login" element={<SignupLoginPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
