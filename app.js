// ProtestoPro - Integração Frontend-Backend
// Configuração da API
const API_BASE_URL = '/api';

// Utilitários para requisições HTTP
class ApiClient {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Gerenciador de dados do Dashboard
class DashboardManager {
    static async carregarEstatisticas() {
        try {
            const response = await ApiClient.get('/dashboard/estatisticas');
            this.atualizarCards(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            showNotification('Erro ao carregar estatísticas do dashboard', 'error');
        }
    }

    static atualizarCards(data) {
        // Atualizar cards do dashboard com dados reais
        const cards = {
            'total-protestos': data.protestos.total,
            'protestos-ativos': data.protestos.ativos,
            'valor-cobranca': this.formatarMoeda(data.protestos.valor_cobranca),
            'taxa-sucesso': `${data.protestos.taxa_sucesso}%`
        };

        Object.entries(cards).forEach(([id, valor]) => {
            const elemento = document.querySelector(`[data-stat="${id}"]`);
            if (elemento) {
                elemento.textContent = valor;
            }
        });
    }

    static formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
}

// Gerenciador de Protestos
class ProtestosManager {
    static protestos = [];
    static paginaAtual = 1;
    static filtros = { status: '', cliente: '' };

    static async carregarProtestos(pagina = 1) {
        try {
            const params = new URLSearchParams({
                page: pagina,
                per_page: 10,
                ...this.filtros
            });

            const response = await ApiClient.get(`/protestos?${params}`);
            this.protestos = response.data;
            this.paginaAtual = pagina;
            this.renderizarTabela();
            this.atualizarPaginacao(response.pagination);
        } catch (error) {
            console.error('Erro ao carregar protestos:', error);
            showNotification('Erro ao carregar protestos', 'error');
        }
    }

    static async criarProtesto(dados) {
        try {
            const response = await ApiClient.post('/protestos', dados);
            showNotification(response.message, 'success');
            this.carregarProtestos(); // Recarregar lista
            return response.data;
        } catch (error) {
            console.error('Erro ao criar protesto:', error);
            showNotification(error.message || 'Erro ao criar protesto', 'error');
            throw error;
        }
    }

    static async atualizarStatus(id, novoStatus) {
        try {
            const response = await ApiClient.put(`/protestos/${id}`, { status: novoStatus });
            showNotification(response.message, 'success');
            this.carregarProtestos(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            showNotification(error.message || 'Erro ao atualizar status', 'error');
        }
    }

    static renderizarTabela() {
        const container = document.getElementById('protestos-table-container');
        if (!container) return;

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th onclick="ProtestosManager.ordenar('protocolo')">Protocolo</th>
                        <th onclick="ProtestosManager.ordenar('cliente')">Cliente</th>
                        <th onclick="ProtestosManager.ordenar('documento')">Documento</th>
                        <th onclick="ProtestosManager.ordenar('valor')">Valor</th>
                        <th onclick="ProtestosManager.ordenar('status')">Status</th>
                        <th onclick="ProtestosManager.ordenar('data_vencimento')">Vencimento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.protestos.map(protesto => `
                        <tr>
                            <td>${protesto.protocolo}</td>
                            <td>${protesto.cliente}</td>
                            <td>${protesto.documento}</td>
                            <td>${DashboardManager.formatarMoeda(protesto.valor)}</td>
                            <td><span class="status-badge ${protesto.status}">${this.traduzirStatus(protesto.status)}</span></td>
                            <td>${this.formatarData(protesto.data_vencimento)}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="ProtestosManager.verDetalhes(${protesto.id})">Ver</button>
                                ${protesto.status === 'pending' ? 
                                    `<button class="btn btn-success btn-sm" onclick="ProtestosManager.atualizarStatus(${protesto.id}, 'completed')">Concluir</button>` : 
                                    ''
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    static traduzirStatus(status) {
        const traducoes = {
            'pending': 'Processando',
            'completed': 'Concluído',
            'rejected': 'Rejeitado'
        };
        return traducoes[status] || status;
    }

    static formatarData(dataISO) {
        return new Date(dataISO).toLocaleDateString('pt-BR');
    }

    static aplicarFiltros() {
        const statusFiltro = document.querySelector('#protestos-section select')?.value || '';
        const clienteFiltro = document.querySelector('#protestos-section input')?.value || '';
        
        this.filtros = { status: statusFiltro, cliente: clienteFiltro };
        this.carregarProtestos(1);
    }

    static verDetalhes(id) {
        const protesto = this.protestos.find(p => p.id === id);
        if (protesto) {
            alert(`Detalhes do Protesto ${protesto.protocolo}:\n\nCliente: ${protesto.cliente}\nValor: ${DashboardManager.formatarMoeda(protesto.valor)}\nStatus: ${this.traduzirStatus(protesto.status)}\nObservações: ${protesto.observacoes || 'Nenhuma'}`);
        }
    }
}

// Gerenciador de Clientes
class ClientesManager {
    static clientes = [];

    static async carregarClientes() {
        try {
            const response = await ApiClient.get('/clientes');
            this.clientes = response.data;
            this.renderizarTabela();
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showNotification('Erro ao carregar clientes', 'error');
        }
    }

    static async criarCliente(dados) {
        try {
            const response = await ApiClient.post('/clientes', dados);
            showNotification(response.message, 'success');
            this.carregarClientes(); // Recarregar lista
            return response.data;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            showNotification(error.message || 'Erro ao criar cliente', 'error');
            throw error;
        }
    }

    static renderizarTabela() {
        const container = document.getElementById('clientes-table-container');
        if (!container) return;

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Nome/Razão Social</th>
                        <th>Documento</th>
                        <th>Tipo</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Protestos Ativos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.clientes.map(cliente => `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${cliente.documento}</td>
                            <td><span class="badge ${cliente.tipo === 'fisica' ? 'badge-info' : 'badge-warning'}">${cliente.tipo === 'fisica' ? 'PF' : 'PJ'}</span></td>
                            <td>${cliente.email}</td>
                            <td>${cliente.telefone}</td>
                            <td>${cliente.protestos_ativos || 0}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="ClientesManager.verDetalhes(${cliente.id})">Ver</button>
                                <button class="btn btn-secondary btn-sm" onclick="ClientesManager.editarCliente(${cliente.id})">Editar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    static verDetalhes(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            alert(`Detalhes do Cliente:\n\nNome: ${cliente.nome}\nDocumento: ${cliente.documento}\nEmail: ${cliente.email}\nTelefone: ${cliente.telefone}\nEndereço: ${cliente.endereco || 'Não informado'}`);
        }
    }

    static editarCliente(id) {
        // Implementar edição de cliente
        showNotification('Funcionalidade de edição em desenvolvimento', 'info');
    }
}

// Gerenciador de Certidões
class CertidoesManager {
    static certidoes = [];

    static async carregarCertidoes() {
        try {
            const response = await ApiClient.get('/certidoes');
            this.certidoes = response.data;
            this.renderizarTabela();
        } catch (error) {
            console.error('Erro ao carregar certidões:', error);
            showNotification('Erro ao carregar certidões', 'error');
        }
    }

    static async criarCertidao(dados) {
        try {
            const response = await ApiClient.post('/certidoes', dados);
            showNotification(response.message, 'success');
            this.carregarCertidoes(); // Recarregar lista
            return response.data;
        } catch (error) {
            console.error('Erro ao criar certidão:', error);
            showNotification(error.message || 'Erro ao criar certidão', 'error');
            throw error;
        }
    }

    static async downloadCertidao(id) {
        try {
            const response = await ApiClient.get(`/certidoes/${id}/download`);
            showNotification(response.message, 'success');
        } catch (error) {
            console.error('Erro ao fazer download:', error);
            showNotification(error.message || 'Erro ao fazer download da certidão', 'error');
        }
    }

    static async enviarEmail(id) {
        try {
            const response = await ApiClient.post(`/certidoes/${id}/enviar-email`);
            showNotification(response.message, 'success');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            showNotification(error.message || 'Erro ao enviar certidão por email', 'error');
        }
    }

    static renderizarTabela() {
        const container = document.getElementById('certidoes-table-container');
        if (!container) return;

        const html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Protocolo</th>
                        <th>Cliente/CPF/CNPJ</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Data Solicitação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.certidoes.map(certidao => `
                        <tr>
                            <td>${certidao.protocolo}</td>
                            <td>${certidao.nome_requerente} / ${certidao.documento_requerente}</td>
                            <td><span class="badge badge-info">${certidao.tipo.charAt(0).toUpperCase() + certidao.tipo.slice(1)}</span></td>
                            <td><span class="status-badge ${certidao.status}">${ProtestosManager.traduzirStatus(certidao.status)}</span></td>
                            <td>${ProtestosManager.formatarData(certidao.data_solicitacao)}</td>
                            <td>
                                ${certidao.status === 'completed' ? 
                                    `<button class="btn btn-success btn-sm" onclick="CertidoesManager.downloadCertidao(${certidao.id})">Download</button>
                                     <button class="btn btn-secondary btn-sm" onclick="CertidoesManager.enviarEmail(${certidao.id})">Enviar</button>` :
                                    `<button class="btn btn-warning btn-sm" onclick="CertidoesManager.consultarStatus(${certidao.id})">Status</button>`
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    static consultarStatus(id) {
        const certidao = this.certidoes.find(c => c.id === id);
        if (certidao) {
            alert(`Status da Certidão ${certidao.protocolo}:\n\n${ProtestosManager.traduzirStatus(certidao.status)}\n\nFinalidade: ${certidao.finalidade}`);
        }
    }
}

// Gerenciador de Pesquisa
class PesquisaManager {
    static async pesquisarProtestos(tipo, valor) {
        try {
            showNotification('Realizando pesquisa nos cartórios...', 'info');
            
            const response = await ApiClient.post('/pesquisa/protestos', {
                tipo: tipo,
                valor: valor
            });

            this.exibirResultados(response.data);
            return response.data;
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            showNotification(error.message || 'Erro ao realizar pesquisa', 'error');
            throw error;
        }
    }

    static exibirResultados(dados) {
        const container = document.getElementById('resultados-pesquisa');
        if (!container) return;

        const { consulta, protestos } = dados;
        
        let html = `
            <div class="pesquisa-info">
                <h4>Resultado da Consulta</h4>
                <p><strong>Tipo:</strong> ${consulta.tipo.toUpperCase()}</p>
                <p><strong>Valor consultado:</strong> ${consulta.valor}</p>
                <p><strong>Data:</strong> ${ProtestosManager.formatarData(consulta.data_consulta)}</p>
                <p><strong>Protestos encontrados:</strong> ${consulta.total_encontrados}</p>
            </div>
        `;

        if (protestos.length > 0) {
            html += `
                <div class="resultados-lista">
                    <h5>Protestos Encontrados:</h5>
                    ${protestos.map(protesto => `
                        <div class="protesto-item">
                            <div class="protesto-header">
                                <strong>${protesto.protocolo}</strong> - ${protesto.cartorio}
                            </div>
                            <div class="protesto-details">
                                <p><strong>Valor:</strong> ${DashboardManager.formatarMoeda(protesto.valor)}</p>
                                <p><strong>Data:</strong> ${protesto.data_protesto}</p>
                                <p><strong>Status:</strong> ${protesto.status}</p>
                                <p><strong>Documento:</strong> ${protesto.documento_origem}</p>
                                <p><strong>Apresentante:</strong> ${protesto.apresentante}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            html += '<div class="no-results"><p>Nenhum protesto encontrado para os dados informados.</p></div>';
        }

        container.innerHTML = html;
        container.style.display = 'block';
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados iniciais
    DashboardManager.carregarEstatisticas();
    ProtestosManager.carregarProtestos();
    ClientesManager.carregarClientes();
    CertidoesManager.carregarCertidoes();

    // Configurar eventos de filtro
    const filtroProtestos = document.querySelector('#protestos-section .btn');
    if (filtroProtestos) {
        filtroProtestos.addEventListener('click', () => {
            ProtestosManager.aplicarFiltros();
        });
    }

    // Configurar formulários para usar APIs reais
    configurarFormularios();
});

// Configuração dos formulários
function configurarFormularios() {
    // Formulário de Protesto
    const protestoForm = document.getElementById('protestoForm');
    if (protestoForm) {
        protestoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(protestoForm);
            const dados = {
                cliente_id: parseInt(formData.get('cliente')),
                tipo_documento: formData.get('tipoDocumento'),
                numero_documento: formData.get('numeroDocumento'),
                valor: parseFloat(formData.get('valor')),
                data_vencimento: formData.get('dataVencimento'),
                endereco_devedor: formData.get('enderecoDevedor'),
                observacoes: formData.get('observacoes'),
                urgente: formData.has('urgente')
            };

            try {
                await ProtestosManager.criarProtesto(dados);
                closeModal('novoProtestoModal');
                protestoForm.reset();
            } catch (error) {
                // Erro já tratado no ProtestosManager
            }
        });
    }

    // Formulário de Cliente
    const clienteForm = document.getElementById('clienteForm');
    if (clienteForm) {
        clienteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(clienteForm);
            const dados = {
                nome: formData.get('nome'),
                tipo: formData.get('tipoPessoa'),
                documento: formData.get('documento'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                endereco: formData.get('endereco'),
                cep: formData.get('cep'),
                cidade: formData.get('cidade'),
                estado: formData.get('estado'),
                bairro: formData.get('bairro'),
                nome_fantasia: formData.get('nomeFantasia'),
                inscricao_estadual: formData.get('inscricaoEstadual'),
                representante_legal: formData.get('representanteLegal'),
                observacoes: formData.get('observacoes')
            };

            try {
                await ClientesManager.criarCliente(dados);
                closeModal('clienteModal');
                clienteForm.reset();
            } catch (error) {
                // Erro já tratado no ClientesManager
            }
        });
    }

    // Formulário de Certidão
    const certidaoForm = document.getElementById('certidaoForm');
    if (certidaoForm) {
        certidaoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(certidaoForm);
            const dados = {
                tipo: formData.get('tipoCertidao'),
                nome_requerente: formData.get('nomeRequerente'),
                documento_requerente: formData.get('documentoRequerente'),
                tipo_pessoa: formData.get('tipoPessoaCertidao'),
                finalidade: formData.get('finalidade'),
                observacoes: formData.get('observacoesCertidao'),
                urgente: formData.has('urgenteCertidao'),
                enviar_email: formData.has('enviarEmail')
            };

            try {
                await CertidoesManager.criarCertidao(dados);
                closeModal('certidaoModal');
                certidaoForm.reset();
            } catch (error) {
                // Erro já tratado no CertidoesManager
            }
        });
    }

    // Formulário de Pesquisa
    const pesquisaForm = document.getElementById('pesquisaForm');
    if (pesquisaForm) {
        pesquisaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(pesquisaForm);
            const tipo = formData.get('tipoConsulta');
            const valor = formData.get('valorConsulta');

            try {
                await PesquisaManager.pesquisarProtestos(tipo, valor);
            } catch (error) {
                // Erro já tratado no PesquisaManager
            }
        });
    }
}

// Função global para notificações (mantida para compatibilidade)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer;">&times;</button>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}



// Função para toggle do FAQ
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fecha todos os outros FAQs
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle do FAQ atual
    if (isActive) {
        faqItem.classList.remove('active');
    } else {
        faqItem.classList.add('active');
    }
}

