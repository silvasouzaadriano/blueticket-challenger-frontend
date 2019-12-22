/* MODULES */
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import {
  MdAddCircleOutline,
  MdChevronLeft,
  MdChevronRight,
  MdSentimentDissatisfied,
} from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';

import { Container, NoEvents, EventCard } from './styles';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "MMMM ' de ' yyyy", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadEvents() {
      const response = await api.get('events', { params: { date } });
      const data = response.data.map(e => ({
        ...e,
        formattedDate: format(parseISO(e.date), "d ' de ' MMMM', às' hh'h'mm", {
          locale: pt,
        }),
      }));
      setEvents(data);
    }
    loadEvents();
  }, [date]);

  function handlePrevDay() {
    setDate(subMonths(date, 1));
  }

  function handleNextDay() {
    setDate(addMonths(date, 1));
  }

  return (
    <Container>
      <header>
        <strong>Eventos</strong>
        <button type="button" onClick={() => history.push('/event-new')}>
          <MdAddCircleOutline />
          Novo Evento
        </button>
      </header>

      {events.length > 0 ? (
        <ul>
          {events.map(event => (
            <EventCard
              key={String(event.id)}
              style={{
                opacity: !event.canceled_at && !event.past ? 1 : 0.5,
              }}
            >
              <Link to={`event-details/${event.id}`}>
                {!event.canceled_at ? (
                  <strong>{event.title}</strong>
                ) : (
                  <span>
                    <strike>{event.title}</strike>
                  </span>
                )}
                <time>{event.formattedDate}</time>
                <MdChevronRight size={24} color="#fff" />
              </Link>
            </EventCard>
          ))}
        </ul>
      ) : (
        <NoEvents>
          <MdSentimentDissatisfied color="#fff" size={40} />
          <span>Não há eventos para esse mês!</span>
        </NoEvents>
      )}
      <footer>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </footer>
    </Container>
  );
}
