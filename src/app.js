// Modules
import React from "react";

// CSS
import "bootstrap/dist/css/bootstrap.min.css"

// Pages
import Weather from "./pages/weather";

// Resources
import background from "./resource/img/cristina-gottardi-CSpjU6hYo_0-unsplash.jpg"

export default function App() {
    return (
        <div 
            className="d-flex justify-content-center align-items-center" 
            style={{
                backgroundImage: `url(${background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}
        >
            <Weather />
        </div>
    );
}