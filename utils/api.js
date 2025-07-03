const axios = require('axios');

/**
 * Função genérica para requisições HTTP com suporte a GET, POST, PUT e DELETE
 * @param {Object} config - Configurações da requisição
 * @param {string} config.method - Método HTTP: get, post, put, delete
 * @param {string} config.url - URL da requisição
 * @param {Object} [config.headers] - Headers (opcional)
 * @param {Object} [config.payload] - Corpo da requisição (para POST e PUT)
 * @returns {Promise<Object>} - Resposta da API ou erro tratado
 */
async function request({ method, url, headers = {}, payload = {} }) {
    try {
        let response;

        switch (method.toLowerCase()) {
            case 'get':
                response = await axios.get(url, { headers });
                break;

            case 'post':
                response = await axios.post(url, payload, { headers });
                break;

            case 'put':
                response = await axios.put(url, payload, { headers });
                break;

            case 'delete':
                response = await axios.delete(url, {
                    headers,
                    data: payload
                });
                break;

            default:
                throw new Error(`Método HTTP não suportado: ${method}`);
        }

        return response;
    } catch (error) {
        // Se for erro de resposta da API (ex: 4xx ou 5xx)
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

module.exports = request;