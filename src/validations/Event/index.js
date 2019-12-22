import * as Yup from 'yup';

const title = Yup.string().max(
  55,
  'O Nome do evento não pode exceder 55 caracters.'
);
const description = Yup.string().max(
  255,
  'A descrição tem que ter no máximo 255 caracteres.'
);
const location = Yup.string().max(
  150,
  'A localização não pode excer 150 caracteres!'
);
const date = Yup.date('Data inválida!');

const schema = Yup.object().shape({
  banner_id: Yup.number()
    .transform(value => (!value ? undefined : value))
    .required('Banner é Obrigatório'),
  title: title.required('O nome do evento não pode ser em branco!'),
  description: description.required('Descrição não pode ser em branco!'),
  date: date.required('A data não pode ser em branco.'),
  location: location.required('A localização não pode ser em branco!'),
});

export default schema;
