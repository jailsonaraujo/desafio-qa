const request = require('../../utils/api');
const { lerArquivoJson, alterarArquivoJson } = require('../../utils/json');
const { faker } = require('@faker-js/faker');

let dados;
let config;

beforeEach(() => {
  config = lerArquivoJson('BASE.json');
  dados = lerArquivoJson('login_valido.json');

  dados.cpf = String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
  dados.email = faker.internet.email();
  alterarArquivoJson('resource/login_valido.json', dados);
});

describe('Excluir Conta', () => {
  it('deve excluir a conta com sucesso', async () => {
    const res = await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: dados
    });

    const response = await request({
      method: 'delete',
      url: config.endpointExcluirConta,

      headers: {
        Authorization: `Bearer ${res.data.confirmToken}`,
        Accept: 'application/json'
      },
      payload: {
        password: dados.password
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Conta marcada como deletada.');
  });

  it('deve retornar erro 401 se o token não for fornecido', async () => {
    const res = await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: dados
    });

    const response = await request({
      method: 'delete',
      url: config.endpointExcluirConta,
      payload: {
        password: dados.password
      }
    });

    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Não autorizado');
  });

  it('deve retornar erro 400 se a senha estiver incorreta', async () => {
    const res = await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: dados
    });

    const response = await request({
      method: 'delete',
      url: config.endpointExcluirConta,
      headers: {
        Authorization: `Bearer ${res.data.confirmToken}`
      },
      payload: {
        password: 'senhaErrada'
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Senha inválida');
  });
});
