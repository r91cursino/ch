// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Capturar plano selecionado
    document.querySelectorAll('[data-plan]').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            document.getElementById('cadastroForm').setAttribute('data-selected-plan', plan);
            
            // Atualizar título do modal baseado no plano
            const modalTitle = document.querySelector('#cadastroModal .modal-title');
            if (plan === 'basico') {
                modalTitle.textContent = 'Cadastre-se no Plano Básico';
            } else if (plan === 'profissional') {
                modalTitle.textContent = 'Cadastre-se no Plano Profissional';
            } else {
                modalTitle.textContent = 'Cadastre-se e Comece Agora';
            }
        });
    });

    // Animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.feature-card, .pricing-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Função para submeter cadastro
function submitCadastro() {
    const form = document.getElementById('cadastroForm');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const empresa = document.getElementById('empresa').value;
    const termos = document.getElementById('termos').checked;
    const selectedPlan = form.getAttribute('data-selected-plan') || 'basico';

    // Validação básica
    if (!nome || !email || !telefone || !empresa) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }

    if (!termos) {
        showAlert('Você deve aceitar os termos de uso e política de privacidade.', 'warning');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Por favor, insira um email válido.', 'warning');
        return;
    }

    // Mostrar loading
    const submitBtn = document.querySelector('#cadastroModal .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processando...';
    submitBtn.disabled = true;

    // Simular processamento
    setTimeout(() => {
        // Dados do cadastro
        const cadastroData = {
            nome: nome,
            email: email,
            telefone: telefone,
            empresa: empresa,
            plano: selectedPlan,
            timestamp: new Date().toISOString()
        };

        // Salvar no localStorage (simulação)
        localStorage.setItem('protestopro_cadastro', JSON.stringify(cadastroData));

        // Mostrar sucesso
        submitBtn.innerHTML = '<span class="success-checkmark"></span> Cadastro Realizado!';
        
        setTimeout(() => {
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroModal'));
            modal.hide();

            // Mostrar mensagem de sucesso
            showAlert('Cadastro realizado com sucesso! Redirecionando para a plataforma...', 'success');

            // Redirecionar para upload com parâmetros
            setTimeout(() => {
                const params = new URLSearchParams({
                    source: 'landing',
                    plan: selectedPlan,
                    nome: nome,
                    email: email
                });
                window.location.href = `/upload?${params.toString()}`;
            }, 2000);

        }, 1000);

    }, 2000);
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} custom-alert position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-radius: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(alertDiv);

    // Auto remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// CSS para animações de alerta
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Função para resetar formulário quando modal é fechado
document.getElementById('cadastroModal').addEventListener('hidden.bs.modal', function () {
    const form = document.getElementById('cadastroForm');
    form.reset();
    form.removeAttribute('data-selected-plan');
    
    // Resetar botão
    const submitBtn = document.querySelector('#cadastroModal .btn-primary');
    submitBtn.innerHTML = '<i class="fas fa-rocket me-2"></i>Cadastrar e Acessar Plataforma';
    submitBtn.disabled = false;
    
    // Resetar título
    document.querySelector('#cadastroModal .modal-title').textContent = 'Cadastre-se e Comece Agora';
});

// Função para tracking de eventos (Google Analytics, etc.)
function trackEvent(action, category = 'Landing Page', label = '') {
    // Implementar tracking aqui
    console.log('Event tracked:', { action, category, label });
    
    // Exemplo para Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track clicks nos botões CTA
document.querySelectorAll('[data-bs-target="#cadastroModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan') || 'geral';
        trackEvent('click_cta', 'Landing Page', `button_${plan}`);
    });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll >= 25 && maxScroll < 50) {
            trackEvent('scroll_depth', 'Engagement', '25%');
        } else if (maxScroll >= 50 && maxScroll < 75) {
            trackEvent('scroll_depth', 'Engagement', '50%');
        } else if (maxScroll >= 75 && maxScroll < 100) {
            trackEvent('scroll_depth', 'Engagement', '75%');
        } else if (maxScroll >= 100) {
            trackEvent('scroll_depth', 'Engagement', '100%');
        }
    }
});

