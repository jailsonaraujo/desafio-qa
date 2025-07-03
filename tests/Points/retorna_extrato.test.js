const request = require('../../utils/api');
const { lerArquivoJson } = require('../../utils/json');
const prepararToken = require('../../utils/token');
const { faker } = require('@faker-js/faker');
const { cpf: gerarCpf } = require('cpf-cnpj-validator');

let config;
let dadosBase;
let token;

beforeEach(async () => {
    config = lerArquivoJson('BASE.json');
    dadosBase = lerArquivoJson('login_valido.json');
    token = await prepararToken();
});

describe('Retorna Extrato das Transações de Pontos', () => {
    it('deve realizar o retorno do extrato da transação com sucesso', async () => {
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

        await request({
            method: 'post',
            url: config.endpointEnviarPontos,
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                recipientCpf: destinatario.cpf,
                amount: 10
            }
        });

        const response = await request({
            method: 'get',
            url: config.endpointExtrato,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);

        const transacao = response.data[0];

        expect(transacao).toHaveProperty('id');
        expect(transacao).toHaveProperty('from_user');
        expect(transacao).toHaveProperty('to_user');
        expect(transacao).toHaveProperty('amount');
        expect(transacao).toHaveProperty('created_at');
    });

    it('deve retornar erro quando passar token inválido', async () => {
        // Reaproveita o cadastro do destinatário
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

        await request({
            method: 'post',
            url: config.endpointEnviarPontos,
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                recipientCpf: destinatario.cpf,
                amount: 10
            }
        });

        const response = await request({
            method: 'get',
            url: config.endpointExtrato,
            headers: {
                Authorization: `Bearer ${config.tokenInvalido}` // já vindo do JSON
            }
        });

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Token inválido ou expirado');
    });
});
