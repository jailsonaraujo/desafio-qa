const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token')
const { faker } = require('@faker-js/faker');
const { cpf: gerarCpf } = require('cpf-cnpj-validator');

let config;
let dadosBase;

beforeAll(() => {
  config = lerArquivoJson('BASE.json');
  dadosBase = lerArquivoJson('login_valido.json');
});

describe('Enviar pontos', () => {


  it('deve realizar o envio de pontos para outro usuário com sucesso', async () => {
    const token = await prepararToken();

    // Usuário destinatário
    const destinatario = {
      ...dadosBase,
      cpf: gerarCpf.generate(),
      email: faker.internet.email()
    };

    await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: destinatario
    });

    // Enviar pontos
    const response = await request({
      method: 'post',
      url: config.endpointEnviarPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        recipientCpf: destinatario.cpf,
        amount: 20
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Pontos enviados com sucesso.');
  });

  it('deve retornar erro para Token inválido ou expirado', async () => {
    const token = await prepararToken();

    // Usuário destinatário
    const destinatario = {
      ...dadosBase,
      cpf: gerarCpf.generate(),
      email: faker.internet.email()
    };

    await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: destinatario
    });

    // Enviar pontos
    const response = await request({
      method: 'post',
      url: config.endpointEnviarPontos,
      headers: {
        Authorization: `Bearer ${token.slice(1, 16)}`
      },
      payload: {
        recipientCpf: destinatario.cpf,
        amount: 20
      }
    });

    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Token inválido ou expirado');
  });

  it('deve retornar erro para saldo insuficiente', async () => {
    const token = await prepararToken();

    // Usuário destinatário
    const destinatario = {
      ...dadosBase,
      cpf: gerarCpf.generate(),
      email: faker.internet.email()
    };

    await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: destinatario
    });

    // Enviar pontos
    const response = await request({
      method: 'post',
      url: config.endpointEnviarPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        recipientCpf: destinatario.cpf,
        amount: 120
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Valor inválido');
  });

  it('deve retornar erro quando usuario recebedor é invalido', async () => {
    const token = await prepararToken();

    // Usuário destinatário
    const destinatario = {
      ...dadosBase,
      cpf: gerarCpf.generate(),
      email: faker.internet.email()
    };

    await request({
      method: 'post',
      url: config.endpointCadastro,
      payload: destinatario
    });

    // Enviar pontos
    const response = await request({
      method: 'post',
      url: config.endpointEnviarPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        recipientCpf: '00000000001',
        amount: 10
      }
    });

    expect(response.status).toBe(404);
    expect(response.data.error).toBe('Usuário destino não encontrado');
  });
});
