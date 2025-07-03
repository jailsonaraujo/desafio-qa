const fs = require('fs');
const path = require('path');

/**
 * Lê um arquivo JSON da pasta /resource e retorna o objeto JS.
 * @param {string} nomeArquivo - Nome do arquivo (ex: "usuario.json")
 * @returns {Object} Conteúdo do JSON convertido
 */
function lerArquivoJson(nomeArquivo) {
    const filePath = path.join(__dirname, '..', 'resource', nomeArquivo);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

/**
 * Altera o conteúdo de um arquivo JSON sobrescrevendo com novo conteúdo.
 * @param {string} caminhoArquivo - Caminho do arquivo (ex: 'resource/usuario.json')
 * @param {Object} novoConteudo - Objeto JS que será gravado no arquivo
 */
function alterarArquivoJson(caminhoArquivo, novoConteudo) {
    try {
        const caminhoAbsoluto = path.resolve(__dirname, '..', caminhoArquivo);
        const jsonFormatado = JSON.stringify(novoConteudo, null, 2); // identado
        fs.writeFileSync(caminhoAbsoluto, jsonFormatado, 'utf-8');
        console.log(`Arquivo ${caminhoArquivo} alterado com sucesso.`);
    } catch (error) {
        console.error(`Erro ao alterar arquivo ${caminhoArquivo}:`, error.message);
    }
}

module.exports = {
    lerArquivoJson,
    alterarArquivoJson
};
