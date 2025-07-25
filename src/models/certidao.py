from src.models.user import db
from datetime import datetime

class Certidao(db.Model):
    __tablename__ = 'certidoes'
    
    id = db.Column(db.Integer, primary_key=True)
    protocolo = db.Column(db.String(20), unique=True, nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # positiva, negativa, detalhada
    nome_requerente = db.Column(db.String(200), nullable=False)
    documento_requerente = db.Column(db.String(20), nullable=False)
    tipo_pessoa = db.Column(db.String(20), nullable=False)  # fisica, juridica
    finalidade = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, completed, rejected
    data_solicitacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    data_emissao = db.Column(db.DateTime)
    observacoes = db.Column(db.Text)
    urgente = db.Column(db.Boolean, default=False)
    enviar_email = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'protocolo': self.protocolo,
            'tipo': self.tipo,
            'nome_requerente': self.nome_requerente,
            'documento_requerente': self.documento_requerente,
            'cliente': self.nome_requerente,
            'documento': self.documento_requerente,
            'tipo_pessoa': self.tipo_pessoa,
            'finalidade': self.finalidade,
            'status': self.status,
            'data_solicitacao': self.data_solicitacao.isoformat() if self.data_solicitacao else None,
            'data_emissao': self.data_emissao.isoformat() if self.data_emissao else None,
            'observacoes': self.observacoes,
            'urgente': self.urgente,
            'enviar_email': self.enviar_email
        }
    
    @staticmethod
    def gerar_protocolo():
        """Gera um protocolo único para a certidão"""
        ultima_certidao = Certidao.query.order_by(Certidao.id.desc()).first()
        if ultima_certidao:
            ultimo_numero = int(ultima_certidao.protocolo.replace('#CERT', ''))
            return f"#CERT{ultimo_numero + 1:03d}"
        return "#CERT001"

