// ProtestoPro - Sistema de Gestão de Protestos
// Arquivo principal de funcionalidades JavaScript

// === DADOS SIMULADOS ===
const dadosSimulados = {
    protestos: [
        {
            id: 1,
            cliente: "João Silva & Cia",
            documento: "Duplicata 1234",
            valor: 15500.00,
            status: "pending",
            dataCriacao: "2025-07-15",
            dataVencimento: "2025-07-25",
            protocolo: "#001",
            observacoes: "Protesto urgente"
        },
        {
            id: 2,
            cliente: "Maria Santos LTDA",
            documento: "Nota Promissória 5678",
            valor: 8200.00,
            status: "completed",
            dataCriacao: "2025-07-14",
            dataVencimento: "2025-07-20",
            protocolo: "#002",
            observacoes: "Protesto concluído com sucesso"
        },
        {
            id: 3,
            cliente: "Pedro Oliveira ME",
            documento: "Cheque 9012",
            valor: 22100.00,
            status: "rejected",
            dataCriacao: "2025-07-13",
            dataVencimento: "2025-07-18",
            protocolo: "#003",
            observacoes: "Documentação insuficiente"
        },
        {
            id: 4,
            cliente: "Ana Costa Comércio",
            documento: "Duplicata 3456",
            valor: 12800.00,
            status: "pending",
            dataCriacao: "2025-07-16",
            dataVencimento: "2025-07-26",
            protocolo: "#004",
            observacoes: "Aguardando confirmação"
        },
        {
            id: 5,
            cliente: "Carlos Ferreira LTDA",
            documento: "Contrato 7890",
            valor: 35600.00,
            status: "completed",
            dataCriacao: "2025-07-12",
            dataVencimento: "2025-07-22",
            protocolo: "#005",
            observacoes: "Protesto finalizado"
        }
    ],
    
    clientes: [
        {
            id: 1,
            nome: "João Silva & Cia",
            tipo: "juridica",
            documento: "12.345.678/0001-90",
            email: "contato@joaosilva.com",
            telefone: "(11) 99999-9999",
            protestosAtivos: 3,
            endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
            dataCadastro: "2025-01-15"
        },
        {
            id: 2,
            nome: "Maria Santos",
            tipo: "fisica",
            documento: "123.456.789-00",
            email: "maria@email.com",
            telefone: "(11) 88888-8888",
            protestosAtivos: 1,
            endereco: "Av. Paulista, 456 - Bela Vista - São Paulo/SP",
            dataCadastro: "2025-02-20"
        },
        {
            id: 3,
            nome: "Pedro Oliveira ME",
            tipo: "juridica",
            documento: "98.765.432/0001-10",
            email: "pedro@oliveira.com",
            telefone: "(11) 77777-7777",
            protestosAtivos: 2,
            endereco: "Rua Augusta, 789 - Consolação - São Paulo/SP",
            dataCadastro: "2025-03-10"
        },
        {
            id: 4,
            nome: "Ana Costa",
            tipo: "fisica",
            documento: "987.654.321-00",
            email: "ana@costa.com",
            telefone: "(11) 66666-6666",
            protestosAtivos: 1,
            endereco: "Rua Oscar Freire, 321 - Jardins - São Paulo/SP",
            dataCadastro: "2025-04-05"
        }
    ],
    
    certidoes: [
        {
            id: 1,
            protocolo: "#CERT001",
            cliente: "João Silva",
            documento: "123.456.789-00",
            tipo: "positiva",
            status: "completed",
            dataSolicitacao: "2025-07-20",
            dataEmissao: "2025-07-21",
            finalidade: "Participação em licitação"
        },
        {
            id: 2,
            protocolo: "#CERT002",
            cliente: "Maria Santos LTDA",
            documento: "12.345.678/0001-90",
            tipo: "negativa",
            status: "pending",
            dataSolicitacao: "2025-07-21",
            dataEmissao: null,
            finalidade: "Financiamento bancário"
        },
        {
            id: 3,
            protocolo: "#CERT003",
            cliente: "Pedro Oliveira",
            documento: "987.654.321-00",
            tipo: "detalhada",
            status: "completed",
            dataSolicitacao: "2025-07-19",
            dataEmissao: "2025-07-20",
            finalidade: "Comprovação para seguro"
        }
    ],
    
    pesquisas: [
        {
            id: 1,
            dataHora: "2025-07-24 14:30",
            tipo: "cpf",
            consultado: "123.456.789-00",
            resultados: 2,
            protestosEncontrados: [
                {
                    protocolo: "#P001",
                    cartorio: "1º Cartório de Protestos",
                    valor: 5500.00,
                    dataProtesto: "2025-06-15",
                    status: "ativo"
                },
                {
                    protocolo: "#P002",
                    cartorio: "2º Cartório de Protestos",
                    valor: 3200.00,
                    dataProtesto: "2025-05-20",
                    status: "quitado"
                }
            ]
        },
        {
            id: 2,
            dataHora: "2025-07-24 10:15",
            tipo: "cnpj",
            consultado: "12.345.678/0001-90",
            resultados: 0,
            protestosEncontrados: []
        }
    ]
};

// === UTILITÁRIOS ===
const utils = {
    formatarMoeda: (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },
    
    formatarData: (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    },
    
    formatarDataHora: (dataHora) => {
        return new Date(dataHora).toLocaleString('pt-BR');
    },
    
    obterStatusBadge: (status) => {
        const badges = {
            pending: '<span class="status-badge pending">Processando</span>',
            completed: '<span class="status-badge completed">Concluído</span>',
            rejected: '<span class="status-badge rejected">Rejeitado</span>',
            ativo: '<span class="status-badge pending">Ativo</span>',
            quitado: '<span class="status-badge completed">Quitado</span>'
        };
        return badges[status] || status;
    },
    
    obterTipoPessoa: (tipo) => {
        const tipos = {
            fisica: '<span class="status-badge pending">PF</span>',
            juridica: '<span class="status-badge completed">PJ</span>'
        };
        return tipos[tipo] || tipo;
    }
};

// === GERENCIAMENTO DE TABELAS ===
class TabelaManager {
    constructor(containerId, dados, colunas, opcoes = {}) {
        this.containerId = containerId;
        this.dados = dados;
        this.colunas = colunas;
        this.dadosFiltrados = [...dados];
        this.paginaAtual = 1;
        this.itensPorPagina = opcoes.itensPorPagina || 10;
        this.filtros = {};
        this.ordenacao = { coluna: null, direcao: 'asc' };
        
        this.inicializar();
    }
    
    inicializar() {
        this.renderizarTabela();
        this.configurarEventos();
    }
    
    renderizarTabela() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        const dadosPagina = this.dadosFiltrados.slice(inicio, fim);
        
        let html = '<table class="table"><thead><tr>';
        
        // Cabeçalhos
        this.colunas.forEach(coluna => {
            const iconeOrdenacao = this.obterIconeOrdenacao(coluna.campo);
            html += `<th onclick="window.tabelaManagers['${this.containerId}'].ordenar('${coluna.campo}')" style="cursor: pointer;">
                ${coluna.titulo} ${iconeOrdenacao}
            </th>`;
        });
        
        html += '</tr></thead><tbody>';
        
        // Dados
        dadosPagina.forEach(item => {
            html += '<tr>';
            this.colunas.forEach(coluna => {
                let valor = item[coluna.campo];
                if (coluna.formatador) {
                    valor = coluna.formatador(valor, item);
                }
                html += `<td>${valor}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        
        // Paginação
        html += this.renderizarPaginacao();
        
        container.innerHTML = html;
    }
    
    renderizarPaginacao() {
        const totalPaginas = Math.ceil(this.dadosFiltrados.length / this.itensPorPagina);
        if (totalPaginas <= 1) return '';
        
        let html = '<div class="paginacao" style="margin-top: 1rem; text-align: center;">';
        
        // Botão anterior
        if (this.paginaAtual > 1) {
            html += `<button class="btn btn-secondary" onclick="window.tabelaManagers['${this.containerId}'].irParaPagina(${this.paginaAtual - 1})">Anterior</button>`;
        }
        
        // Números das páginas
        for (let i = 1; i <= totalPaginas; i++) {
            const classe = i === this.paginaAtual ? 'btn-primary' : 'btn-secondary';
            html += `<button class="btn ${classe}" onclick="window.tabelaManagers['${this.containerId}'].irParaPagina(${i})" style="margin: 0 0.2rem;">${i}</button>`;
        }
        
        // Botão próximo
        if (this.paginaAtual < totalPaginas) {
            html += `<button class="btn btn-secondary" onclick="window.tabelaManagers['${this.containerId}'].irParaPagina(${this.paginaAtual + 1})">Próximo</button>`;
        }
        
        html += '</div>';
        return html;
    }
    
    obterIconeOrdenacao(campo) {
        if (this.ordenacao.coluna !== campo) return '↕️';
        return this.ordenacao.direcao === 'asc' ? '↑' : '↓';
    }
    
    ordenar(campo) {
        if (this.ordenacao.coluna === campo) {
            this.ordenacao.direcao = this.ordenacao.direcao === 'asc' ? 'desc' : 'asc';
        } else {
            this.ordenacao.coluna = campo;
            this.ordenacao.direcao = 'asc';
        }
        
        this.dadosFiltrados.sort((a, b) => {
            let valorA = a[campo];
            let valorB = b[campo];
            
            // Tratamento especial para números
            if (typeof valorA === 'number' && typeof valorB === 'number') {
                return this.ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA;
            }
            
            // Tratamento para strings
            valorA = String(valorA).toLowerCase();
            valorB = String(valorB).toLowerCase();
            
            if (this.ordenacao.direcao === 'asc') {
                return valorA.localeCompare(valorB);
            } else {
                return valorB.localeCompare(valorA);
            }
        });
        
        this.paginaAtual = 1;
        this.renderizarTabela();
    }
    
    filtrar(filtros) {
        this.filtros = filtros;
        this.dadosFiltrados = this.dados.filter(item => {
            return Object.keys(filtros).every(campo => {
                if (!filtros[campo]) return true;
                const valor = String(item[campo]).toLowerCase();
                const filtro = String(filtros[campo]).toLowerCase();
                return valor.includes(filtro);
            });
        });
        
        this.paginaAtual = 1;
        this.renderizarTabela();
    }
    
    irParaPagina(pagina) {
        this.paginaAtual = pagina;
        this.renderizarTabela();
    }
    
    configurarEventos() {
        // Eventos específicos podem ser adicionados aqui
    }
}

// === INICIALIZAÇÃO DAS TABELAS ===
const tabelaManagers = {};

function inicializarTabelaProtestos() {
    const colunas = [
        { campo: 'protocolo', titulo: 'ID' },
        { campo: 'cliente', titulo: 'Cliente' },
        { campo: 'documento', titulo: 'Documento' },
        { 
            campo: 'valor', 
            titulo: 'Valor',
            formatador: (valor) => utils.formatarMoeda(valor)
        },
        { 
            campo: 'status', 
            titulo: 'Status',
            formatador: (valor) => utils.obterStatusBadge(valor)
        },
        { 
            campo: 'dataCriacao', 
            titulo: 'Data Criação',
            formatador: (valor) => utils.formatarData(valor)
        },
        { 
            campo: 'dataVencimento', 
            titulo: 'Vencimento',
            formatador: (valor) => utils.formatarData(valor)
        },
        { 
            campo: 'id', 
            titulo: 'Ações',
            formatador: (valor, item) => `
                <button class="btn btn-secondary" onclick="verDetalhes(${valor})">Ver</button>
                <button class="btn btn-warning" onclick="editarProtesto(${valor})">Editar</button>
                ${item.status === 'pending' ? `<button class="btn btn-danger" onclick="cancelarProtesto(${valor})">Cancelar</button>` : ''}
            `
        }
    ];
    
    tabelaManagers['protestos-table-body'] = new TabelaManager(
        'protestos-table-container',
        dadosSimulados.protestos,
        colunas,
        { itensPorPagina: 5 }
    );
}

function inicializarTabelaClientes() {
    const colunas = [
        { campo: 'nome', titulo: 'Nome' },
        { 
            campo: 'tipo', 
            titulo: 'Tipo',
            formatador: (valor) => utils.obterTipoPessoa(valor)
        },
        { campo: 'documento', titulo: 'CNPJ/CPF' },
        { campo: 'email', titulo: 'Email' },
        { campo: 'telefone', titulo: 'Telefone' },
        { 
            campo: 'protestosAtivos', 
            titulo: 'Protestos',
            formatador: (valor) => `${valor} ativos`
        },
        { 
            campo: 'id', 
            titulo: 'Ações',
            formatador: (valor) => `
                <button class="btn btn-secondary" onclick="verCliente(${valor})">Ver</button>
                <button class="btn btn-warning" onclick="editarCliente(${valor})">Editar</button>
            `
        }
    ];
    
    tabelaManagers['clientes-table-body'] = new TabelaManager(
        'clientes-table-container',
        dadosSimulados.clientes,
        colunas,
        { itensPorPagina: 5 }
    );
}

function inicializarTabelaCertidoes() {
    const colunas = [
        { campo: 'protocolo', titulo: 'Protocolo' },
        { 
            campo: 'cliente', 
            titulo: 'Cliente/CPF/CNPJ',
            formatador: (valor, item) => `${valor} / ${item.documento}`
        },
        { 
            campo: 'tipo', 
            titulo: 'Tipo',
            formatador: (valor) => valor.charAt(0).toUpperCase() + valor.slice(1)
        },
        { 
            campo: 'status', 
            titulo: 'Status',
            formatador: (valor) => utils.obterStatusBadge(valor)
        },
        { 
            campo: 'dataSolicitacao', 
            titulo: 'Data Solicitação',
            formatador: (valor) => utils.formatarData(valor)
        },
        { 
            campo: 'id', 
            titulo: 'Ações',
            formatador: (valor, item) => {
                if (item.status === 'completed') {
                    return `
                        <button class="btn btn-success" onclick="downloadCertidao(${valor})">Download</button>
                        <button class="btn btn-secondary" onclick="enviarEmail(${valor})">Enviar</button>
                    `;
                } else {
                    return `
                        <button class="btn btn-warning" onclick="consultarStatus(${valor})">Status</button>
                        <button class="btn btn-secondary" onclick="editarSolicitacao(${valor})">Editar</button>
                    `;
                }
            }
        }
    ];
    
    tabelaManagers['certidoes-table-body'] = new TabelaManager(
        'certidoes-table-container',
        dadosSimulados.certidoes,
        colunas,
        { itensPorPagina: 5 }
    );
}

// === FUNCIONALIDADES DE BUSCA E FILTRO ===
function configurarFiltros() {
    // Filtro de protestos
    const searchProtestos = document.getElementById('searchAllProtestos');
    const filterStatus = document.getElementById('filterStatusAll');
    
    if (searchProtestos && filterStatus) {
        const aplicarFiltroProtestos = () => {
            const filtros = {};
            if (searchProtestos.value) {
                filtros.cliente = searchProtestos.value;
            }
            if (filterStatus.value) {
                filtros.status = filterStatus.value;
            }
            
            if (tabelaManagers['protestos-table-container']) {
                tabelaManagers['protestos-table-container'].filtrar(filtros);
            }
        };
        
        searchProtestos.addEventListener('input', aplicarFiltroProtestos);
        filterStatus.addEventListener('change', aplicarFiltroProtestos);
    }
    
    // Filtro de clientes
    const searchClientes = document.getElementById('searchClientes');
    const filterTipoCliente = document.getElementById('filterTipoCliente');
    
    if (searchClientes && filterTipoCliente) {
        const aplicarFiltroClientes = () => {
            const filtros = {};
            if (searchClientes.value) {
                filtros.nome = searchClientes.value;
            }
            if (filterTipoCliente.value) {
                filtros.tipo = filterTipoCliente.value;
            }
            
            if (tabelaManagers['clientes-table-container']) {
                tabelaManagers['clientes-table-container'].filtrar(filtros);
            }
        };
        
        searchClientes.addEventListener('input', aplicarFiltroClientes);
        filterTipoCliente.addEventListener('change', aplicarFiltroClientes);
    }
}

// === SIMULAÇÃO DE PESQUISA ===
function simularPesquisaProtesto(tipo, valor) {
    // Simula uma pesquisa de protesto
    const loading = document.getElementById('loadingPesquisa');
    const resultado = document.getElementById('resultadoPesquisa');
    const dadosConsultado = document.getElementById('dadosConsultado');
    const resultadosBody = document.getElementById('resultados-table-body');
    
    if (loading) loading.style.display = 'block';
    
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        if (resultado) resultado.style.display = 'block';
        
        // Dados do consultado
        if (dadosConsultado) {
            dadosConsultado.innerHTML = `
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Dados do Consultado</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div><strong>Tipo:</strong> ${tipo.toUpperCase()}</div>
                    <div><strong>Documento/Nome:</strong> ${valor}</div>
                    <div><strong>Data da Consulta:</strong> ${new Date().toLocaleString('pt-BR')}</div>
                    <div><strong>Protestos Encontrados:</strong> 2</div>
                </div>
            `;
        }
        
        // Resultados simulados
        if (resultadosBody) {
            resultadosBody.innerHTML = `
                <tr>
                    <td>#P001</td>
                    <td>1º Cartório de Protestos de São Paulo</td>
                    <td>R$ 5.500,00</td>
                    <td>15/06/2025</td>
                    <td><span class="status-badge pending">Ativo</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="verDetalheProtesto('P001')">Detalhes</button>
                        <button class="btn btn-warning" onclick="solicitarCancelamento('P001')">Cancelar</button>
                    </td>
                </tr>
                <tr>
                    <td>#P002</td>
                    <td>2º Cartório de Protestos de São Paulo</td>
                    <td>R$ 3.200,00</td>
                    <td>20/05/2025</td>
                    <td><span class="status-badge completed">Quitado</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="verDetalheProtesto('P002')">Detalhes</button>
                        <button class="btn btn-success" onclick="downloadComprovante('P002')">Comprovante</button>
                    </td>
                </tr>
            `;
        }
        
        showNotification('Pesquisa realizada com sucesso!', 'success');
    }, 2000);
}

// === ATUALIZAÇÃO DE ESTATÍSTICAS ===
function atualizarEstatisticas() {
    // Atualiza as estatísticas do dashboard com dados simulados
    const stats = {
        totalProtestos: dadosSimulados.protestos.length,
        protestosAtivos: dadosSimulados.protestos.filter(p => p.status === 'pending').length,
        valorCobranca: dadosSimulados.protestos.reduce((total, p) => total + p.valor, 0),
        taxaSucesso: Math.round((dadosSimulados.protestos.filter(p => p.status === 'completed').length / dadosSimulados.protestos.length) * 100)
    };
    
    const elementos = {
        totalProtestos: document.getElementById('totalProtestos'),
        protestosAtivos: document.getElementById('protestosAtivos'),
        valorCobranca: document.getElementById('valorCobranca'),
        taxaSucesso: document.getElementById('taxaSucesso')
    };
    
    if (elementos.totalProtestos) elementos.totalProtestos.textContent = stats.totalProtestos;
    if (elementos.protestosAtivos) elementos.protestosAtivos.textContent = stats.protestosAtivos;
    if (elementos.valorCobranca) elementos.valorCobranca.textContent = utils.formatarMoeda(stats.valorCobranca);
    if (elementos.taxaSucesso) elementos.taxaSucesso.textContent = `${stats.taxaSucesso}%`;
}

// === FUNÇÕES DE AÇÃO ===
window.verDetalhes = (id) => {
    const protesto = dadosSimulados.protestos.find(p => p.id === id);
    if (protesto) {
        showNotification(`Visualizando detalhes do protesto ${protesto.protocolo}`, 'success');
        console.log('Detalhes do protesto:', protesto);
    }
};

window.editarProtesto = (id) => {
    showNotification(`Editando protesto ID: ${id}`, 'warning');
};

window.cancelarProtesto = (id) => {
    if (confirm('Tem certeza que deseja cancelar este protesto?')) {
        showNotification(`Protesto ID: ${id} cancelado`, 'success');
    }
};

window.verCliente = (id) => {
    const cliente = dadosSimulados.clientes.find(c => c.id === id);
    if (cliente) {
        showNotification(`Visualizando cliente: ${cliente.nome}`, 'success');
        console.log('Detalhes do cliente:', cliente);
    }
};

window.editarCliente = (id) => {
    showNotification(`Editando cliente ID: ${id}`, 'warning');
};

window.downloadCertidao = (id) => {
    showNotification(`Download da certidão ID: ${id} iniciado`, 'success');
};

window.enviarEmail = (id) => {
    showNotification(`Email da certidão ID: ${id} enviado`, 'success');
};

window.consultarStatus = (id) => {
    showNotification(`Consultando status da certidão ID: ${id}`, 'warning');
};

window.editarSolicitacao = (id) => {
    showNotification(`Editando solicitação ID: ${id}`, 'warning');
};

window.filtrarProtestos = () => {
    showNotification('Filtros aplicados com sucesso!', 'success');
};

window.gerarRelatorioRapido = (tipo = 'geral') => {
    showNotification(`Gerando relatório ${tipo}...`, 'success');
};

window.exportarDados = (tipo = 'completo') => {
    showNotification(`Exportando dados: ${tipo}`, 'success');
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        // Expor tabelaManagers globalmente
        window.tabelaManagers = tabelaManagers;
        
        // Inicializar tabelas
        inicializarTabelaProtestos();
        inicializarTabelaClientes();
        inicializarTabelaCertidoes();
        
        // Configurar filtros
        configurarFiltros();
        
        // Atualizar estatísticas
        atualizarEstatisticas();
        
        // Configurar formulário de pesquisa
        const pesquisaForm = document.getElementById('pesquisaForm');
        if (pesquisaForm) {
            pesquisaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const tipo = formData.get('tipoConsulta');
                const valor = formData.get('valorConsulta');
                
                if (tipo && valor) {
                    simularPesquisaProtesto(tipo, valor);
                }
            });
        }
        
        console.log('ProtestoPro: Sistema inicializado com sucesso!');
    }, 500);
});

