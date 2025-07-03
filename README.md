# Testes End-to-End Automatizados com Jest – Desafio QA

Este repositório contém testes automatizados da jornada do usuário utilizando **Jest**, desenvolvidos como parte de um desafio técnico para a vaga de QA. Os testes cobrem os principais fluxos da aplicação e registram evidências de comportamentos esperados e falhas encontradas (bugs).

---

## ▶️ Como rodar os testes

### ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Git](https://git-scm.com/) instalado

### 📦 Instalação

Clone este repositório e instale as dependências do projeto:

```bash
git clone 
cd desafio-qa-jest
npm install
```

### 🚀 Executar todos os testes

```bash
npm test
```

### 🥪 Executar um teste específico

```bash
npx jest testes/retorna_saldo.test.js
```

---

## ✅ Respostas do Item 2

### a) Há bugs? Quais são e quais os cenários esperados?

1. **Cadastro de usuário com senha fraca (sem número)**\
   **Esperado:** A senha deve ser rejeitada com uma mensagem de validação clara.\
   **Ocorre:** A senha é aceita e o cadastro é concluído.

2. **Validação de CPF inválido no cadastro de usuário**\
   **Esperado:** O sistema deve rejeitar CPFs inválidos.\
   **Ocorre:** O sistema aceita CPFs inválidos normalmente.

3. **Mensagem de erro divergente na API de envio de pontos**\
   **Esperado (conforme Swagger):** Retornar "Valor inválido" em caso de saldo insuficiente.\
   **Ocorre:** A API retorna "Saldo insuficiente".

4. **Resgate de pontos com valores **``\
   **Esperado:** A API deve validar o campo como obrigatório e retornar erro.\
   **Ocorre:** A API aceita o valor `null` e realiza o resgate.

5. **Depósito de pontos com valor negativo**\
   **Esperado:** A API deve rejeitar o valor e retornar um erro 400.\
   **Ocorre:** O depósito é aceito com sucesso, mesmo com valor negativo.

6. **Depósito de pontos com valor **``** ou vazio**\
   **Esperado:** A API deve validar o campo e rejeitar a requisição.\
   **Ocorre:** A API aceita o valor e retorna status de sucesso.

---

### b) Classificação dos bugs por criticidade

| Bug                                                       | Criticidade |
| --------------------------------------------------------- | ----------- |
| Cadastro com senha fraca (sem número)                     | Alta        |
| CPF inválido aceito no cadastro de usuário                | Média       |
| Divergência na mensagem de erro da API de envio de pontos | Baixa       |
| Resgate de pontos com valor `null` permitido              | Alta        |
| Depósito de pontos com valor negativo                     | Alta        |
| Depósito com valor `null` ou vazio                        | Média       |

---

### c) O sistema está pronto para produção?

**❌ Não.**

O sistema apresenta falhas críticas em validações essenciais (como senha, CPF, valores nulos ou negativos), além de divergências entre a documentação e os retornos reais da API.

Esses problemas comprometem:

- A **segurança dos dados**
- A **integridade das regras de negócio**
- A **confiabilidade da aplicação em ambiente real**

🔧 **Recomendação:** Corrigir todas as inconsistências antes do deploy para produção.
