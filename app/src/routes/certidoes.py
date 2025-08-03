from flask import Blueprint, request, jsonify
from src.models.certidao import Certidao, db
from datetime import datetime

certidoes_bp = Blueprint('certidoes', __name__)

@certidoes_bp.route('/certidoes', methods=['GET'])
def listar_certidoes():
    """Lista todas as certidões com filtros opcionais"""
    try:
        # Parâmetros de filtro
        status = request.args.get('status')
        tipo = request.args.get('tipo')
        documento = request.args.get('documento')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Query base
        query = Certidao.query
        
        # Aplicar filtros
        if status:
            query = query.filter(Certidao.status == status)
        
        if tipo:
            query = query.filter(Certidao.tipo == tipo)
            
        if documento:
            query = query.filter(Certidao.documento_requerente.ilike(f'%{documento}%'))
        
        # Ordenação
        query = query.order_by(Certidao.data_solicitacao.desc())
        
        # Paginação
        certidoes_paginadas = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [certidao.to_dict() for certidao in certidoes_paginadas.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': certidoes_paginadas.total,
                'pages': certidoes_paginadas.pages
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes', methods=['POST'])
def criar_certidao():
    """Cria uma nova solicitação de certidão"""
    try:
        data = request.get_json()
        
        # Validações básicas
        required_fields = ['tipo', 'nome_requerente', 'documento_requerente', 'tipo_pessoa', 'finalidade']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Campo {field} é obrigatório'}), 400
        
        # Criar nova certidão
        certidao = Certidao(
            protocolo=Certidao.gerar_protocolo(),
            tipo=data['tipo'],
            nome_requerente=data['nome_requerente'],
            documento_requerente=data['documento_requerente'],
            tipo_pessoa=data['tipo_pessoa'],
            finalidade=data['finalidade'],
            observacoes=data.get('observacoes'),
            urgente=data.get('urgente', False),
            enviar_email=data.get('enviar_email', True)
        )
        
        db.session.add(certidao)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Solicitação de certidão criada com sucesso',
            'data': certidao.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/<int:certidao_id>', methods=['GET'])
def obter_certidao(certidao_id):
    """Obtém uma certidão específica"""
    try:
        certidao = Certidao.query.get_or_404(certidao_id)
        return jsonify({
            'success': True,
            'data': certidao.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/<int:certidao_id>', methods=['PUT'])
def atualizar_certidao(certidao_id):
    """Atualiza uma certidão existente"""
    try:
        certidao = Certidao.query.get_or_404(certidao_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        campos_permitidos = ['tipo', 'nome_requerente', 'documento_requerente', 'tipo_pessoa',
                           'finalidade', 'observacoes', 'urgente', 'enviar_email', 'status']
        
        for campo in campos_permitidos:
            if campo in data:
                setattr(certidao, campo, data[campo])
        
        # Se o status mudou para completed, definir data de emissão
        if 'status' in data and data['status'] == 'completed' and not certidao.data_emissao:
            certidao.data_emissao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Certidão atualizada com sucesso',
            'data': certidao.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/<int:certidao_id>', methods=['DELETE'])
def deletar_certidao(certidao_id):
    """Deleta uma certidão"""
    try:
        certidao = Certidao.query.get_or_404(certidao_id)
        
        # Só permitir deletar se ainda estiver pendente
        if certidao.status != 'pending':
            return jsonify({
                'success': False, 
                'error': 'Só é possível deletar certidões pendentes'
            }), 400
        
        db.session.delete(certidao)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Certidão deletada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/<int:certidao_id>/download', methods=['GET'])
def download_certidao(certidao_id):
    """Simula o download de uma certidão"""
    try:
        certidao = Certidao.query.get_or_404(certidao_id)
        
        if certidao.status != 'completed':
            return jsonify({
                'success': False, 
                'error': 'Certidão ainda não está pronta para download'
            }), 400
        
        # Aqui seria implementada a lógica real de geração/download do PDF
        return jsonify({
            'success': True,
            'message': 'Download da certidão iniciado',
            'download_url': f'/api/certidoes/{certidao_id}/pdf'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/<int:certidao_id>/enviar-email', methods=['POST'])
def enviar_email_certidao(certidao_id):
    """Simula o envio de certidão por email"""
    try:
        certidao = Certidao.query.get_or_404(certidao_id)
        
        if certidao.status != 'completed':
            return jsonify({
                'success': False, 
                'error': 'Certidão ainda não está pronta para envio'
            }), 400
        
        # Aqui seria implementada a lógica real de envio por email
        return jsonify({
            'success': True,
            'message': f'Certidão {certidao.protocolo} enviada por email com sucesso'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@certidoes_bp.route('/certidoes/estatisticas', methods=['GET'])
def obter_estatisticas_certidoes():
    """Obtém estatísticas das certidões"""
    try:
        total_certidoes = Certidao.query.count()
        certidoes_pendentes = Certidao.query.filter_by(status='pending').count()
        certidoes_emitidas = Certidao.query.filter_by(status='completed').count()
        certidoes_rejeitadas = Certidao.query.filter_by(status='rejected').count()
        
        # Certidões por tipo
        certidoes_positivas = Certidao.query.filter_by(tipo='positiva').count()
        certidoes_negativas = Certidao.query.filter_by(tipo='negativa').count()
        certidoes_detalhadas = Certidao.query.filter_by(tipo='detalhada').count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_certidoes': total_certidoes,
                'certidoes_pendentes': certidoes_pendentes,
                'certidoes_emitidas': certidoes_emitidas,
                'certidoes_rejeitadas': certidoes_rejeitadas,
                'por_tipo': {
                    'positivas': certidoes_positivas,
                    'negativas': certidoes_negativas,
                    'detalhadas': certidoes_detalhadas
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

