# CelsiusFahrenheit

Mini projeto de conversão de temperaturas entre Celsius e Fahrenheit, construído com Node.js/Express no backend e Vue 3 + Vite no frontend.

## Estrutura do Projeto

```
CelsiusFahrenheit/
├── .github/workflows/ci.yml      # Pipeline CI (build + test)
├── .gitignore
├── .eslintrc.json
├── eslint.config.mjs
├── Dockerfile                    # Build multi-stage (Vite + servidor)
├── jest.config.js                # Configuração de testes e cobertura (API)
├── vite.config.mjs               # Vite + Vitest (frontend)
├── package.json                  # Scripts e dependências
├── client/                       # Frontend Vue 3
│   ├── index.html
│   └── src/
│       ├── App.vue               # Estado, conversão automática e troca de cenário
│       ├── components/
│       │   ├── ConverterCard.vue # Formulário e resultado
│       │   └── scenes/           # HotScene, ColdScene, MildScene (CSS/SVG animados)
│       ├── services/api.js       # Chamada GET /api/convert
│       └── utils/climate.js      # Faixas de clima e formatação
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
npm run build
npm start
```

A API e o frontend compilado ficam em **http://localhost:3000**.

### Desenvolvimento do frontend (hot reload)

Em dois terminais:

```bash
npm start
```

```bash
npm run dev
```

Abra **http://localhost:5173**. O Vite repassa `/api` para o Express na porta 3000.

### Testes

```bash
npm test          # API (Jest) — compila o frontend antes, pois o servidor serve dist/
npm run test:web  # Frontend (Vitest + Vue Test Utils)
npm run test:all  # Os dois
```

Os dois exibem relatório de cobertura e passa/falha de cada caso.

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

Abra `http://localhost:3000` no navegador. Digite um valor e escolha a direção da conversão. O resultado aparece automaticamente ao parar de digitar, ou ao clicar em **Converter**.

O fundo muda conforme a temperatura, sempre avaliada em °C:

| Faixa | Cenário |
|-------|---------|
| abaixo de 16 °C | ❄️ Frio: azul e branco, pingentes de gelo, neve e montanhas |
| de 16 °C a 28 °C | 🌊 Dia tranquilo: céu, sol, nuvens, mar com ondas e barquinho |
| acima de 28 °C | 🔥 Calor: amarelo e laranja, fogo e brasas subindo |

Quanto mais extrema a temperatura, mais intenso fica o efeito (mais neve e pingentes maiores, ou chamas mais altas e mais brasas).

## Pipeline CI

O GitHub Actions roda em `push` e `pull request`:

1. **Build** — instala dependências, roda lint (backend + Vue), builda o frontend e o Docker
2. **Test** — roda testes da API e do frontend com cobertura, revisão IA e validação do Terraform

## Commit e Push

```bash
git add .
git commit -m "Sua mensagem aqui"
git push origin main
```

O pipeline é acionado automaticamente após o push.

## Autores

- Rafael Wolkning
- Lucas Aita
