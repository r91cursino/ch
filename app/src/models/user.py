from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nome_completo = db.Column(db.String(200), nullable=True)
    telefone = db.Column(db.String(20), nullable=True)
    empresa = db.Column(db.String(200), nullable=True)
    documento = db.Column(db.String(20), nullable=True)  # CPF/CNPJ
    certificado_digital = db.Column(db.String(500), nullable=True)
    senha_hash = db.Column(db.String(255), nullable=True)
    tipo_auth = db.Column(db.String(50), default='tradicional')  # tradicional, gov_br, certificado_digital
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    ultimo_acesso = db.Column(db.DateTime, nullable=True)
    ativo = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nome_completo': self.nome_completo,
            'telefone': self.telefone,
            'empresa': self.empresa,
            'documento': self.documento,
            'tipo_auth': self.tipo_auth,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None,
            'ultimo_acesso': self.ultimo_acesso.isoformat() if self.ultimo_acesso else None,
            'ativo': self.ativo
        }
