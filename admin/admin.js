// Funcionalidades comuns do sistema administrativo
// Este arquivo contém funcionalidades que são utilizadas em múltiplas páginas

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function () {
	// Inicializar funcionalidades comuns
	initializeCommonFeatures();
});

// Inicializar funcionalidades comuns a todas as páginas
function initializeCommonFeatures() {
	if (requiresAuthentication()) {
		checkAuthentication();
	}

	// Configurar atalhos de teclado globais
	setupGlobalKeyboardShortcuts();

	// Configurar handlers de erro globais
	setupGlobalErrorHandlers();

	// Configurar logout para páginas que precisam
	setupLogout();

	// Exibir informações do usuário se estiver logado
	displayUserInfo();
}

// Verificar se a página atual requer autenticação
function requiresAuthentication() {
	const currentPath = window.location.pathname;
	return (
		currentPath.includes('dashboard.html') ||
		currentPath.includes('partner-details.html')
	);
}

// Verificar autenticação do usuário
function checkAuthentication() {
	const adminEmail = localStorage.getItem('adminEmail');
	const loginTime = localStorage.getItem('adminLoginTime');

	if (!adminEmail || !loginTime) {
		// Redirecionar para login se não estiver autenticado
		window.location.href = 'login.html';
		return false;
	}

	// Verificar se a sessão não expirou (opcional - 24 horas)
	const sessionTime = new Date(loginTime);
	const currentTime = new Date();
	const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60);

	if (hoursDiff > 24) {
		// Sessão expirou
		localStorage.removeItem('adminEmail');
		localStorage.removeItem('adminLoginTime');
		showNotification(
			'Sessão expirada. Por favor, faça login novamente.',
			'warning'
		);
		setTimeout(() => {
			window.location.href = 'login.html';
		}, 2000);
		return false;
	}

	return true;
}

// Configurar atalhos de teclado globais
function setupGlobalKeyboardShortcuts() {
	document.addEventListener('keydown', function (e) {
		// Ctrl+H - Voltar para home/dashboard
		if (e.ctrlKey && e.key === 'h') {
			e.preventDefault();
			if (localStorage.getItem('adminEmail')) {
				window.location.href = 'dashboard.html';
			} else {
				window.location.href = 'login.html';
			}
		}

		// Ctrl+L - Ir para login
		if (e.ctrlKey && e.key === 'l') {
			e.preventDefault();
			window.location.href = 'login.html';
		}

		// Esc - Fechar modais
		if (e.key === 'Escape') {
			const modal = document.querySelector('.edit-modal.show');
			if (modal) {
				e.preventDefault();
				closeEditModal();
			}
		}
	});
}

// Configurar handlers de erro globais
function setupGlobalErrorHandlers() {
	// Capturar erros de JavaScript não tratados
	window.addEventListener('error', function (e) {
		console.error('Erro global capturado:', e.error);
		showNotification(
			'Ocorreu um erro inesperado. Por favor, recarregue a página.',
			'error'
		);
	});

	// Capturar promessas rejeitadas não tratadas
	window.addEventListener('unhandledrejection', function (e) {
		console.error('Promessa rejeitada não tratada:', e.reason);
		showNotification(
			'Erro de conexão. Verifique sua internet e tente novamente.',
			'error'
		);
	});
}

// Configurar logout
function setupLogout() {
	const logoutBtn = document.querySelector('.logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', handleLogout);
	}
}

// Exibir informações do usuário
function displayUserInfo() {
	const adminEmail = localStorage.getItem('adminEmail');
	const userEmailElement = document.querySelector('.user-email');

	if (userEmailElement && adminEmail) {
		userEmailElement.textContent = adminEmail;
	}
}

// Função para realizar logout
function handleLogout() {
	if (confirm('Tem certeza que deseja sair?')) {
		localStorage.removeItem('adminEmail');
		localStorage.removeItem('adminLoginTime');
		showNotification('Logout realizado com sucesso!', 'success');
		setTimeout(() => {
			window.location.href = 'login.html';
		}, 1000);
	}
}

// Sistema de notificações global
function showNotification(message, type = 'info') {
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.innerHTML = `
		<i class="fas ${getNotificationIcon(type)}"></i>
		<span>${message}</span>
	`;

	// Estilos da notificação
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		background: ${getNotificationColor(type)};
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
		max-width: 300px;
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

// Função auxiliar para ícones de notificação
function getNotificationIcon(type) {
	switch (type) {
		case 'error':
			return 'fa-exclamation-circle';
		case 'success':
			return 'fa-check-circle';
		case 'warning':
			return 'fa-exclamation-triangle';
		case 'info':
		default:
			return 'fa-info-circle';
	}
}

// Função auxiliar para cores de notificação
function getNotificationColor(type) {
	switch (type) {
		case 'error':
			return '#E74C3C';
		case 'success':
			return '#2ECC71';
		case 'warning':
			return '#F39C12';
		case 'info':
		default:
			return '#3498DB';
	}
}

// Função auxiliar para fechar modais
function closeEditModal() {
	const modal = document.querySelector('.edit-modal');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => {
			if (modal.parentNode) {
				document.body.removeChild(modal);
			}
		}, 300);
	}
}

// Função auxiliar para fechar modal de adicionar parceiro
function closeAddPartnerModal() {
	const modal = document.querySelector('.edit-modal');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => {
			if (modal.parentNode) {
				document.body.removeChild(modal);
			}
		}, 300);
	}
}

// Função utilitária para formatar data
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

// Função utilitária para validar email
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Constantes globais
const PARTNER_TYPES = {
	ECO: { name: 'Ecoponto', icon: 'fas fa-recycle', color: '#2ECC71' },
	COO: { name: 'Cooperativa', icon: 'fas fa-handshake', color: '#3498DB' },
	PEV: {
		name: 'Ponto de Entrega Voluntária',
		icon: 'fas fa-box',
		color: '#E67E22'
	}
};

const WASTE_TYPES = [
	{ key: 'papel', name: 'Papel', icon: 'fas fa-file-alt' },
	{ key: 'plastico', name: 'Plástico', icon: 'fas fa-bottle-water' },
	{ key: 'vidro', name: 'Vidro', icon: 'fas fa-wine-bottle' },
	{ key: 'metal', name: 'Metal', icon: 'fas fa-cog' },
	{ key: 'oleoCozinha', name: 'Óleo de Cozinha', icon: 'fas fa-tint' },
	{
		key: 'pilhaBateria',
		name: 'Pilhas e Baterias',
		icon: 'fas fa-battery-half'
	},
	{ key: 'eletronico', name: 'Eletrônicos', icon: 'fas fa-laptop' },
	{ key: 'roupa', name: 'Roupas', icon: 'fas fa-tshirt' },
	{ key: 'outros', name: 'Outros', icon: 'fas fa-ellipsis-h' }
];

const API_BASE_URL =
	'https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros';

// Função auxiliar para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
}

// Função auxiliar para debug (só em desenvolvimento)
function debugLog(message, data = null) {
	if (
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1'
	) {
		console.log(`[DEBUG] ${message}`, data);
	}
}

// Função auxiliar para limpar cache do localStorage
function clearCache() {
	const adminEmail = localStorage.getItem('adminEmail');
	const adminLoginTime = localStorage.getItem('adminLoginTime');

	// Limpar tudo exceto dados de login
	for (let key in localStorage) {
		if (key !== 'adminEmail' && key !== 'adminLoginTime') {
			localStorage.removeItem(key);
		}
	}

	showNotification('Cache limpo com sucesso!', 'success');
}

// Função auxiliar para copiar texto para área de transferência
function copyToClipboard(text) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			showNotification(
				'Texto copiado para a área de transferência!',
				'success'
			);
		})
		.catch((err) => {
			console.error('Erro ao copiar texto:', err);
			showNotification('Erro ao copiar texto', 'error');
		});
}

// Função auxiliar para download de arquivos
function downloadFile(content, filename, contentType = 'text/plain') {
	const blob = new Blob([content], { type: contentType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

// Inicializar resources lazy loading se necessário
function initializeLazyLoading() {
	const lazyImages = document.querySelectorAll('img[data-src]');

	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.classList.remove('lazy');
					observer.unobserve(img);
				}
			});
		});

		lazyImages.forEach((img) => imageObserver.observe(img));
	}
}

// Configurar performance monitoring (opcional)
function setupPerformanceMonitoring() {
	if ('performance' in window) {
		window.addEventListener('load', () => {
			setTimeout(() => {
				const perfData = window.performance.timing;
				const loadTime =
					perfData.loadEventEnd - perfData.navigationStart;
				debugLog(`Página carregada em ${loadTime}ms`);
			}, 0);
		});
	}
}

// Inicializar funcionalidades adicionais
initializeLazyLoading();
setupPerformanceMonitoring();
