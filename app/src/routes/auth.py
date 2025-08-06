from flask import Blueprint, jsonify, request, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user import User, db
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__)

def validar_email(email):
    """Valida formato do email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validar_senha(senha):
    """Valida se a senha atende aos critérios mínimos"""
    if len(senha) < 8:
        return False, "Senha deve ter pelo menos 8 caracteres"
    if not re.search(r'[A-Z]', senha):
        return False, "Senha deve conter pelo menos uma letra maiúscula"
    if not re.search(r'[a-z]', senha):
        return False, "Senha deve conter pelo menos uma letra minúscula"
    if not re.search(r'\d', senha):
        return False, "Senha deve conter pelo menos um número"
    return True, "Senha válida"

@auth_bp.route('/auth/status', methods=['GET'])
def auth_status():
    """Verifica se o usuário está autenticado"""
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'nome_completo': user.nome_completo,
                    'empresa': user.empresa
                }
            })
    
    return jsonify({'authenticated': False})

@auth_bp.route('/auth/cadastro', methods=['POST'])
def cadastro():
    """Cadastro de novo usuário"""
    try:
        data = request.json
        
        # Validar dados obrigatórios
        campos_obrigatorios = ['nome', 'email', 'telefone', 'empresa', 'senha']
        for campo in campos_obrigatorios:
            if not data.get(campo):
                return jsonify({
                    'success': False,
                    'error': f'Campo {campo} é obrigatório'
                }), 400
        
        # Validar email
        if not validar_email(data['email']):
            return jsonify({
                'success': False,
                'error': 'Email inválido'
            }), 400
        
        # Validar senha
        senha_valida, mensagem_senha = validar_senha(data['senha'])
        if not senha_valida:
            return jsonify({
                'success': False,
                'error': mensagem_senha
            }), 400
        
        # Verificar se email já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'error': 'Email já cadastrado'
            }), 400
        
        # Criar novo usuário
        novo_usuario = User(
            username=data['email'],  # Usar email como username
            email=data['email'],
            nome_completo=data['nome'],
            telefone=data['telefone'],
            empresa=data['empresa'],
            senha_hash=generate_password_hash(data['senha']),
            data_cadastro=datetime.utcnow(),
            ativo=True
        )
        
        db.session.add(novo_usuario)
        db.session.commit()
        
        # Fazer login automático após cadastro
        session['user_id'] = novo_usuario.id
        session['user_email'] = novo_usuario.email
        
        return jsonify({
            'success': True,
            'message': 'Cadastro realizado com sucesso',
            'user': {
                'id': novo_usuario.id,
                'username': novo_usuario.username,
                'email': novo_usuario.email,
                'nome_completo': novo_usuario.nome_completo,
                'empresa': novo_usuario.empresa
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login do usuário"""
    try:
        data = request.json
        
        if not data.get('email') or not data.get('senha'):
            return jsonify({
                'success': False,
                'error': 'Email e senha são obrigatórios'
            }), 400
        
        # Buscar usuário
        usuario = User.query.filter_by(email=data['email']).first()
        
        if not usuario or not check_password_hash(usuario.senha_hash, data['senha']):
            return jsonify({
                'success': False,
                'error': 'Email ou senha incorretos'
            }), 401
        
        if not usuario.ativo:
            return jsonify({
                'success': False,
                'error': 'Conta desativada'
            }), 401
        
        # Fazer login
        session['user_id'] = usuario.id
        session['user_email'] = usuario.email
        
        # Atualizar último acesso
        usuario.ultimo_acesso = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Login realizado com sucesso',
            'user': {
                'id': usuario.id,
                'username': usuario.username,
                'email': usuario.email,
                'nome_completo': usuario.nome_completo,
                'empresa': usuario.empresa
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """Logout do usuário"""
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logout realizado com sucesso'
    })

@auth_bp.route('/auth/gov-br', methods=['POST'])
def login_gov_br():
    """Simulação de login com GOV.BR"""
    try:
        data = request.json
        cpf = data.get('cpf')
        
        if not cpf:
            return jsonify({
                'success': False,
                'error': 'CPF é obrigatório'
            }), 400
        
        # Simular validação GOV.BR (em produção seria integração real)
        # Por enquanto, criar usuário automaticamente se não existir
        usuario = User.query.filter_by(documento=cpf).first()
        
        if not usuario:
            # Criar usuário automaticamente com dados do GOV.BR
            usuario = User(
                username=f"govbr_{cpf}",
                email=f"{cpf}@gov.br",
                nome_completo=data.get('nome', 'Usuário GOV.BR'),
                documento=cpf,
                tipo_auth='gov_br',
                data_cadastro=datetime.utcnow(),
                ativo=True
            )
            db.session.add(usuario)
            db.session.commit()
        
        # Fazer login
        session['user_id'] = usuario.id
        session['user_email'] = usuario.email
        session['auth_method'] = 'gov_br'
        
        return jsonify({
            'success': True,
            'message': 'Login GOV.BR realizado com sucesso',
            'user': {
                'id': usuario.id,
                'username': usuario.username,
                'email': usuario.email,
                'nome_completo': usuario.nome_completo,
                'auth_method': 'gov_br'
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@auth_bp.route('/auth/certificado-digital', methods=['POST'])
def login_certificado_digital():
    """Simulação de login com Certificado Digital"""
    try:
        data = request.json
        certificado = data.get('certificado')
        
        if not certificado:
            return jsonify({
                'success': False,
                'error': 'Certificado digital é obrigatório'
            }), 400
        
        # Simular validação do certificado (em produção seria validação real)
        # Por enquanto, criar usuário automaticamente se não existir
        usuario = User.query.filter_by(certificado_digital=certificado).first()
        
        if not usuario:
            # Criar usuário automaticamente com dados do certificado
            usuario = User(
                username=f"cert_{certificado[:10]}",
                email=data.get('email', f"{certificado}@certificado.com"),
                nome_completo=data.get('nome', 'Usuário Certificado Digital'),
                empresa=data.get('empresa', 'Empresa Certificada'),
                certificado_digital=certificado,
                tipo_auth='certificado_digital',
                data_cadastro=datetime.utcnow(),
                ativo=True
            )
            db.session.add(usuario)
            db.session.commit()
        
        # Fazer login
        session['user_id'] = usuario.id
        session['user_email'] = usuario.email
        session['auth_method'] = 'certificado_digital'
        
        return jsonify({
            'success': True,
            'message': 'Login com Certificado Digital realizado com sucesso',
            'user': {
                'id': usuario.id,
                'username': usuario.username,
                'email': usuario.email,
                'nome_completo': usuario.nome_completo,
                'empresa': usuario.empresa,
                'auth_method': 'certificado_digital'
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

def login_required(f):
    """Decorator para rotas que requerem autenticação"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'error': 'Acesso negado. Faça login primeiro.',
                'redirect': '/login'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

