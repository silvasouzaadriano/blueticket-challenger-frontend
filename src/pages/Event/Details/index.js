import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import {
  MdEdit,
  MdDeleteForever,
  MdInsertInvitation,
  MdPlace,
} from 'react-icons/md';
import PropTypes from 'prop-types';

import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { errorMessage } from '~/utils/Message';

import api from '~/services/api';
import history from '~/services/history';

import { Container, Content, Banner, Button } from './styles';

export default function Event({ match }) {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();

  const userId = useSelector(store => store.user.profile.id);

  const id = useMemo(
    () => ({
      value: match.params.id,
    }),
    [match.params.id]
  );
  useEffect(() => {
    async function loadingEvent() {
      try {
        const { data } = await api.get(`events/${id.value}`);
        setEvent({
          ...data,
          formattedDate: format(
            parseISO(data.date),
            "d ' de ' MMMM', às' hh'h'mm",
            {
              locale: pt,
            }
          ),
        });
      } catch (e) {
        errorMessage(e);
        history.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadingEvent();
  }, [id]);

  async function handleCancel() {
    try {
      await api.delete(`events/${id.value}`);
      toast.success('Evento cancelado com sucesso');
      history.push('/dashboard');
    } catch (e) {
      errorMessage(e);
    }
  }

  return (
    <Container>
      {loading ? (
        <div className="loading">
          <Loader type="Grid" color="#f94d6a" width={164} height={164} />
        </div>
      ) : (
        <>
          <header>
            <strong>{event.title}</strong>
            {event.canceled_at && <h2 className="cancel">Cancelado</h2>}
            {event.past && <h2 className="fineshed">Encerrado</h2>}
            {!event.canceled_at && !event.past && userId === event.owner.id && (
              <div className="btn">
                <Button
                  type="button"
                  className="btn-blue"
                  onClick={() => history.push(`/event-edit/${event.id}`)}
                >
                  <MdEdit />
                  Editar
                </Button>
                {event.cancelable && (
                  <Button
                    type="button"
                    className="btn-red"
                    onClick={handleCancel}
                  >
                    <MdDeleteForever />
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </header>
          {event.banner && (
            <Banner>
              <img
                src={event.banner.url.replace('localhost', '167.172.254.115')}
                alt=""
              />
            </Banner>
          )}
          <Content>
            <div className="description">{event.description}</div>
            <div>
              <div className="others-info">
                <MdInsertInvitation />
                <span>{event.formattedDate}</span>
                <MdPlace />
                <span>{event.location}</span>
                <span>
                  Por <strong>{event.owner.name}</strong>
                </span>
              </div>
            </div>
          </Content>
        </>
      )}
    </Container>
  );
}

Event.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
