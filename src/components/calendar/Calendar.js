import { Fragment, useState, useEffect } from "react";
import { weekdays, months } from "./constants";
const Calendar = () => {
  //State for selected Date
  const [selectedDate, setSelectedDate] = useState(null);
  //State for current iterating week(0-5)
  const [weekno, setWeekNo] = useState(0);
  //State for storing all weeks
  const [weeks, setWeeks] = useState([]);
  //State for storing current week values
  const [currentWeek, setCurrentWeek] = useState({});

  //Function to get dates for next 6 weeks and format and push them to weeks array
  const getDates = () => {
    let curr = new Date();
    let week = [];
    let res = [];
    let months = [];
    let year = "";
    for (let j = 1; j <= 6; j++) {
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
    setCurrentWeek(res[0]);
    setWeeks(res);
  };

  useEffect(() => {
    getDates();
  }, []);

  //Change the current week.
  const handeClick = (direction) => {
    setSelectedDate(null);
    if (direction == "next" && weekno < 5) {
      setCurrentWeek(weeks[weekno + 1]);
      setWeekNo((prevState) => prevState + 1);
    }
    if (direction == "prev" && weekno > 0) {
      setCurrentWeek(weeks[weekno - 1]);
      setWeekNo((prevState) => prevState - 1);
    }
  };

  //Format dates and print
  const dates =
    currentWeek &&
    currentWeek?.week &&
    currentWeek?.week.map((day) => {
      let className = "";
      let d = day.split("-")[2];
      if (d == selectedDate) className += "selected";
      return (
        <p className={`day ${className}`} onClick={() => setSelectedDate(d)}>
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
        </div>
      </div>
    </Fragment>
  );
};

export default Calendar;
