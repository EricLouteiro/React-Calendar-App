import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";

import DateTimePicker from "react-datetime-picker";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { eventAddNew, eventClearActiveEvent, eventUpdated } from "../../actions/event";
import { uiCloseModal } from "../../actions/ui";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};



Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, "hours");
const now2 = now.clone().add(1, "hours");

const initState = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: now2.toDate()
}

export const CalendarModal = () => {
  const { modalOpen } = useSelector(state => state.ui);
  const { activeEvent } = useSelector(state => state.calendar);
  const dispatch = useDispatch();
  
  const [dateStart, setDateStart] = useState(now.toDate());
  const [dateEnd, setDateEnd] = useState(now2.toDate());
  const [titleValid, setTitleValid] = useState(true);

  const [formValues, setFormValues] = useState( initState ); 

  const { title, notes, start, end } = formValues;

  useEffect(() => {
    if (activeEvent) {
      setFormValues( activeEvent )
    }
    else{
      setFormValues( initState )
    }
  }, [ activeEvent, setFormValues ])

  const closeModal = (e) => {
    dispatch( uiCloseModal() );
    dispatch( eventClearActiveEvent() );
    setFormValues( initState );
  };

  const handleInputChange = ({ target }) => {

    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e
    })
  };
  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e
    })
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const momentStart = moment( start );
    const momentEnd = moment( end );

    if (momentStart.isSameOrAfter( momentEnd )) {
     return Swal.fire('Error', 'La fecha debe de ser mauor a la fecha de inicio', 'error' )
    }

    if ( title.trim().length < 2 ) {
      return setTitleValid(false)
    }

    if (activeEvent) {
      dispatch( eventUpdated( formValues ))
    }
    else{
      dispatch( eventAddNew({
        ...formValues,
        id: new Date().getTime(),
        user: {
          _id: '123',
          name: 'Eric'
        }
      }))
    }

    setTitleValid(true)
    closeModal();
  }

  return (
    <Modal
      isOpen={modalOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      closeTimeoutMS={200}
      style={customStyles}
      contentLabel="Example Modal"
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={ handleSubmitForm }>
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={dateStart}
            className="form-control"
          />
        </div>
        <h1>{  }</h1>
        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={dateEnd}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${ titleValid && 'is-invalid' }`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={ title }
            onChange={ handleInputChange }
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={ notes }
            onChange={ handleInputChange }
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
