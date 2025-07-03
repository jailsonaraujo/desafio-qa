const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token');

describe('Enviar pontos', () => {
  let config;
  let dadosBase;
  let tokenRemetente;

  beforeAll(async () => {
    config = lerArquivoJson('BASE.json');
    dadosBase = lerArquivoJson('login_valido.json');
    tokenRemetente = await prepararToken(); // 🔹 Token obtido uma vez
  });

  it('deve retornar extrato da caixinha com sucesso', async () => {
    await request({
      method: 'post',
      url: config.endpointDepositaPontos,
      headers: {
        Authorization: `Bearer ${tokenRemetente}`
      },
      payload: {
        amount: 10
      }
    });

    const response = await request({
      method: 'get',
      url: config.endpointExtratoCaixinha,
      headers: {
        Authorization: `Bearer ${tokenRemetente}`
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.id).not.toEqual('');
    expect(response.data.user_id).not.toEqual('');
    expect(response.data.type).not.toEqual('');
    expect(response.data.amount).not.toEqual('');
    expect(response.data.created_at).not.toEqual('');
  });

  it('deve retornar erro quando Token for inválido ou expirado', async () => {
    const tokenInvalido = tokenRemetente.slice(1, 15);

    const response = await request({
      method: 'get',
      url: config.endpointExtratoCaixinha,
      headers: {
        Authorization: `Bearer ${tokenInvalido}`
      }
    });

    expect(response.status).toBe(401);
    expect(response.data.error).toBe('Token inválido ou expirado');
  });
});
