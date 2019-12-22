/* MODULES */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import {
  MdAddCircleOutline,
  MdChevronRight,
  MdSentimentDissatisfied,
} from 'react-icons/md';

import Loader from 'react-loader-spinner';

import api from '~/services/api';
import history from '~/services/history';

import { Container, NoEvents, EventCard } from './styles';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const response = await api.get('events', {
        params: { where: 'just-my-events' },
      });
      const data = response.data.map(m => ({
        ...m,
        formattedDate: format(parseISO(m.date), "d ' de ' MMMM', às' hh'h'mm", {
          locale: pt,
        }),
      }));
      setLoading(false);
      setEvents(data);
    }
    loadEvents();
  }, []);

  return (
    <Container>
      {loading ? (
        <div className="loading">
          <Loader type="Grid" color="#f94d6a" width={164} height={164} />
        </div>
      ) : (
        <>
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
                        <strong>Cancelado</strong>
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
        </>
      )}
    </Container>
  );
}
