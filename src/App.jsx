import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateEditInterview from "./pages/CreateEditInterview";
import { InterviewProvider } from "./context/InterviewContext";
import { Toaster } from "sonner";

const App = () => {
  return (
    <InterviewProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-edit" element={<CreateEditInterview />} />
          </Routes>
        </div>
      </BrowserRouter>
    </InterviewProvider>
  );
};

export default App;
