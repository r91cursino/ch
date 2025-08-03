from flask import Blueprint, request, jsonify
from src.models.cliente import Cliente, db

clientes_bp = Blueprint('clientes', __name__)

@clientes_bp.route('/clientes', methods=['GET'])
def listar_clientes():
    """Lista todos os clientes com filtros opcionais"""
    try:
        # Parâmetros de filtro
        tipo = request.args.get('tipo')
        nome = request.args.get('nome')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Query base
        query = Cliente.query.filter_by(ativo=True)
        
        # Aplicar filtros
        if tipo:
            query = query.filter(Cliente.tipo == tipo)
        
        if nome:
            query = query.filter(Cliente.nome.ilike(f'%{nome}%'))
        
        # Ordenação
        query = query.order_by(Cliente.nome.asc())
        
        # Paginação
        clientes_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        # Adicionar contagem de protestos para cada cliente
        clientes_data = []
        for cliente in clientes_paginados.items:
            cliente_dict = cliente.to_dict()
            cliente_dict['protestos_ativos'] = cliente.get_protestos_count()
            clientes_data.append(cliente_dict)
        
        return jsonify({
            'success': True,
            'data': clientes_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': clientes_paginados.total,
                'pages': clientes_paginados.pages
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes', methods=['POST'])
def criar_cliente():
    """Cria um novo cliente"""
    try:
        data = request.get_json()
        
        # Validações básicas
        required_fields = ['nome', 'tipo', 'documento', 'email', 'telefone']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se o documento já existe
        cliente_existente = Cliente.query.filter_by(documento=data['documento']).first()
        if cliente_existente:
            return jsonify({'success': False, 'error': 'Cliente com este documento já existe'}), 400
        
        # Criar novo cliente
        cliente = Cliente(
            nome=data['nome'],
            tipo=data['tipo'],
            documento=data['documento'],
            email=data['email'],
            telefone=data['telefone'],
            endereco=data.get('endereco'),
            cep=data.get('cep'),
            cidade=data.get('cidade'),
            estado=data.get('estado'),
            bairro=data.get('bairro'),
            nome_fantasia=data.get('nome_fantasia'),
            inscricao_estadual=data.get('inscricao_estadual'),
            representante_legal=data.get('representante_legal'),
            observacoes=data.get('observacoes')
        )
        
        db.session.add(cliente)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Cliente criado com sucesso',
            'data': cliente.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['GET'])
def obter_cliente(cliente_id):
    """Obtém um cliente específico"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        cliente_dict = cliente.to_dict()
        cliente_dict['protestos_ativos'] = cliente.get_protestos_count()
        
        return jsonify({
            'success': True,
            'data': cliente_dict
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['PUT'])
def atualizar_cliente(cliente_id):
    """Atualiza um cliente existente"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        data = request.get_json()
        
        # Verificar se o documento já existe em outro cliente
        if 'documento' in data and data['documento'] != cliente.documento:
            cliente_existente = Cliente.query.filter_by(documento=data['documento']).first()
            if cliente_existente:
                return jsonify({'success': False, 'error': 'Cliente com este documento já existe'}), 400
        
        # Atualizar campos permitidos
        campos_permitidos = ['nome', 'tipo', 'documento', 'email', 'telefone', 'endereco', 
                           'cep', 'cidade', 'estado', 'bairro', 'nome_fantasia', 
                           'inscricao_estadual', 'representante_legal', 'observacoes', 'ativo']
        
        for campo in campos_permitidos:
            if campo in data:
                setattr(cliente, campo, data[campo])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Cliente atualizado com sucesso',
            'data': cliente.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def deletar_cliente(cliente_id):
    """Desativa um cliente (soft delete)"""
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        
        # Verificar se o cliente tem protestos ativos
        protestos_ativos = cliente.get_protestos_count()
        if protestos_ativos > 0:
            return jsonify({
                'success': False, 
                'error': f'Cliente possui {protestos_ativos} protestos ativos e não pode ser removido'
            }), 400
        
        # Soft delete - apenas desativar
        cliente.ativo = False
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Cliente desativado com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes/buscar', methods=['GET'])
def buscar_clientes():
    """Busca clientes por nome ou documento"""
    try:
        termo = request.args.get('q', '').strip()
        if not termo:
            return jsonify({'success': False, 'error': 'Termo de busca é obrigatório'}), 400
        
        # Buscar por nome ou documento
        clientes = Cliente.query.filter(
            db.or_(
                Cliente.nome.ilike(f'%{termo}%'),
                Cliente.documento.ilike(f'%{termo}%')
            )
        ).filter_by(ativo=True).limit(10).all()
        
        return jsonify({
            'success': True,
            'data': [cliente.to_dict() for cliente in clientes]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@clientes_bp.route('/clientes/estatisticas', methods=['GET'])
def obter_estatisticas_clientes():
    """Obtém estatísticas dos clientes"""
    try:
        total_clientes = Cliente.query.filter_by(ativo=True).count()
        clientes_pf = Cliente.query.filter_by(tipo='fisica', ativo=True).count()
        clientes_pj = Cliente.query.filter_by(tipo='juridica', ativo=True).count()
        
        # Clientes com protestos ativos
        from src.models.protesto import Protesto
        clientes_com_protestos = db.session.query(Cliente.id).join(Protesto).filter(
            Protesto.status == 'pending',
            Cliente.ativo == True
        ).distinct().count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_clientes': total_clientes,
                'clientes_pf': clientes_pf,
                'clientes_pj': clientes_pj,
                'clientes_com_protestos': clientes_com_protestos
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

