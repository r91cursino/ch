import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, session, redirect
from flask_cors import CORS
from src.models.user import db
from src.models.protesto import Protesto
from src.models.cliente import Cliente
from src.models.certidao import Certidao

# Importar blueprints
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.protestos import protestos_bp
from src.routes.clientes import clientes_bp
from src.routes.certidoes import certidoes_bp
from src.routes.pesquisa import pesquisa_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'protestopro_secret_key_2025'

# Configurar CORS para permitir requisições do frontend
CORS(app, origins=['*'])

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(protestos_bp, url_prefix='/api')
app.register_blueprint(clientes_bp, url_prefix='/api')
app.register_blueprint(certidoes_bp, url_prefix='/api')
app.register_blueprint(pesquisa_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def criar_dados_exemplo():
    """Cria dados de exemplo para demonstração"""
    try:
        # Criar clientes de exemplo
        clientes_exemplo = [
            Cliente(
                nome="João Silva & Cia",
                tipo="juridica",
                documento="12.345.678/0001-90",
                email="contato@joaosilva.com",
                telefone="(11) 99999-9999",
                endereco="Rua das Flores, 123 - Centro - São Paulo/SP",
                nome_fantasia="Silva Comércio",
                representante_legal="João Silva"
            ),
            Cliente(
                nome="Maria Santos",
                tipo="fisica",
                documento="123.456.789-00",
                email="maria@email.com",
                telefone="(11) 88888-8888",
                endereco="Av. Paulista, 456 - Bela Vista - São Paulo/SP"
            ),
            Cliente(
                nome="Pedro Oliveira ME",
                tipo="juridica",
                documento="98.765.432/0001-10",
                email="pedro@oliveira.com",
                telefone="(11) 77777-7777",
                endereco="Rua Augusta, 789 - Consolação - São Paulo/SP",
                nome_fantasia="Oliveira Serviços"
            ),
            Cliente(
                nome="Ana Costa",
                tipo="fisica",
                documento="987.654.321-00",
                email="ana@costa.com",
                telefone="(11) 66666-6666",
                endereco="Rua Oscar Freire, 321 - Jardins - São Paulo/SP"
            )
        ]
        
        for cliente in clientes_exemplo:
            db.session.add(cliente)
        
        db.session.commit()
        
        # Criar protestos de exemplo
        from datetime import datetime, timedelta
        
        protestos_exemplo = [
            Protesto(
                protocolo="#001",
                cliente_id=1,
                tipo_documento="Duplicata",
                numero_documento="1234",
                valor=15500.00,
                status="pending",
                data_vencimento=datetime.utcnow() + timedelta(days=10),
                observacoes="Protesto urgente"
            ),
            Protesto(
                protocolo="#002",
                cliente_id=2,
                tipo_documento="Nota Promissória",
                numero_documento="5678",
                valor=8200.00,
                status="completed",
                data_vencimento=datetime.utcnow() - timedelta(days=5),
                observacoes="Protesto concluído com sucesso"
            ),
            Protesto(
                protocolo="#003",
                cliente_id=3,
                tipo_documento="Cheque",
                numero_documento="9012",
                valor=22100.00,
                status="rejected",
                data_vencimento=datetime.utcnow() - timedelta(days=7),
                observacoes="Documentação insuficiente"
            ),
            Protesto(
                protocolo="#004",
                cliente_id=4,
                tipo_documento="Duplicata",
                numero_documento="3456",
                valor=12800.00,
                status="pending",
                data_vencimento=datetime.utcnow() + timedelta(days=11),
                observacoes="Aguardando confirmação"
            ),
            Protesto(
                protocolo="#005",
                cliente_id=1,
                tipo_documento="Contrato",
                numero_documento="7890",
                valor=35600.00,
                status="completed",
                data_vencimento=datetime.utcnow() - timedelta(days=3),
                observacoes="Protesto finalizado"
            )
        ]
        
        for protesto in protestos_exemplo:
            db.session.add(protesto)
        
        # Criar certidões de exemplo
        certidoes_exemplo = [
            Certidao(
                protocolo="#CERT001",
                tipo="positiva",
                nome_requerente="João Silva",
                documento_requerente="123.456.789-00",
                tipo_pessoa="fisica",
                finalidade="Participação em licitação",
                status="completed",
                data_emissao=datetime.utcnow() - timedelta(days=1)
            ),
            Certidao(
                protocolo="#CERT002",
                tipo="negativa",
                nome_requerente="Maria Santos LTDA",
                documento_requerente="12.345.678/0001-90",
                tipo_pessoa="juridica",
                finalidade="Financiamento bancário",
                status="pending"
            ),
            Certidao(
                protocolo="#CERT003",
                tipo="detalhada",
                nome_requerente="Pedro Oliveira",
                documento_requerente="987.654.321-00",
                tipo_pessoa="fisica",
                finalidade="Comprovação para seguro",
                status="completed",
                data_emissao=datetime.utcnow() - timedelta(days=2)
            )
        ]
        
        for certidao in certidoes_exemplo:
            db.session.add(certidao)
        
        db.session.commit()
        print("Dados de exemplo criados com sucesso!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar dados de exemplo: {e}")

# Criar tabelas e dados iniciais
with app.app_context():
    db.create_all()
    
    # Verificar se já existem dados, se não, criar dados de exemplo
    if Cliente.query.count() == 0:
        criar_dados_exemplo()

# Rota para servir o frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Verificar se é uma rota que requer autenticação
    protected_routes = ['', 'dashboard', 'protestos', 'clientes', 'certidoes', 'pesquisa', 'analytics', 'configuracoes']
    
    # Se for uma rota protegida e não estiver logado, redirecionar para login
    if path in protected_routes or path == '':
        if 'user_id' not in session:
            return redirect('/login.html')
    
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Rota de health check
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'ProtestoPro API está funcionando',
        'version': '1.0.0'
    })

# Rota para obter estatísticas gerais
@app.route('/api/dashboard/estatisticas')
def obter_estatisticas_dashboard():
    try:
        # Estatísticas de protestos
        total_protestos = Protesto.query.count()
        protestos_ativos = Protesto.query.filter_by(status='pending').count()
        protestos_concluidos = Protesto.query.filter_by(status='completed').count()
        
        # Valor total em cobrança
        valor_total = db.session.query(db.func.sum(Protesto.valor)).filter_by(status='pending').scalar() or 0
        
        # Taxa de sucesso
        taxa_sucesso = 0
        if total_protestos > 0:
            taxa_sucesso = round((protestos_concluidos / total_protestos) * 100, 1)
        
        # Estatísticas de clientes
        total_clientes = Cliente.query.filter_by(ativo=True).count()
        
        # Estatísticas de certidões
        total_certidoes = Certidao.query.count()
        certidoes_pendentes = Certidao.query.filter_by(status='pending').count()
        
        return jsonify({
            'success': True,
            'data': {
                'protestos': {
                    'total': total_protestos,
                    'ativos': protestos_ativos,
                    'concluidos': protestos_concluidos,
                    'valor_cobranca': valor_total,
                    'taxa_sucesso': taxa_sucesso
                },
                'clientes': {
                    'total': total_clientes
                },
                'certidoes': {
                    'total': total_certidoes,
                    'pendentes': certidoes_pendentes
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
