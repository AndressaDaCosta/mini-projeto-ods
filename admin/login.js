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

		// Validação visual do email
		validateEmail(email);

		// Validação visual da senha com requisitos detalhados
		validatePassword(password);

		// Habilitar/desabilitar botão baseado na validação completa
		const emailValid = email && isValidEmail(email);
		const passwordValid = password && isPasswordValid(password);

		if (emailValid && passwordValid) {
			loginButton.disabled = false;
		} else {
			loginButton.disabled = true;
		}
	}

	function validateEmail(email) {
		if (email) {
			if (isValidEmail(email)) {
				emailInput.classList.remove('error');
				emailInput.classList.add('success');
			} else {
				emailInput.classList.add('error');
				emailInput.classList.remove('success');
			}
		} else {
			// Campo vazio - mostrar erro já que é obrigatório
			emailInput.classList.add('error');
			emailInput.classList.remove('success');
		}
	}

	function validatePassword(password) {
		// Criar ou atualizar lista de requisitos
		let requirementsList = document.getElementById('passwordRequirements');
		if (!requirementsList) {
			requirementsList = createPasswordRequirementsList();
		}

		// Verificar cada requisito (mais simples para demo)
		const requirements = {
			length: password.length >= 3, // Mais simples para demonstração
			hasContent: password.length > 0
		};

		// Atualizar visual dos requisitos
		updateRequirementItem(
			'req-length',
			requirements.length,
			'Mínimo de 3 caracteres'
		);
		updateRequirementItem(
			'req-uppercase',
			password.length >= 6,
			'Pelo menos 6 caracteres (recomendado)'
		);
		updateRequirementItem(
			'req-lowercase',
			/[a-z]/.test(password),
			'Pelo menos uma letra minúscula'
		);
		updateRequirementItem(
			'req-number',
			/[0-9]/.test(password),
			'Pelo menos um número'
		);
		updateRequirementItem(
			'req-special',
			/[@#$%&*!?]/.test(password),
			'Pelo menos um caractere especial (@, #, $, %, etc)'
		);

		// Validação visual do input (mais simples)
		if (password) {
			if (password.length >= 3) {
				passwordInput.classList.remove('error');
				passwordInput.classList.add('success');
			} else {
				passwordInput.classList.add('error');
				passwordInput.classList.remove('success');
			}
		} else {
			// Campo vazio - mostrar erro já que é obrigatório
			passwordInput.classList.add('error');
			passwordInput.classList.remove('success');
		}
	}

	function isPasswordValid(password) {
		// Validação mais simples 
		return password.length >= 3;
	}

	// Função utilitária para validar email
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function createPasswordRequirementsList() {
		const requirementsList = document.createElement('div');
		requirementsList.id = 'passwordRequirements';
		requirementsList.className = 'password-requirements';
		requirementsList.innerHTML = `
        <div class="requirement-item" id="req-length">
            <i class="fas fa-times requirement-icon"></i>
            <span>Mínimo de 8 caracteres</span>
        </div>
        <div class="requirement-item" id="req-uppercase">
            <i class="fas fa-times requirement-icon"></i>
            <span>Pelo menos uma letra maiúscula</span>
        </div>
        <div class="requirement-item" id="req-lowercase">
            <i class="fas fa-times requirement-icon"></i>
            <span>Pelo menos uma letra minúscula</span>
        </div>
        <div class="requirement-item" id="req-number">
            <i class="fas fa-times requirement-icon"></i>
            <span>Pelo menos um número</span>
        </div>
        <div class="requirement-item" id="req-special">
            <i class="fas fa-times requirement-icon"></i>
            <span>Pelo menos um caractere especial (@, #, $, %, etc)</span>
        </div>
    `;

		// Inserir após o campo de senha
		passwordInput.parentNode.insertBefore(
			requirementsList,
			passwordInput.nextSibling
		);
		return requirementsList;
	}

	function updateRequirementItem(itemId, isValid, text) {
		const item = document.getElementById(itemId);
		if (!item) return;

		const icon = item.querySelector('.requirement-icon');
		const span = item.querySelector('span');

		if (isValid) {
			item.classList.remove('invalid');
			item.classList.add('valid');
			icon.className = 'fas fa-check requirement-icon';
			span.textContent = text;
		} else {
			item.classList.remove('valid');
			item.classList.add('invalid');
			icon.className = 'fas fa-times requirement-icon';
			span.textContent = text;
		}
	}
	// Event listeners para validação em tempo real
	emailInput.addEventListener('input', validateFields);
	passwordInput.addEventListener('input', validateFields);
	emailInput.addEventListener('blur', validateFields);
	passwordInput.addEventListener('blur', validateFields);

	// Validação inicial para mostrar campos obrigatórios como erro
	function initialValidation() {
		emailInput.classList.add('error');
		passwordInput.classList.add('error');
		loginButton.disabled = true;
	}

	// Executar validação inicial
	initialValidation();

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
		if (!email || !password || email.length === 0 || password.length < 3) {
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
			'<span style="color: white;">Entrando...</span>';

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
