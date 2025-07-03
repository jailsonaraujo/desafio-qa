
const request = require('../../utils/api');
const { lerArquivoJson, alterarArquivoJson } = require('../../utils/json');
const { faker } = require('@faker-js/faker');

let dados;
let config;

beforeEach(() => {
  dados = lerArquivoJson('login_valido.json'); 
  config = lerArquivoJson('BASE.json');

  dados.cpf = String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
  dados.email = faker.internet.email();
  alterarArquivoJson('resource/login_valido.json', dados);
});

describe('Confirmação de E-mail', () => {
  it('deve confirmar o e-mail com token válido', async () => {
    const registro = await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: dados
    });

    const confirmacao = await request({
      method: 'get',
      url: config.endpointConfirmacaoBase + registro.data.confirmToken
    });

    expect(confirmacao.status).toBe(200);
    expect(confirmacao.data).toBe('E-mail confirmado com sucesso.');
  });

  it('deve retornar erro para token inválido', async () => {
    const resposta = await request({
      method: 'get',
      url: config.endpointConfirmacaoBase + config.tokenInvalido
    });

    expect(resposta.status).toBe(400);
    expect(resposta.data).toBe('Token inválido ou expirado.');
  });

  it('deve retornar erro para token ausente', async () => {
    const resposta = await request({
      method: 'get',
      url: config.endpointConfirmacaoBase + config.tokenEmBranco
    });

    expect(resposta.status).toBe(400);
    expect(resposta.data).toBe('Token inválido ou expirado.');
  });
});
