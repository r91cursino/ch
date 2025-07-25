from flask import Blueprint, request, jsonify
from src.models.protesto import Protesto
from src.models.cliente import Cliente
import random
from datetime import datetime, timedelta

pesquisa_bp = Blueprint('pesquisa', __name__)

@pesquisa_bp.route('/pesquisa/protestos', methods=['POST'])
def pesquisar_protestos():
    """Pesquisa protestos por CPF, CNPJ ou nome"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if 'tipo' not in data or 'valor' not in data:
            return jsonify({'success': False, 'error': 'Tipo e valor são obrigatórios'}), 400
        
        tipo = data['tipo']
        valor = data['valor'].strip()
        
        if not valor:
            return jsonify({'success': False, 'error': 'Valor de busca não pode estar vazio'}), 400
        
        # Simular dados de pesquisa (em um sistema real, isso consultaria cartórios)
        protestos_encontrados = simular_pesquisa_cartorio(tipo, valor)
        
        # Salvar histórico da pesquisa (opcional)
        historico = {
            'data_hora': datetime.utcnow().isoformat(),
            'tipo': tipo,
            'valor_consultado': valor,
            'resultados_encontrados': len(protestos_encontrados)
        }
        
        return jsonify({
            'success': True,
            'data': {
                'consulta': {
                    'tipo': tipo,
                    'valor': valor,
                    'data_consulta': datetime.utcnow().isoformat(),
                    'total_encontrados': len(protestos_encontrados)
                },
                'protestos': protestos_encontrados,
                'historico': historico
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@pesquisa_bp.route('/pesquisa/historico', methods=['GET'])
def obter_historico_pesquisas():
    """Obtém o histórico de pesquisas realizadas"""
    try:
        # Em um sistema real, isso viria do banco de dados
        historico_simulado = [
            {
                'id': 1,
                'data_hora': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'tipo': 'cpf',
                'valor_consultado': '123.456.789-00',
                'resultados_encontrados': 2
            },
            {
                'id': 2,
                'data_hora': (datetime.utcnow() - timedelta(hours=5)).isoformat(),
                'tipo': 'cnpj',
                'valor_consultado': '12.345.678/0001-90',
                'resultados_encontrados': 0
            },
            {
                'id': 3,
                'data_hora': (datetime.utcnow() - timedelta(days=1)).isoformat(),
                'tipo': 'nome',
                'valor_consultado': 'João Silva',
                'resultados_encontrados': 1
            }
        ]
        
        return jsonify({
            'success': True,
            'data': historico_simulado
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@pesquisa_bp.route('/pesquisa/estatisticas', methods=['GET'])
def obter_estatisticas_pesquisa():
    """Obtém estatísticas das pesquisas realizadas"""
    try:
        # Estatísticas simuladas
        estatisticas = {
            'consultas_hoje': random.randint(40, 60),
            'consultas_mes': random.randint(300, 400),
            'taxa_protestos_encontrados': random.randint(60, 80),
            'tipos_mais_consultados': {
                'cpf': random.randint(40, 60),
                'cnpj': random.randint(25, 40),
                'nome': random.randint(10, 20)
            }
        }
        
        return jsonify({
            'success': True,
            'data': estatisticas
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def simular_pesquisa_cartorio(tipo, valor):
    """Simula uma consulta aos cartórios de protesto"""
    
    # Lista de cartórios simulados
    cartorios = [
        "1º Cartório de Protestos de São Paulo",
        "2º Cartório de Protestos de São Paulo", 
        "3º Cartório de Protestos de São Paulo",
        "Cartório de Protestos de Santos",
        "Cartório de Protestos de Campinas"
    ]
    
    # Simular resultados baseados no tipo de consulta
    protestos = []
    
    # Probabilidade de encontrar protestos (70% de chance)
    if random.random() < 0.7:
        num_protestos = random.randint(1, 3)
        
        for i in range(num_protestos):
            # Gerar dados aleatórios mas realistas
            data_protesto = datetime.utcnow() - timedelta(days=random.randint(30, 365))
            valor_protesto = random.uniform(1000, 50000)
            
            protesto = {
                'protocolo': f"#P{random.randint(1000, 9999)}",
                'cartorio': random.choice(cartorios),
                'valor': round(valor_protesto, 2),
                'data_protesto': data_protesto.strftime('%Y-%m-%d'),
                'status': random.choice(['ativo', 'quitado', 'cancelado']),
                'devedor': valor if tipo == 'nome' else f"Devedor {i+1}",
                'documento_origem': f"{random.choice(['Duplicata', 'Nota Promissória', 'Cheque'])} {random.randint(1000, 9999)}",
                'apresentante': f"Empresa Credora {i+1} LTDA"
            }
            
            protestos.append(protesto)
    
    return protestos

@pesquisa_bp.route('/pesquisa/validar-documento', methods=['POST'])
def validar_documento():
    """Valida formato de CPF ou CNPJ"""
    try:
        data = request.get_json()
        documento = data.get('documento', '').strip()
        
        if not documento:
            return jsonify({'success': False, 'error': 'Documento é obrigatório'}), 400
        
        # Remover formatação
        documento_limpo = ''.join(filter(str.isdigit, documento))
        
        # Validar CPF (11 dígitos)
        if len(documento_limpo) == 11:
            return jsonify({
                'success': True,
                'data': {
                    'tipo': 'cpf',
                    'documento_formatado': f"{documento_limpo[:3]}.{documento_limpo[3:6]}.{documento_limpo[6:9]}-{documento_limpo[9:]}",
                    'valido': True  # Em um sistema real, faria validação real do CPF
                }
            })
        
        # Validar CNPJ (14 dígitos)
        elif len(documento_limpo) == 14:
            return jsonify({
                'success': True,
                'data': {
                    'tipo': 'cnpj',
                    'documento_formatado': f"{documento_limpo[:2]}.{documento_limpo[2:5]}.{documento_limpo[5:8]}/{documento_limpo[8:12]}-{documento_limpo[12:]}",
                    'valido': True  # Em um sistema real, faria validação real do CNPJ
                }
            })
        
        else:
            return jsonify({
                'success': False,
                'error': 'Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)'
            }), 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

