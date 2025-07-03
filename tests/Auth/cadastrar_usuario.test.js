const request = require('../../utils/api');
const { lerArquivoJson, alterarArquivoJson } = require('../../utils/json');
const { faker } = require('@faker-js/faker');

let dados;

beforeAll(() => {
  dados = lerArquivoJson('login_valido.json');
  BASE_URL = lerArquivoJson('BASE.json')
  dados.cpf = String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
  dados.email = faker.internet.email();
  alterarArquivoJson('resource/login_valido.json', dados);
});

describe('Cadastro de Usuário', () => {

  it('deve retornar erro se realizar cadastro com apenas um nome', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, full_name: 'testes' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Nome completo obrigatório');
  });

  it('deve retornar erro se o CPF não for válido menor que 11 dígitos', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, cpf: '21345622' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('CPF inválido');
  });

  it('deve retornar erro se a senha for menor que 8 dígitos', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, password: 'Soma@1', confirmPassword: 'Soma@1' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Senha fraca');
  });

  it('deve retornar erro se a senha não conter símbolos especiais', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, password: 'Somaq123', confirmPassword: 'Somaq123' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Senha fraca');
  });

  it('deve retornar erro se as senhas não conferem', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, password: 'Soma@123', confirmPassword: 'Soma@1234' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Senhas não conferem');
  });

  it('deve realizar o cadastro com sucesso', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: dados
    });

    expect(response.status).toBe(201);
    expect(response.data.message).toBe('Cadastro realizado com sucesso.');
    expect(response.data).toHaveProperty('confirmToken');
  });

  it('deve retornar erro para cadastro com mesmo CPF', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: dados
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toContain('users_cpf_key');
  });

  it('deve retornar erro se o e-mail já estiver cadastrado', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, cpf: '21121212222' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toContain('users_email_key');
  });

  it('deve retornar erro se a senha não conter números', async () => {
    const response = await request({
      method: 'post',
      url: BASE_URL.endpointCadastro,
      payload: { ...dados, password: 'Soma@qqq', confirmPassword: 'Soma@qqq' }
    });

    expect(response.status).toBe(400);
    expect(response.data.error).toBe('Senha fraca');
  });
});
