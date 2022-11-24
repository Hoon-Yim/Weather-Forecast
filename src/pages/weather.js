// Modules
import axios from "axios";
import React, { useEffect, useState } from "react";

// Components
import { 
    Card,
    Col,
    Container,
    Form,
    FloatingLabel,
    Image,
    Row,
    Alert
} from "react-bootstrap";
import { 
    FaSearch,
    FaMapMarkerAlt
} from "react-icons/fa";

export default function Weather() {
    const API_KEY = "d41ba901f7d73a979c632e4bb500af1d";

    const [apiResult, setApiResult] = useState();

    const [weather, setWeather] = useState();

    const [day, setDay] = useState("");
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [searchCity, setSearchCity] = useState("toronto");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isValid, setIsValid] = useState(true);

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
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`)
        .then(res => {
            console.log(searchCity, res.data);
            setApiResult(res.data);

            setWeather(res.data.weather[0]);
            timeConverter(res.data.dt, res.data.timezone);

            setIsValid(true);
        }).catch(error => {
            setIsValid(false);
        })
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
        apiResult &&
            <div className="d-flex flex-column align-items-center">
                <h1 className="mb-4">Weather Forecast</h1>
                <Card 
                    className="p-5"
                    style={{ 
                        background: "rgba(255, 255, 255, 0.7)", 
                        color: "" 
                    }}
                >
                    {isValid || <Alert variant="danger">Cannot find {searchCity} City</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Control 
                            type="text" 
                            placeholder={"Search by City Name"}
                            onChange={setCity}
                            style={{ borderRadius: "100px", opacity: "80%"}}
                        />
                    </Form>
                    <Container className="p-3" /* style={{ border: "1px solid", "border-radius": "25px" }} */>
                        <Row>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <h3>{day}</h3>
                                <div style={{ "fontSize": "10px" }}>
                                    <div>{date} {month} {year} <FaMapMarkerAlt /> {apiResult.name}, {apiResult.sys.country}</div>
                                </div>
                            </div>
                        </Row>

                        <Row className="align-items-center">
                            <Col className="d-flex flex-column align-items-center">
                                <Image src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></Image>
                                {/* <h3>{weather.main}</h3> */}
                            </Col>
                            <Col>
                                <h1>{apiResult.main.temp}°C</h1>
                                <div>Feels like {apiResult.main.feels_like}°C</div>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="justify-content-center">
                        <Row>
                            <Col>
                                <div>Min: {apiResult.main.temp_min}°C</div>
                                <div>Humidity: {apiResult.main.humidity}%</div>
                            </Col>
                            <Col>
                                <div>Max: {apiResult.main.temp_max}°C</div>
                                <div>Wind: {apiResult.wind.speed} m/s</div>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </div>
    )
}