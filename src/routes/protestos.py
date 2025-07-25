from flask import Blueprint, request, jsonify
from src.models.protesto import Protesto, db
from src.models.cliente import Cliente
from datetime import datetime

protestos_bp = Blueprint('protestos', __name__)

@protestos_bp.route('/protestos', methods=['GET'])
def listar_protestos():
    """Lista todos os protestos com filtros opcionais"""
    try:
        # Parâmetros de filtro
        status = request.args.get('status')
        cliente_nome = request.args.get('cliente')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Query base
        query = Protesto.query.join(Cliente)
        
        # Aplicar filtros
        if status:
            query = query.filter(Protesto.status == status)
        
        if cliente_nome:
            query = query.filter(Cliente.nome.ilike(f'%{cliente_nome}%'))
        
        # Ordenação
        query = query.order_by(Protesto.data_criacao.desc())
        
        # Paginação
        protestos_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [protesto.to_dict() for protesto in protestos_paginados.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': protestos_paginados.total,
                'pages': protestos_paginados.pages
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@protestos_bp.route('/protestos', methods=['POST'])
def criar_protesto():
    """Cria um novo protesto"""
    try:
        data = request.get_json()
        
        # Validações básicas
        required_fields = ['cliente_id', 'tipo_documento', 'numero_documento', 'valor', 'data_vencimento']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se o cliente existe
        cliente = Cliente.query.get(data['cliente_id'])
        if not cliente:
            return jsonify({'success': False, 'error': 'Cliente não encontrado'}), 404
        
        # Criar novo protesto
        protesto = Protesto(
            protocolo=Protesto.gerar_protocolo(),
            cliente_id=data['cliente_id'],
            tipo_documento=data['tipo_documento'],
            numero_documento=data['numero_documento'],
            valor=float(data['valor']),
            data_vencimento=datetime.fromisoformat(data['data_vencimento'].replace('Z', '+00:00')),
            endereco_devedor=data.get('endereco_devedor'),
            observacoes=data.get('observacoes'),
            urgente=data.get('urgente', False)
        )
        
        # Adicionar campos do requerimento se fornecidos
        campos_requerimento = [
            'req_especie', 'req_banco', 'req_numero_titulo', 'req_data_emissao', 'req_data_vencimento',
            'req_praca_pagamento', 'req_valor_titulo', 'req_valor_protestar', 'req_observacoes_titulo',
            'req_devedor_nome', 'req_devedor_cpf', 'req_devedor_telefone', 'req_devedor_cep',
            'req_devedor_endereco', 'req_devedor_bairro', 'req_devedor_cidade', 'req_devedor_estado',
            'req_credor_nome', 'req_credor_documento', 'req_credor_telefone', 'req_credor_cep',
            'req_credor_endereco', 'req_credor_bairro', 'req_credor_cidade', 'req_credor_estado',
            'req_banco_transferencia', 'req_agencia', 'req_conta', 'req_titular_conta', 'req_titular_documento'
        ]
        
        for campo in campos_requerimento:
            if campo in data and data[campo]:
                if 'data_' in campo and data[campo]:
                    # Converter datas
                    try:
                        setattr(protesto, campo, datetime.fromisoformat(data[campo]).date())
                    except:
                        pass
                elif 'valor_' in campo and data[campo]:
                    # Converter valores
                    try:
                        setattr(protesto, campo, float(data[campo]))
                    except:
                        pass
                else:
                    setattr(protesto, campo, data[campo])
        
        db.session.add(protesto)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Protesto criado com sucesso',
            'data': protesto.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@protestos_bp.route('/protestos/<int:protesto_id>', methods=['GET'])
def obter_protesto(protesto_id):
    """Obtém um protesto específico"""
    try:
        protesto = Protesto.query.get_or_404(protesto_id)
        return jsonify({
            'success': True,
            'data': protesto.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@protestos_bp.route('/protestos/<int:protesto_id>', methods=['PUT'])
def atualizar_protesto(protesto_id):
    """Atualiza um protesto existente"""
    try:
        protesto = Protesto.query.get_or_404(protesto_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        campos_permitidos = ['tipo_documento', 'numero_documento', 'valor', 'data_vencimento', 
                           'endereco_devedor', 'observacoes', 'urgente', 'status']
        
        for campo in campos_permitidos:
            if campo in data:
                if campo == 'data_vencimento':
                    setattr(protesto, campo, datetime.fromisoformat(data[campo].replace('Z', '+00:00')))
                elif campo == 'valor':
                    setattr(protesto, campo, float(data[campo]))
                else:
                    setattr(protesto, campo, data[campo])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Protesto atualizado com sucesso',
            'data': protesto.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@protestos_bp.route('/protestos/<int:protesto_id>', methods=['DELETE'])
def deletar_protesto(protesto_id):
    """Deleta um protesto"""
    try:
        protesto = Protesto.query.get_or_404(protesto_id)
        db.session.delete(protesto)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Protesto deletado com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@protestos_bp.route('/protestos/estatisticas', methods=['GET'])
def obter_estatisticas():
    """Obtém estatísticas dos protestos"""
    try:
        total_protestos = Protesto.query.count()
        protestos_ativos = Protesto.query.filter_by(status='pending').count()
        protestos_concluidos = Protesto.query.filter_by(status='completed').count()
        
        # Valor total em cobrança
        valor_total = db.session.query(db.func.sum(Protesto.valor)).filter_by(status='pending').scalar() or 0
        
        # Taxa de sucesso
        taxa_sucesso = 0
        if total_protestos > 0:
            taxa_sucesso = round((protestos_concluidos / total_protestos) * 100, 1)
        
        return jsonify({
            'success': True,
            'data': {
                'total_protestos': total_protestos,
                'protestos_ativos': protestos_ativos,
                'protestos_concluidos': protestos_concluidos,
                'valor_cobranca': valor_total,
                'taxa_sucesso': taxa_sucesso
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

