import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { messages } from "../../helpers/calendar-messages-es";

import { Navbar } from "../ui/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarModal } from "./CalendarModal";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import { eventSetActive } from "../../actions/event";
import { AddNewFab } from "../ui/AddNewFab";
import { DeleteEventFab } from "../ui/DeleteEventFab";

moment.locale("es");

const localizer = momentLocalizer(moment);

// const events = [{
//   title: 'Cumpleaños del jefe',
//   start: moment().toDate(),
//   end: moment().add( 2, 'hours').toDate(),
//   bgColor: '#fafafa',
//   notes: 'Comprar Pan',
//   user: {
//     _id: '123',
//     name: 'EricLouteiro'
//   }
// }]

export const CalendarScreen = () => {
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();

  const onDoubleClick = (e) => {
    console.log("modal abierto");
    dispatch(uiOpenModal());
  };
  const onSelectEvent = (e) => {
    // console.log(e)
    dispatch(eventSetActive(e));
  };

  const OnViewChange = (e) => {
    setLastView(e);
    localStorage.setItem("lastView", e);
  };

  const eventStyleGetter = () => {
    const style = {
      backgroundColor: "#367cf7",
      borderRadius: "0px",
      opacity: 0.8,
      display: "block",
      color: "white",
    };

    return {
      style,
    };
  };

  return (
    <div className="calendar-screen">
      <Navbar />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelectEvent}
        onView={OnViewChange}
        view={lastView}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
      />
      <CalendarModal />

      <AddNewFab />

      { (activeEvent) && <DeleteEventFab />}

    </div>
  );
};
