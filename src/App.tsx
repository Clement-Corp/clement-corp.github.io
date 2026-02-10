import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Choreography } from "./Choreography";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
                <h1 className="text-5xl font-bold my-4 leading-tight">Travaux en cours</h1>
                <p className="text-xl mb-8">Le site est actuellement en cours de développement.</p>
                <Link 
                  to="/choreography" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Go to Choreography Planner
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/choreography" element={<Choreography />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
