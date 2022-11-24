// Modules
import React from "react";

// CSS
import "bootstrap/dist/css/bootstrap.min.css"

// Pages
import Weather from "./pages/weather";

export default function App() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }} >
            <Weather />
        </div>
    );
}