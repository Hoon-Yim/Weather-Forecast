// Modules
import axios from "axios";
import React, { useEffect, useState } from "react";

// Components
import { 
    Card,
    Col,
    Container,
    Image,
    Row
} from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Weather() {
    const API_KEY = "d41ba901f7d73a979c632e4bb500af1d";

    const [apiResult, setApiResult] = useState();

    const [weather, setWeather] = useState();

    const [day, setDay] = useState("");
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    function timeConverter(UNIX_timestamp, UTC_timezone) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const date = new Date((UNIX_timestamp + UTC_timezone) * 1000);
        setDay(days[date.getDay()]);
        setDate(date.getDate());
        setMonth(months[date.getMonth()]);
        setYear(date.getFullYear());

        return date;
    }

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=toronto,ca&units=metric&appid=${API_KEY}`)
        .then(res => {
            setApiResult(res.data);

            setWeather(res.data.weather[0]);
            timeConverter(res.data.dt, res.data.timezone);
        })
    }, []);

    return (
        apiResult &&
            <div>
                <h1>Weather Forecast</h1>
                <Card>
                    <Container>
                        <Row>
                            <div className="d-flex justify-content-center align-items-center">
                                <h3>{day}</h3>
                                <div style={{ "font-size": "10px" }}>
                                    <div>{date} {month} {year}</div>
                                    <div><FaMapMarkerAlt />{apiResult.name}, {apiResult.sys.country}</div>
                                </div>
                            </div>
                        </Row>

                        <Row className="align-items-center">
                            <Col className="d-flex flex-column align-items-center">
                                <Image src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></Image>
                                <h3>{weather.main}</h3>
                            </Col>
                            <Col>
                                <h1>{apiResult.main.temp}°C</h1>
                                <div>Feels like {apiResult.main.feels_like}</div>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="justify-content-center">
                        <Row>
                            <Col>
                                <div>Min: {apiResult.main.temp_min}°C</div>
                                <div>Max: {apiResult.main.temp_max}°C</div>
                            </Col>
                            <Col>
                                <div>Humidity: {apiResult.main.humidity}%</div>
                                <div>Wind: {apiResult.wind.speed}/s</div>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </div>
    )
}