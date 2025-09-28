
# 🌍 Skytrack Front-end

Bem-vindo ao **Skytrack Front-end**, a interface web para monitoramento de condições climáticas e alertas meteorológicos. Este projeto, desenvolvido pela Equipe Skyfall, utiliza React, TypeScript, Tailwind CSS e Vite para oferecer uma experiência responsiva e moderna. Siga os passos abaixo para configurar e rodar o projeto localmente. 🚀

## 📋 Pré-requisitos
Antes de começar, certifique-se de ter instalado:
- **Node.js** (v18 ou superior) - [Baixe aqui](https://nodejs.org/)
- **npm** (v9 ou superior, geralmente incluído com o Node.js)
- **Git** - [Baixe aqui](https://git-scm.com/)
- Um editor de código como **VS Code** (recomendado)

## 📂 Clone o repositório
Clone o repositório do projeto Skytrack Front-end para sua máquina local:

```bash
git clone https://github.com/Equipe-Skyfall/skytrack-front.git
```

## 📍 Navegue até a pasta do projeto
Acesse a pasta do front-end via terminal:

```bash
cd skytrack-front/frontend
```

## 🔧 Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz da pasta `frontend` com as seguintes configurações. Substitua os valores de exemplo (como `user:pass` e URLs) pelos fornecidos pela sua equipe ou serviço de banco de dados:

```
# API
VITE_API_URL="http://localhost:3000"  # URL da API backend

# MongoDB (se aplicável)
MONGO_CONNECTION_STRING="mongodb+srv://user:pass@cluster.mongodb.net/..."
MONGO_DATABASE="dadosClima"
MONGO_COLLECTION="clima"

# Migração
MIGRATION_ENABLED="true"
MIGRATION_INTERVAL_MINUTES="1"    # Executa a cada 1 minuto
MIGRATION_BATCH_SIZE="100"        # Processa 100 registros por vez
MIGRATION_SYNC_NAME="main_sync"   # Nome da sincronização

# PostgreSQL/Supabase (se aplicável)
DATABASE_URL="postgresql://postgres:pass@db.supabase.co:5432/postgres"
```

> **Nota**: Certifique-se de que as URLs e credenciais correspondem ao seu ambiente. Não compartilhe informações sensíveis no controle de versão (\`.gitignore\` já inclui \`.env\`).

## 📦 Instale as dependências
Instale todas as dependências do projeto usando npm:

```bash
npm install
```

> **Dica**: Se encontrar erros, tente limpar o cache com \`npm cache clean --force\` e reinstale.

## 🚀 Rode o projeto
Inicie o servidor de desenvolvimento com Vite:

```bash
npm run dev
```

Se tudo estiver configurado corretamente, você verá uma saída semelhante a esta:

```bash
> frontend@0.0.0 dev
> vite

  VITE v7.1.5  ready in 194 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🌐 Acesse o aplicativo
Abra seu navegador e visite a URL indicada (`http://localhost:5173/`). Você terá acesso ao dashboard, alertas meteorológicos e outras funcionalidades do Skytrack. 🎉

## 🛠️ Solução de problemas
- **Erro de conexão com a API**: Verifique se `VITE_API_URL` está correto e se o backend está rodando.
- **Dependências quebradas**: Exclua `node_modules` e `package-lock.json`, depois execute `npm install` novamente.
- **Porta ocupada**: Altere a porta no arquivo `vite.config.ts` ou finalize processos usando `killall node`.
- **Ajuda adicional**: Entre em contato com a Equipe Skyfall no [repositório GitHub](https://github.com/Equipe-Skyfall/skytrack-front/issues).

## 🧩 Funcionalidades principais
- **Dashboard**: Visualize o status das estações e alertas recentes.
- **Alertas Meteorológicos**: Monitore e gerencie alertas ativos e históricos.
- **Gerenciamento de Tipos de Alerta**: Crie, edite e exclua tipos de alerta via interface.

## 📚 Tecnologias utilizadas
- **React** + **TypeScript**: Para uma interface robusta e tipada.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Vite**: Build tool rápida para desenvolvimento e produção.
- **Lucide React**: Ícones elegantes para a interface.

---

**Pronto!** Agora você está pronto para explorar o Skytrack Front-end.
