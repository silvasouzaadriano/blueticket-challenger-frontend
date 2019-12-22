import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

import { Form, Input } from '@rocketseat/unform';
import { MdAddCircleOutline } from 'react-icons/md';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import schema from '~/validations/Event';
import { errorMessage } from '~/utils/Message';
import Banner from '~/components/Banner';
import SelectDate from '~/components/DatePicker';

import api from '~/services/api';
import history from '~/services/history';

import { Container } from '~/styles/FormEvent';

export default function NewEvent({ match }) {
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(true);
  const [eventId, setEventId] = useState(match.params.id);

  async function handleSubmit(data) {
    try {
      const response = await api.put(`events/${eventId}`, data);
      setEventId(response.data.id);
      history.push(`/event-details/${eventId}`);
      toast.success('Evento alterado com sucesso');
    } catch (e) {
      errorMessage(e);
    }
  }
  useEffect(() => {
    async function loadingEvent() {
      try {
        const { data } = await api.get(`events/${eventId}`);
        setEvent({
          ...data,
          date: parseISO(data.date),
        });
      } catch (e) {
        errorMessage(e);
      } finally {
        setLoading(false);
      }
    }
    loadingEvent();
  }, [eventId]);
  return (
    <Container>
      {loading ? (
        <div className="loading">
          <Loader type="Grid" color="#f94d6a" width={164} height={164} />
        </div>
      ) : (
        <Form initialData={event} schema={schema} onSubmit={handleSubmit}>
          <Banner name="banner_id" />
          <Input name="title" placeholder="Nome do Evento" />
          <Input
            multiline
            name="description"
            placeholder="Descrição completa"
          />
          <SelectDate
            selected={date}
            setSelected={setDate}
            name="date"
            placeholder="Data do Evento"
          />
          <Input name="location" placeholder="Localização" />

          <button type="submit">
            <MdAddCircleOutline size={20} color="#fff" />
            Alterar Evento!
          </button>
          <Link to={`/event-details/${eventId}`}>Voltar</Link>
        </Form>
      )}
    </Container>
  );
}

NewEvent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
