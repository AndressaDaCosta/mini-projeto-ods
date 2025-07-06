// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function () {
	// Verificar se é a página de login
	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		initializeLogin();
	}

	// Verificar se é a página de dashboard
	const dashboardContainer = document.querySelector('.dashboard-container');
	if (dashboardContainer) {
		initializeDashboard();
	}
});

// Inicializar funcionalidades da página de login
function initializeLogin() {
	const emailInput = document.getElementById('email');
	const passwordInput = document.getElementById('password');
	const loginButton = document.getElementById('loginButton');
	const loginForm = document.getElementById('loginForm');

	// Verificar se o usuário já está logado
	if (localStorage.getItem('adminEmail')) {
		window.location.href = 'dashboard.html';
		return;
	}

	// Validação em tempo real dos campos
	function validateFields() {
		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		// Habilitar/desabilitar botão baseado no preenchimento dos campos
		if (email && password) {
			loginButton.disabled = false;
		} else {
			loginButton.disabled = true;
		}

		// Validação visual do email
		if (email) {
			if (isValidEmail(email)) {
				emailInput.classList.remove('error');
				emailInput.classList.add('success');
			} else {
				emailInput.classList.add('error');
				emailInput.classList.remove('success');
			}
		} else {
			emailInput.classList.remove('error', 'success');
		}

		// Validação visual da senha
		if (password) {
			if (password.length >= 3) {
				passwordInput.classList.remove('error');
				passwordInput.classList.add('success');
			} else {
				passwordInput.classList.add('error');
				passwordInput.classList.remove('success');
			}
		} else {
			passwordInput.classList.remove('error', 'success');
		}
	}

	// Event listeners para validação em tempo real
	emailInput.addEventListener('input', validateFields);
	passwordInput.addEventListener('input', validateFields);

	// Submissão do formulário
	loginForm.addEventListener('submit', function (e) {
		e.preventDefault();
		handleLogin();
	});

	// Função para realizar o login
	function handleLogin() {
		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		// Validações básicas
		if (!email || !password) {
			showError('Por favor, preencha todos os campos');
			return;
		}

		if (!isValidEmail(email)) {
			showError('Por favor, insira um email válido');
			return;
		}

		// Mostrar estado de carregamento
		loginButton.disabled = true;
		loginButton.classList.add('loading');
		loginButton.innerHTML =
			'<i class="fas fa-spinner fa-spin"></i> Entrando...';

		// Simular delay de login (em projeto real seria uma chamada à API)
		setTimeout(() => {
			try {
				// Salvar email no localStorage
				localStorage.setItem('adminEmail', email);
				localStorage.setItem(
					'adminLoginTime',
					new Date().toISOString()
				);

				// Mostrar mensagem de sucesso
				showSuccess('Login realizado com sucesso!');

				// Redirecionar para dashboard após breve delay
				setTimeout(() => {
					window.location.href = 'dashboard.html';
				}, 1000);
			} catch (error) {
				console.error('Erro no login:', error);
				showError('Erro interno. Tente novamente.');
			} finally {
				// Restaurar botão (caso não redirecione)
				loginButton.disabled = false;
				loginButton.classList.remove('loading');
				loginButton.innerHTML =
					'<i class="fas fa-sign-in-alt"></i> Entrar';
			}
		}, 1500);
	}

	// Função para validar email
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Função para mostrar mensagens de erro
	function showError(message) {
		showNotification(message, 'error');
	}

	// Função para mostrar mensagens de sucesso
	function showSuccess(message) {
		showNotification(message, 'success');
	}

	// Função para mostrar notificações
	function showNotification(message, type = 'info') {
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.innerHTML = `
            <i class="fas ${
				type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'
			}"></i>
            <span>${message}</span>
        `;

		// Estilos da notificação
		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#E74C3C' : '#2ECC71'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        `;

		document.body.appendChild(notification);

		// Animação de entrada
		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
		}, 10);

		// Auto-remover após 3 segundos
		setTimeout(() => {
			notification.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (notification.parentNode) {
					document.body.removeChild(notification);
				}
			}, 300);
		}, 3000);
	}
}

// Inicializar funcionalidades da página de dashboard
function initializeDashboard() {
	// Verificar se o usuário está logado
	const adminEmail = localStorage.getItem('adminEmail');
	if (!adminEmail) {
		window.location.href = 'login.html';
		return;
	}

	// Mostrar email do usuário
	const userEmailElement = document.querySelector('.user-email');
	if (userEmailElement) {
		userEmailElement.textContent = adminEmail;
	}

	// Configurar botão de logout
	const logoutBtn = document.querySelector('.logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', handleLogout);
	}

	// Carregar dados dos parceiros
	loadPartners();
}

// Função para realizar logout
function handleLogout() {
	if (confirm('Tem certeza que deseja sair?')) {
		localStorage.removeItem('adminEmail');
		localStorage.removeItem('adminLoginTime');
		window.location.href = 'login.html';
	}
}
