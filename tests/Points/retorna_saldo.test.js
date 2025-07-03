const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token');

let config;
let token;

beforeEach(async () => {
  config = lerArquivoJson('BASE.json');
  token = await prepararToken();
});

describe('Retorna Saldo', () => {
  it('deve retornar saldo com sucesso', async () => {
    const response = await request({
      method: 'get',
      url: config.endpointSaldo,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.status).toBe(200);
    expect(response.data.normal_balance).toBe(100);
    expect(response.data.piggy_bank_balance).toBe(0);
  });

  it('deve retornar erro com token ausente', async () => {
    const response = await request({
      method: 'get',
      url: config.endpointSaldo
    });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Não autorizado');
  });

  it('deve retornar erro com token inválido', async () => {
    const response = await request({
      method: 'get',
      url: config.endpointSaldo,
      headers: {
        Authorization: `Bearer ${config.tokenInvalido}`
      }
    });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Token inválido ou expirado');
  });
});
