// =================== FUNCIONALIDADES DE LOGIN ===================

// Aguarda o DOM estar completamente carregado para login
document.addEventListener('DOMContentLoaded', function () {
	// Verificar se é a página de login
	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		initializeLogin();
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
		loginButton.innerHTML = 'Entrando..';

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

	// Função para mostrar mensagens de erro
	function showError(message) {
		showNotification(message, 'error');
	}

	// Função para mostrar mensagens de sucesso
	function showSuccess(message) {
		showNotification(message, 'success');
	}
}
