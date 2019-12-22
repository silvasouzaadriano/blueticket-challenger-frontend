/* MODULES */
import React, { useState } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdAddCircleOutline } from 'react-icons/md';
import { errorMessage } from '~/utils/Message';
import schema from '~/validations/Event';

import api from '~/services/api';
import history from '~/services/history';

import { Container } from '~/styles/FormEvent';
import Banner from '~/components/Banner';
import SelectDate from '~/components/DatePicker';

export default function NewEvent() {
  const [date, setDate] = useState();

  async function handleSubmit(data) {
    try {
      const response = await api.post('events', data);
      if (response.status !== 201)
        toast.error(
          `Occorreu um erro, tente novamente, [${response.body.error}]`
        );
      history.push('/');
      toast.success('Evento criado com sucesso');
    } catch (e) {
      errorMessage(e);
    }
  }
  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <Banner name="banner_id" />
        <Input name="title" placeholder="Nome do Evento" />
        <Input multiline name="description" placeholder="Descrição completa" />
        <SelectDate
          selected={date}
          setSelected={setDate}
          name="date"
          placeholder="Data do Evento"
        />

        <Input name="location" placeholder="Localização" />

        <button type="submit">
          <MdAddCircleOutline size={20} color="#fff" />
          Criar Evento!
        </button>
        <Link to="/">Voltar</Link>
      </Form>
    </Container>
  );
}
