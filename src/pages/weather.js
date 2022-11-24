// Modules
import axios from "axios";
import React, { useEffect, useState } from "react";

// Components
import { 
    Card,
    Col,
    Container,
    Form,
    Image,
    Row,
    Alert,
    ListGroup
} from "react-bootstrap";
import { 
    FaMapMarkerAlt,
    FaTemperatureHigh,
    FaTemperatureLow,
    FaWind
} from "react-icons/fa";
import {
    GiWaterDrop
} from "react-icons/gi"

export default function Weather() {
    const API_KEY = "d41ba901f7d73a979c632e4bb500af1d";

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Current Weather
    const [apiResult, setApiResult] = useState();
    const [weather, setWeather] = useState();
    const [currentTime, setCurrentTime] = useState();

    // Forecast Weathers
    const [weathers, setWeathers] = useState();

    // For searching function
    const [searchCity, setSearchCity] = useState("toronto");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isValid, setIsValid] = useState(true);

    function timeConverter(UNIX_timestamp, UTC_timezone) {
        const date = new Date((UNIX_timestamp + UTC_timezone) * 1000);
        const time = {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
            year: date.getFullYear()
        }

        setCurrentTime(time);

        return date;
    }

    useEffect(() => {
        // Getting Current Weather
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`)
        .then(res => {
            setApiResult(res.data);

            setWeather(res.data.weather[0]);
            timeConverter(res.data.dt, res.data.timezone);

            setIsValid(true);
        }).catch(error => {
            setIsValid(false);
        });

        // Forecast Weathers
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=metric&appid=${API_KEY}`)
        .then(res => {
            const list = res.data.list;
            const weathers = [];
            
            for (let i = 0; i < list.length; ++i) {
                const time = new Date(list[i].dt_txt);
                console.log(time);
                if (time.getHours() == 0) {
                    const weather = {
                        icon: list[i].weather[0].icon,
                        day: days[time.getDay()]
                    }
                    weathers.push(weather);
                }
            }

            setWeathers(weathers);
        });
    }, [hasSubmitted]);

    useEffect(() => {
        setIsValid(true);
    }, [searchCity])

    function handleSubmit(event) {
        event.preventDefault();

        setHasSubmitted(!hasSubmitted);
    }

    function setCity(event) {
        setSearchCity(event.target.value);
    }

    return (
        (apiResult && weathers) &&
            <div className="d-flex flex-column align-items-center">
                <h1 className="mb-4">Weather Forecast</h1>
                <Card 
                    className="p-5"
                    style={{ 
                        background: "rgba(255, 255, 255, 0.8)", 
                        color: "" 
                    }}
                >
                    <Container style={{ width: "80%" }}>
                        {isValid || <Alert variant="danger">Cannot find {searchCity} City</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                type="text"
                                placeholder={"Search by City Name"}
                                onChange={setCity}
                                style={{ borderRadius: "100px", opacity: "80%" }}
                            />
                        </Form>
                        <Container className="p-3" /* style={{ border: "1px solid", "border-radius": "25px" }} */>
                            <Row>
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                    <h3>{currentTime.day}</h3>
                                    <div style={{ "fontSize": "10px" }}>
                                        <div>{currentTime.date} {currentTime.month} {currentTime.year} <FaMapMarkerAlt /> {apiResult.name}, {apiResult.sys.country}</div>
                                    </div>
                                </div>
                            </Row>

                            <Row>
                                <Col>
                                    <Image src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></Image>
                                </Col>
                                <Col className="d-flex flex-column justify-content-center align-items-center">
                                    <span style={{ fontSize: "50px" }}>{apiResult.main.temp}°C</span>
                                    <span style={{ fontSize: "10px" }}>Feels like {apiResult.main.feels_like}°C</span>
                                </Col>
                            </Row>

                        </Container>
                        <Container className="justify-content-center">
                            <Row>
                                <Col style={{ paddingLeft: "40px" }}>
                                    <div><FaTemperatureLow /> {apiResult.main.temp_min}°C</div>
                                    <div><GiWaterDrop /> {apiResult.main.humidity}%</div>
                                </Col>
                                <Col>
                                    <div><FaTemperatureHigh /> {apiResult.main.temp_max}°C</div>
                                    <div><FaWind /> {apiResult.wind.speed} m/s</div>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                    {
                        <div className="d-flex" style={{ marginTop: "40px"}}>
                            {weathers.map((w, i) => {
                                return (
                                    <div key={i} className="d-flex flex-column align-items-center">
                                        <span><b>{w.day}</b></span>
                                        <Image width="90" src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}></Image>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </Card>
            </div>
    )
}