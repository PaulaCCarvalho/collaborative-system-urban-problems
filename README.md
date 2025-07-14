# Sistema Colaborativo para Problemas Urbanos

Este projeto é um sistema colaborativo para registro, visualização e análise de problemas urbanos em Belo Horizonte. Os dados de referência foram retirados do site BHMap.

## Tecnologias Utilizadas

### Backend (Node.js)
- **Express**: Framework para criação de APIs REST.
- **PostgreSQL**: Banco de dados relacional.
- **Joi**: Validação de dados.
- **JWT**: Autenticação via tokens.
- **Bcrypt**: Hash de senhas.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **Nodemon**: Hot reload em desenvolvimento.
- **ESLint/Prettier**: Padrões de código.

**Padrões de Projeto**:
- MVC (Model-View-Controller)
- Repository Pattern
- Service Layer
- Middlewares para autenticação e tratamento de erros

### Frontend (React)
- **React**: Biblioteca para construção de interfaces.
- **Vite**: Bundler e servidor de desenvolvimento.
- **React Router**: Gerenciamento de rotas.
- **React Query**: Gerenciamento de dados assíncronos.
- **React Hook Form**: Manipulação de formulários.
- **Leaflet/React-Leaflet**: Mapas interativos.
- **TailwindCSS**: Estilização.
- **Axios**: Requisições HTTP.
- **Context API**: Gerenciamento de estado global.

**Padrões de Projeto**:
- Context API para estados globais (auth, notificações, regiões, etc)
- Componentização reutilizável
- Hooks customizados

## Setup e Configuração

### Pré-requisitos
- Node.js (v18+ recomendado)
- PostgreSQL

### Backend

1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Configure o arquivo `.env` com as variáveis do banco de dados e JWT.
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ``` 