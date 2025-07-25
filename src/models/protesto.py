from src.models.user import db
from datetime import datetime

class Protesto(db.Model):
    __tablename__ = 'protestos'
    
    id = db.Column(db.Integer, primary_key=True)
    protocolo = db.Column(db.String(20), unique=True, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    tipo_documento = db.Column(db.String(50), nullable=False)
    numero_documento = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, completed, rejected
    data_criacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    data_vencimento = db.Column(db.DateTime, nullable=False)
    endereco_devedor = db.Column(db.Text)
    observacoes = db.Column(db.Text)
    urgente = db.Column(db.Boolean, default=False)
    
    # Campos do Requerimento - Identificação do Título
    req_especie = db.Column(db.String(100))
    req_banco = db.Column(db.String(100))
    req_numero_titulo = db.Column(db.String(100))
    req_data_emissao = db.Column(db.Date)
    req_data_vencimento = db.Column(db.Date)
    req_praca_pagamento = db.Column(db.String(100))
    req_valor_titulo = db.Column(db.Float)
    req_valor_protestar = db.Column(db.Float)
    req_observacoes_titulo = db.Column(db.Text)
    
    # Campos do Requerimento - Identificação do Devedor
    req_devedor_nome = db.Column(db.String(200))
    req_devedor_cpf = db.Column(db.String(20))
    req_devedor_telefone = db.Column(db.String(20))
    req_devedor_cep = db.Column(db.String(10))
    req_devedor_endereco = db.Column(db.String(300))
    req_devedor_bairro = db.Column(db.String(100))
    req_devedor_cidade = db.Column(db.String(100))
    req_devedor_estado = db.Column(db.String(2))
    
    # Campos do Requerimento - Identificação do Credor
    req_credor_nome = db.Column(db.String(200))
    req_credor_documento = db.Column(db.String(20))
    req_credor_telefone = db.Column(db.String(20))
    req_credor_cep = db.Column(db.String(10))
    req_credor_endereco = db.Column(db.String(300))
    req_credor_bairro = db.Column(db.String(100))
    req_credor_cidade = db.Column(db.String(100))
    req_credor_estado = db.Column(db.String(2))
    
    # Campos do Requerimento - Dados Bancários
    req_banco_transferencia = db.Column(db.String(100))
    req_agencia = db.Column(db.String(20))
    req_conta = db.Column(db.String(30))
    req_titular_conta = db.Column(db.String(200))
    req_titular_documento = db.Column(db.String(20))
    
    # Relacionamento com Cliente
    cliente = db.relationship('Cliente', backref=db.backref('protestos', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'protocolo': self.protocolo,
            'cliente_id': self.cliente_id,
            'cliente': self.cliente.nome if self.cliente else None,
            'tipo_documento': self.tipo_documento,
            'numero_documento': self.numero_documento,
            'documento': f"{self.tipo_documento} {self.numero_documento}",
            'valor': self.valor,
            'status': self.status,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'endereco_devedor': self.endereco_devedor,
            'observacoes': self.observacoes,
            'urgente': self.urgente,
            # Dados do requerimento
            'requerimento': {
                'titulo': {
                    'especie': self.req_especie,
                    'banco': self.req_banco,
                    'numero_titulo': self.req_numero_titulo,
                    'data_emissao': self.req_data_emissao.isoformat() if self.req_data_emissao else None,
                    'data_vencimento': self.req_data_vencimento.isoformat() if self.req_data_vencimento else None,
                    'praca_pagamento': self.req_praca_pagamento,
                    'valor_titulo': self.req_valor_titulo,
                    'valor_protestar': self.req_valor_protestar,
                    'observacoes': self.req_observacoes_titulo
                },
                'devedor': {
                    'nome': self.req_devedor_nome,
                    'cpf': self.req_devedor_cpf,
                    'telefone': self.req_devedor_telefone,
                    'cep': self.req_devedor_cep,
                    'endereco': self.req_devedor_endereco,
                    'bairro': self.req_devedor_bairro,
                    'cidade': self.req_devedor_cidade,
                    'estado': self.req_devedor_estado
                },
                'credor': {
                    'nome': self.req_credor_nome,
                    'documento': self.req_credor_documento,
                    'telefone': self.req_credor_telefone,
                    'cep': self.req_credor_cep,
                    'endereco': self.req_credor_endereco,
                    'bairro': self.req_credor_bairro,
                    'cidade': self.req_credor_cidade,
                    'estado': self.req_credor_estado
                },
                'dados_bancarios': {
                    'banco': self.req_banco_transferencia,
                    'agencia': self.req_agencia,
                    'conta': self.req_conta,
                    'titular': self.req_titular_conta,
                    'documento': self.req_titular_documento
                }
            }
        }
    
    @staticmethod
    def gerar_protocolo():
        """Gera um protocolo único para o protesto"""
        ultimo_protesto = Protesto.query.order_by(Protesto.id.desc()).first()
        if ultimo_protesto:
            ultimo_numero = int(ultimo_protesto.protocolo.replace('#', ''))
            return f"#{ultimo_numero + 1:03d}"
        return "#001"

