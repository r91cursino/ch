# ProtestoPro Monorepo

Este repositório contém a landing page (frontend React) e o backend (SaaS Flask) do ProtestoPro, organizados em uma estrutura de monorepo para facilitar o deploy e a gestão.

## Estrutura do Repositório

- `/landing`: Contém o código-fonte da landing page, desenvolvida em React.
- `/app`: Contém o código-fonte do backend (SaaS), desenvolvido em Flask.

## Deploy na Vercel

Este monorepo está configurado para ser facilmente deployado na Vercel. O arquivo `vercel.json` na raiz do projeto define as configurações de build e deploy para ambos os projetos.

### Pré-requisitos

- Conta na Vercel (vercel.com)
- Vercel CLI instalado (npm install -g vercel)

### Passos para o Deploy

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/r91cursino/ch.git
   cd ch
   ```

2. **Instale as Dependências (apenas para desenvolvimento local):**
   - **Landing Page (React):**
     ```bash
     cd landing
     npm install
     cd ..
     ```
   - **Backend (Flask):**
     ```bash
     cd app
     pip install -r requirements.txt
     cd ..
     ```

3. **Conecte-se à Vercel (se ainda não o fez):**
   ```bash
   vercel login
   ```

4. **Faça o Deploy:**
   Navegue até o diretório raiz do monorepo (`/home/ubuntu/ch`) e execute o comando de deploy da Vercel:
   ```bash
   vercel
   ```
   A Vercel detectará o arquivo `vercel.json` e configurará o deploy para ambos os projetos (`landing` e `app`) automaticamente.

5. **Acesse as Aplicações:**
   Após o deploy, a Vercel fornecerá URLs separadas para a landing page e para o backend (SaaS). Você poderá configurá-las conforme suas necessidades no dashboard da Vercel.

### Configurações Adicionais e Observações para Produção

- **Versão do Python:** O `vercel.json` está configurado para usar Python 3.11.
- **Servidor WSGI:** Para um deploy de produção real do backend Flask, é altamente recomendado usar um servidor WSGI como Gunicorn ou uWSGI. O `buildCommand` no `vercel.json` para o backend (`python3 -m flask run`) é adequado para desenvolvimento, mas para produção, você precisaria de uma configuração como `gunicorn --bind 0.0.0.0:$PORT main:app` e um `Procfile` ou similar.
- **Banco de Dados:** O banco de dados SQLite (`app.db`) é adequado para desenvolvimento. Para produção, considere usar um banco de dados mais robusto e escalável (PostgreSQL, MySQL) e configurar as variáveis de ambiente correspondentes na Vercel.
- **Variáveis de Ambiente:** Configure quaisquer variáveis de ambiente sensíveis (chaves secretas, credenciais de banco de dados) diretamente no dashboard da Vercel, em vez de incluí-las no código-fonte.

```json
// vercel.json
{
  "build": {
    "env": {
      "PYTHON_VERSION": "3.11"
    }
  },
  "projects": [
    {
      "name": "protestopro-landing",
      "root": "./landing",
      "buildCommand": "npm run build",
      "outputDirectory": "./dist",
      "devCommand": "npm run dev -- --host"
    },
    {
      "name": "protestopro-saas",
      "root": "./app",
      "buildCommand": "pip install -r requirements.txt && python3 -m flask run",
      "outputDirectory": "./",
      "devCommand": "python3 -m flask run"
    }
  ]
}
```

**Nota:** O `outputDirectory` para o Flask pode precisar ser ajustado dependendo de como sua aplicação é servida. Para este exemplo, ele aponta para a raiz do diretório `/app`.

---

**Desenvolvido por Manus AI**

