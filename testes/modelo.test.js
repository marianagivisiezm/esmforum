const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando cadastro de uma resposta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da França?');
  const idResposta = modelo.cadastrar_resposta(idPergunta, 'Paris');
  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
  expect(respostas[0].id_resposta).toBe(idResposta);
});

test('Testando obtenção de pergunta e suas respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da Itália?');
  modelo.cadastrar_resposta(idPergunta, 'Roma');
  const pergunta = modelo.get_pergunta(idPergunta);
  const respostas = modelo.get_respostas(idPergunta);
  expect(pergunta.texto).toBe('Qual é a capital da Itália?');
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Roma');
});
