from src.models.user import db
from datetime import datetime

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # fisica, juridica
    documento = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    endereco = db.Column(db.Text)
    cep = db.Column(db.String(10))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(2))
    bairro = db.Column(db.String(100))
    data_cadastro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Campos específicos para Pessoa Jurídica
    nome_fantasia = db.Column(db.String(200))
    inscricao_estadual = db.Column(db.String(20))
    representante_legal = db.Column(db.String(200))
    
    # Campos adicionais
    observacoes = db.Column(db.Text)
    ativo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'tipo': self.tipo,
            'documento': self.documento,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'cep': self.cep,
            'cidade': self.cidade,
            'estado': self.estado,
            'bairro': self.bairro,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None,
            'nome_fantasia': self.nome_fantasia,
            'inscricao_estadual': self.inscricao_estadual,
            'representante_legal': self.representante_legal,
            'observacoes': self.observacoes,
            'ativo': self.ativo,
            'protestos_ativos': len([p for p in self.protestos if p.status == 'pending']) if hasattr(self, 'protestos') else 0
        }
    
    def get_protestos_count(self):
        """Retorna o número de protestos ativos do cliente"""
        from src.models.protesto import Protesto
        return Protesto.query.filter_by(cliente_id=self.id, status='pending').count()

