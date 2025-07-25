# ProtestoPro - Sistema de Gestão de Protestos

![ProtestoPro](https://img.shields.io/badge/ProtestoPro-SaaS-blue) ![Flask](https://img.shields.io/badge/Flask-Backend-green) ![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow) ![SQLite](https://img.shields.io/badge/SQLite-Database-orange)

## 🎯 Sobre o Projeto

O **ProtestoPro** é um sistema completo de gestão de protestos desenvolvido como um SaaS (Software as a Service) moderno e funcional. O sistema oferece uma interface intuitiva e profissional para cartórios e empresas gerenciarem protestos, clientes, certidões e consultas de forma eficiente.

## 🌐 Demo Online

**🔗 Acesse o sistema:** [https://9yhyi3czgnmd.manus.space](https://9yhyi3czgnmd.manus.space)

## ✨ Funcionalidades Principais

### 📊 Dashboard Inteligente
- Estatísticas em tempo real
- Indicadores de performance
- Alertas e notificações
- Gráficos de acompanhamento

### 📋 Gestão de Protestos
- Cadastro completo de protestos
- Controle de status (Processando, Concluído, Rejeitado)
- Acompanhamento de vencimentos
- Histórico detalhado

### 👥 Gestão de Clientes
- Cadastro de pessoas físicas e jurídicas
- Validação de documentos (CPF/CNPJ)
- Histórico de relacionamento
- Controle de protestos por cliente

### 📜 Sistema de Certidões
- Emissão de certidões positivas, negativas e detalhadas
- Download automático
- Envio por email
- Controle de status

### 🔍 Pesquisa de Protestos
- Consulta por CPF, CNPJ ou nome
- Simulação de consulta aos cartórios
- Resultados detalhados
- Histórico de consultas

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **Python 3.11** - Linguagem de programação

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização moderna
- **JavaScript ES6+** - Interatividade
- **Fetch API** - Comunicação com backend
- **Design Responsivo** - Compatível com mobile

### Infraestrutura
- **Manus Cloud** - Deploy e hospedagem
- **Git** - Controle de versão
- **GitHub** - Repositório

## 🏗️ Arquitetura do Sistema

```
ProtestoPro/
├── src/
│   ├── main.py              # Aplicação Flask principal
│   ├── models/              # Modelos de dados
│   │   ├── user.py         # Configuração SQLAlchemy
│   │   ├── protesto.py     # Modelo Protesto
│   │   ├── cliente.py      # Modelo Cliente
│   │   └── certidao.py     # Modelo Certidão
│   ├── routes/             # Rotas da API
│   │   ├── protestos.py    # APIs de protestos
│   │   ├── clientes.py     # APIs de clientes
│   │   ├── certidoes.py    # APIs de certidões
│   │   └── pesquisa.py     # APIs de pesquisa
│   └── static/             # Arquivos estáticos
│       ├── index.html      # Interface principal
│       └── app.js          # JavaScript da aplicação
├── database/               # Banco de dados
├── venv/                   # Ambiente virtual Python
└── requirements.txt        # Dependências
```

## 🚀 APIs Disponíveis

### Dashboard
- `GET /api/health` - Status da API
- `GET /api/dashboard/estatisticas` - Estatísticas gerais

### Protestos
- `GET /api/protestos` - Listar protestos
- `POST /api/protestos` - Criar protesto
- `GET /api/protestos/{id}` - Obter protesto
- `PUT /api/protestos/{id}` - Atualizar protesto
- `DELETE /api/protestos/{id}` - Excluir protesto

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/{id}` - Obter cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Excluir cliente

### Certidões
- `GET /api/certidoes` - Listar certidões
- `POST /api/certidoes` - Criar certidão
- `GET /api/certidoes/{id}/download` - Download certidão
- `POST /api/certidoes/{id}/enviar-email` - Enviar por email

### Pesquisa
- `POST /api/pesquisa/protestos` - Pesquisar protestos

## 📱 Interface do Usuário

### Design Moderno
- Interface limpa e profissional
- Cores harmoniosas (azul, roxo, gradientes)
- Tipografia legível
- Ícones intuitivos

### Responsividade
- Compatível com desktop, tablet e mobile
- Layout adaptativo
- Touch-friendly para dispositivos móveis

### Experiência do Usuário
- Navegação intuitiva
- Feedback visual em tempo real
- Notificações de sucesso/erro
- Loading states

## 🔧 Instalação e Execução Local

### Pré-requisitos
- Python 3.11+
- Git

### Passos para instalação

1. **Clone o repositório**
```bash
git clone https://github.com/r91cursino/ch.git
cd ch
```

2. **Crie o ambiente virtual**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Execute a aplicação**
```bash
python src/main.py
```

5. **Acesse o sistema**
```
http://localhost:5000
```

## 📊 Dados de Exemplo

O sistema vem com dados de exemplo pré-carregados:

### Clientes
- João Silva & Cia (PJ)
- Maria Santos (PF)
- Pedro Oliveira ME (PJ)
- Ana Costa (PF)

### Protestos
- 5 protestos com diferentes status
- Valores variados (R$ 8.200 a R$ 35.600)
- Documentos diversos (Duplicata, Cheque, Nota Promissória)

### Certidões
- 3 certidões de exemplo
- Tipos: Positiva, Negativa, Detalhada
- Status variados

## 🔐 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Tratamento de erros robusto
- CORS configurado adequadamente

## 📈 Performance

- APIs otimizadas com paginação
- Carregamento assíncrono de dados
- Cache de estatísticas
- Consultas SQL eficientes

## 🎨 Customização

O sistema foi desenvolvido com foco na customização:

- CSS modular e bem organizado
- Variáveis CSS para cores e espaçamentos
- Componentes JavaScript reutilizáveis
- Estrutura de dados flexível

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por **Manus AI Agent**

- **Repositório:** [https://github.com/r91cursino/ch](https://github.com/r91cursino/ch)
- **Demo:** [https://9yhyi3czgnmd.manus.space](https://9yhyi3czgnmd.manus.space)

## 📞 Suporte

Para suporte ou dúvidas sobre o sistema, entre em contato através do repositório GitHub.

---

**ProtestoPro** - Transformando a gestão de protestos com tecnologia moderna e interface intuitiva.

