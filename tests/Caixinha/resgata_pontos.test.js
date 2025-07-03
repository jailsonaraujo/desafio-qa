const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token');

let config;
let dadosBase;
let token; // 🔹 Armazenar o token para reuso

beforeEach(async () => {
    config = lerArquivoJson('BASE.json');
    dadosBase = lerArquivoJson('login_valido.json');
    token = await prepararToken(); // 🔹 Gera o token uma única vez antes dos testes
});

describe('Resgata pontos', () => {
    it('deve resgatar pontos na caixinha com sucesso', async () => {
        const response = await request({
            method: 'post',
            url: config.endpointResgataPontos,
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                amount: 10
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Resgate da caixinha realizado.');
    });

    it('deve retornar erro quando Saldo for insuficiente na caixinha', async () => {
        const response = await request({
            method: 'post',
            url: config.endpointResgataPontos,
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                amount: 120
            }
        });

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Saldo na caixinha insuficiente');
    });

    it('deve retornar erro ao enviar quantidade de resgate null', async () => {
        const response = await request({
            method: 'post',
            url: config.endpointResgataPontos,
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

        const response = await request({
            method: 'post',
            url: config.endpointResgataPontos,
            headers: {
                Authorization: `Bearer ${token.slice(1, 13)}`
            },
            payload: {
                amount: 10
            }
        });

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Token inválido ou expirado');
    });
});
