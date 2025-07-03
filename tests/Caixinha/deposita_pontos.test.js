const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token');

let config;
let dadosBase;
let token;

beforeEach(async () => {
  config = lerArquivoJson('BASE.json');
  dadosBase = lerArquivoJson('login_valido.json');
  token = await prepararToken();
});

describe('Deposita pontos', () => {
  it('deve realizar o deposito pontos na caixinha com sucesso', async () => {
    const response = await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        amount: 10
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Depósito na caixinha realizado.');
  });

  it('deve retornar erro quando Saldo for insuficiente', async () => {
    const response = await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        amount: 120
      }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Saldo insuficiente');
  });

  it('deve retornar erro quando enviar amount abaixo de zero', async () => {
    const response = await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        amount: -5
      }
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar erro quando enviar amount null ou vazio', async () => {
    const response = await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        amount: null
      }
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar erro quando Token for inválido ou expirado', async () => {
    const tokenInvalido = token.slice(1, 15);

    const response = await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${tokenInvalido}`
      },
      payload: {
        amount: 120
      }
    });

    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Token inválido ou expirado');
  });
});
