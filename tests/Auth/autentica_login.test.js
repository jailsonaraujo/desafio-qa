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

describe('Autenticar usuário', () => {
  async function prepararUsuario() {
    const registro = await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: dados
    });

    await request({
      method: 'get',
      url: config.endpointConfirmacaoBase + registro.data.confirmToken
    });
  }

  it('deve realizar login com sucesso', async () => {
    await prepararUsuario();

    const response = await request({
      method: 'post',
      url: config.endpointLogin,
      payload: {
        email: dados.email,
        password: dados.password
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
  });

  it('deve retornar erro ao logar com email inválido', async () => {
    await prepararUsuario();

    const response = await request({
      method: 'post',
      url: config.endpointLogin,
      payload: {
        email: dados.full_name,
        password: dados.password
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Credenciais inválidas');
  });

  it('deve retornar erro ao logar com senha inválida', async () => {
    await prepararUsuario();

    const response = await request({
      method: 'post',
      url: config.endpointLogin,
      payload: {
        email: dados.email,
        password: dados.full_name
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Credenciais inválidas');
  });

  it('deve retornar erro ao logar com campos vazios ou null', async () => {
    await prepararUsuario();

    const response = await request({
      method: 'post',
      url: config.endpointLogin,
      payload: {
        email: null,
        password: null
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Credenciais inválidas');
  });
});
