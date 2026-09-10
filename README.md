# CelsiusFahrenheit

Mini projeto de conversão de temperaturas entre Celsius e Fahrenheit, construído com Node.js/Express.

## Estrutura do Projeto

```
CelsiusFahrenheit/
├── .github/workflows/ci.yml      # Pipeline CI (build + test)
├── .gitignore
├── .eslintrc.json
├── eslint.config.mjs
├── Dockerfile                    # Container para deploy local
├── jest.config.js                # Configuração de testes e cobertura
├── package.json                  # Scripts e dependências
├── public/
│   └── index.html                # Frontend estático
├── scripts/
│   └── ai-review.js              # IA para revisar testes e sugerir novos casos
├── src/
│   ├── convert.js                # Lógica de conversão
│   ├── health.js                 # Health check
│   └── server.js                 # Servidor Express
├── terraform/
│   └── main.tf                   # IaC com Docker provider
└── __tests__/
    └── convert.test.js           # Testes Jest (14 casos)
```

## Pré-requisitos

- Node.js 22 ou superior
- Docker (opcional, para Terraform)

## Instalação

```bash
git clone https://github.com/RafaelWolkning/CelsiusFahrenheit.git
cd CelsiusFahrenheit
npm install
```

## Como rodar

### Servidor local

```bash
npm start
```

A API e o frontend ficam em **http://localhost:3000**.

### Testes

```bash
npm test
```

Exibe relatório de cobertura e passa/falha de cada caso. Atualmente 14 testes passando.

### Lint

```bash
npm run lint
```

### Revisão IA dos testes

```bash
npm run ai-review
```

O script analisa `__tests__/convert.test.js` e sugere novos casos de teste. Se `OPENAI_API_KEY` estiver definido no `.env`, usa a IA; caso contrário, usa sugestões baseadas em regras.

### Terraform (Docker local)

```bash
cd terraform
terraform init -backend=false
terraform plan
terraform apply
```

Cria e roda o container com a aplicação na porta 3000.

## API

### `POST /api/convert`

Converte uma temperatura.

```json
{
  "value": 100,
  "unit": "cf"
}
```

- `unit: "cf"` → Celsius para Fahrenheit
- `unit: "fc"` → Fahrenheit para Celsius

**Resposta:**
```json
{
  "value": 100,
  "unit": "cf",
  "result": 212
}
```

### `GET /health`

Verifica se o servidor está online.

## Frontend

Abra `http://localhost:3000` no navegador. Digite um valor, escolha a direção da conversão e clique em **Converter**.

## Pipeline CI

O GitHub Actions roda em `push` e `pull request`:

1. **Build** — instala dependências, roda lint, builda o Docker
2. **Test** — roda testes com cobertura, revisão IA e validação do Terraform

## Commit e Push

```bash
git add .
git commit -m "Sua mensagem aqui"
git push origin main
```

O pipeline é acionado automaticamente após o push.

## Autores

- Rafael Wolkning