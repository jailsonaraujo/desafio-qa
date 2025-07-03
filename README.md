# 🧪 Testes End-to-End Automatizados com Jest – Desafio QA

Este repositório contém os testes automatizados end-to-end da jornada do usuário, desenvolvidos com **Jest** como parte do desafio para vaga de QA. Os testes foram planejados para cobrir os principais fluxos da aplicação e registrar evidências de comportamento esperado e comportamentos inesperados (bugs).

---

## ▶️ Como rodar os testes

### ✅ Pré-requisitos

- Node.js instalado
- Git

### 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone 
cd seu-repositorio
npm install

### 🚀 Executar todos os testes

npm test

### 🧪 Executar um teste específico

npx jest testes/retorna_saldo.test.js


### ✅ Respostas do Item 2

**a) Há bugs? Quais são e quais os cenários esperados?**

1. **Cadastro de usuário com senha fraca (sem número)**  
   **Esperado:** A senha seja rejeitada com mensagem clara de validação.  
   **Ocorre:** A senha é aceita, permitindo cadastro.

2. **Validação de CPF inválido no cadastro de usuário**  
   **Esperado:** Cadastro deve rejeitar CPFs inválidos.  
   **Ocorre:** Está aceitando CPFs inválidos.

3. **Mensagem de erro divergente na API de envio de pontos**  
   **Esperado (conforme Swagger):** "Valor inválido" para saldo insuficiente.  
   **Ocorre:** Retorna "Saldo insuficiente".

4. **Resgate de pontos com valores `null`**  
   **Esperado:** Validação de campos obrigatórios e erro apropriado.  
   **Ocorre:** Resgate é feito com valores `null`.

5. **Depósito de pontos com valor negativo**  
   **Esperado:** Rejeição com mensagem clara e 400 Bad Request.  
   **Ocorre:** Retorna sucesso e deposita pontos negativos.

6. **Depósito de pontos com valor `null` ou vazio**  
   **Esperado:** Rejeição com erro de campo obrigatório.  
   **Ocorre:** Retorna sucesso.


