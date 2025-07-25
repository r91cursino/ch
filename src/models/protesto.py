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
            'urgente': self.urgente
        }
    
    @staticmethod
    def gerar_protocolo():
        """Gera um protocolo único para o protesto"""
        ultimo_protesto = Protesto.query.order_by(Protesto.id.desc()).first()
        if ultimo_protesto:
            ultimo_numero = int(ultimo_protesto.protocolo.replace('#', ''))
            return f"#{ultimo_numero + 1:03d}"
        return "#001"

