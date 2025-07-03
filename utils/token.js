const request = require('./api');
const { lerArquivoJson, alterarArquivoJson } = require('./json');

const { faker } = require('@faker-js/faker');

let config = lerArquivoJson('BASE.json');
let dados = lerArquivoJson('login_valido.json');

dados.cpf = String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
dados.email = faker.internet.email();
alterarArquivoJson('resource/login_valido.json', dados);

async function prepararToken() {
    const registro = await request({
        method: 'post',
        url: config.endpointCadastro,
        payload: dados
    });

    await request({
        method: 'get',
        url: config.endpointConfirmacaoBase + registro.data.confirmToken
    });

    const login = await request({
        method: 'post',
        url: config.endpointLogin,
        payload: {
            email: dados.email,
            password: dados.password
        }
    });

    return login.data.token;
}

module.exports = prepararToken