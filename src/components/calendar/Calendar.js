import { Fragment, useState, useEffect } from "react";
import { weekdays, months } from "./constants";
import {convert,formatUnix} from "../../utils/unixFormatter"
const Calendar = () => {
  //State for selected Date
  const [selectedDate, setSelectedDate] = useState(null);
  //State for current iterating week(0-5)
  const [weekno, setWeekNo] = useState(0);
  //State for storing all weeks
  const [weeks, setWeeks] = useState([]);
  //State for storing current week values
  const [currentWeek, setCurrentWeek] = useState({});
  //State for formatted unix data
  const [formattedUnix, setFormattedUnix] = useState([]);
  //State for events
  const [events,setEvents] = useState([])


  //Function to get dates for next 6 weeks and format and push them to weeks array
  const getDates = () => {
    let curr = new Date();
    let week = [];
    let res = [];
    let months = [];
    let year = "";
    for (let j = 1; j <= 7; j++) {
      for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i;
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        months.push(day.split("-")[1]);
        week.push(day);
        year = day.split("-")[0];
      }
      curr = new Date(week[week.length - 1]);
      const resObject = {
        week,
        month: [...new Set(months)],
        year,
      };
      week = [];
      months = [];
      year = "";
      res.push(resObject);
    }
    res = res.slice(1)
    setCurrentWeek(res[0]);
    setWeeks(res);
  };

  //Set Date
  const setDate = ()=>{
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    setSelectedDate(`${yyyy}-${mm}-${dd}`)
    const unix = convert(yyyy,mm,dd)
    const eventData = formattedUnix && formattedUnix.length>0 && formattedUnix.filter(el=>(el?.date/1000000)==unix)
    setEvents(eventData)
  }
  useEffect(() => {
    setFormattedUnix(formatUnix())
    getDates();
  }, []);

  useEffect(() => {
    setDate()
  }, [formattedUnix]);

  //Change the current week.
  const handeClick = (direction) => {
    setSelectedDate(null);
    setEvents([])
    if (direction == "next" && weekno < 5) {
      setCurrentWeek(weeks[weekno + 1]);
      setWeekNo((prevState) => prevState + 1);
    }
    if (direction == "prev" && weekno > 0) {
      setCurrentWeek(weeks[weekno - 1]);
      setWeekNo((prevState) => prevState - 1);
    }
  };

  //Show events 
  const handleSelectDate = (day) =>{
    setSelectedDate(day)
    const date = day.split("-")
    const unix = convert(date[0],date[1],date[2])
    const eventData = formattedUnix && formattedUnix.length>0 && formattedUnix.filter(el=>(el?.date/1000000)==unix)
    setEvents(eventData)
  }

  //Format dates and print
  const dates =
    currentWeek &&
    currentWeek?.week &&
    currentWeek?.week.map((day) => {
      let className = "";
      let d = day.split("-")[2];
      if (day == selectedDate) className += "selected";
      return (
        <p className={`day ${className}`} onClick={() => handleSelectDate(day)}>
          {d}
        </p>
      );
    });

  //Format month
  let month;
  if (currentWeek && currentWeek?.month && currentWeek?.month.length == 1)
    month = (
      <span>
        {months[currentWeek?.month - 1]}&nbsp;{currentWeek?.year}
      </span>
    );
  if (currentWeek && currentWeek?.month && currentWeek?.month.length > 1) {
    month = (
      <span>{`${months[currentWeek?.month[0] - 1]}/${
        months[currentWeek?.month[1] - 1]
      } ${currentWeek?.year}`}</span>
    );
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <div className="header">{month}</div>
            <div className="row align-items-end">
              <div className="col-sm-1">
                <button
                  disabled={weekno === 0}
                  onClick={() => handeClick("prev")}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              </div>
              <div className="col-sm-10">
                <div className="calendar-content">
                  <div className="weekdays">
                    {weekdays.map((day, key) => (
                      <p key={key}>{day}</p>
                    ))}
                  </div>
                  <div className="dates">{dates}</div>
                </div>
              </div>
              <div className="col-sm-1">
                <button disabled={weekno === 5}>
                  <i
                    className="fas fa-chevron-right"
                    onClick={() => handeClick("next")}
                  ></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 col-lg-6">
            <h6>Events will be listed here</h6>
            {events && events.length==0 && (<p>NO EVENTS</p>)}
            {events && events.length>0 && events[0].events.map(ev=><p>Mood : {ev.mood}</p>)}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Calendar;
