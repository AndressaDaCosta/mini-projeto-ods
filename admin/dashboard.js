// Funcionalidades do Dashboard Administrativo
document.addEventListener('DOMContentLoaded', function () {
	const dashboardContainer = document.querySelector('.dashboard-container');
	if (
		dashboardContainer &&
		window.location.pathname.includes('dashboard.html')
	) {
		initializeDashboard();
	}
});

// Variável global para armazenar todos os parceiros
let allPartners = [];

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
	const userAvatarElement = document.getElementById('userAvatar');
	if (userEmailElement) {
		userEmailElement.textContent = adminEmail;
		// Configurar avatar com primeira letra do email
		if (userAvatarElement) {
			userAvatarElement.textContent = adminEmail.charAt(0).toUpperCase();
		}
	}

	// Configurar botão de logout
	const logoutBtn = document.querySelector('.logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', handleLogout);
	}

	initializeSearch();
	initializeFilters();
	loadPartners();
}

// =================== FUNCIONALIDADES DE PESQUISA ===================

function initializeSearch() {
	const searchInput = document.getElementById('searchInput');
	const searchButton = document.getElementById('searchButton');

	if (!searchInput || !searchButton) return;

	// Event listener para o botão de pesquisa
	searchButton.addEventListener('click', handleSearch);

	// Event listener para pesquisar ao pressionar Enter
	searchInput.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	});

	// Event listener para limpar pesquisa quando o campo estiver vazio
	searchInput.addEventListener('input', function () {
		if (this.value.trim() === '') {
			displayPartners(allPartners);
			updateSearchInfo();
		}
	});
}

// Função para realizar a pesquisa
function handleSearch() {
	const searchInput = document.getElementById('searchInput');
	const searchButton = document.getElementById('searchButton');

	if (!searchInput || !searchButton) return;

	const searchTerm = searchInput.value.trim().toLowerCase();

	// Se não há termo de pesquisa, mostrar todos os parceiros
	if (!searchTerm) {
		displayPartners(allPartners);
		updateSearchInfo();
		return;
	}

	// Mostrar estado de carregamento
	searchButton.disabled = true;
	searchButton.classList.add('loading');
	searchButton.innerHTML =
		'<i class="fas fa-spinner fa-spin"></i> Pesquisando...';

	setTimeout(() => {
		// Filtrar parceiros por nome ou bairro
		const filteredPartners = allPartners.filter((partner) => {
			const name = partner.nomeParceiro.toLowerCase();
			const neighborhood = partner.bairro.toLowerCase();

			return (
				name.includes(searchTerm) || neighborhood.includes(searchTerm)
			);
		});

		// Exibir resultados filtrados
		displayPartners(filteredPartners);
		updateSearchInfo(searchTerm, filteredPartners.length);

		// Restaurar botão
		searchButton.disabled = false;
		searchButton.classList.remove('loading');
		searchButton.innerHTML = '<i class="fas fa-search"></i> Pesquisar';

		// Mostrar notificação do resultado
		if (filteredPartners.length === 0) {
			showNotification(
				`Nenhum parceiro encontrado para "${searchTerm}"`,
				'info'
			);
		} else {
			showNotification(
				`${filteredPartners.length} parceiro(s) encontrado(s)`,
				'success'
			);
		}
	}, 500);
}

// Função para atualizar informações da pesquisa
function updateSearchInfo(searchTerm = '', resultsCount = 0) {
	let infoContainer = document.querySelector('.search-results-info');

	// Criar container de informações se não existir
	if (!infoContainer) {
		infoContainer = document.createElement('div');
		infoContainer.className = 'search-results-info';
		const partnersSection = document.querySelector('.partners-section');
		partnersSection.insertBefore(
			infoContainer,
			document.querySelector('.partners-grid')
		);
	}

	if (searchTerm) {
		infoContainer.className = 'search-results-info active';
		infoContainer.innerHTML = `
			<span>Resultados para "<strong>${searchTerm}</strong>": ${resultsCount} parceiro(s) encontrado(s)</span>
			<button class="clear-search-btn" onclick="clearSearch()">
				<i class="fas fa-times"></i> Limpar pesquisa
			</button>
		`;
	} else {
		infoContainer.className = 'search-results-info';
		infoContainer.innerHTML = `
			<span>Mostrando todos os parceiros: ${allPartners.length} total</span>
		`;
	}
}

function clearSearch() {
	const searchInput = document.getElementById('searchInput');
	if (searchInput) {
		searchInput.value = '';
	}

	displayPartners(allPartners);
	updateSearchInfo();

	showNotification('Pesquisa limpa', 'info');
}

// =================== FUNCIONALIDADES DE FILTRO ===================

// Inicializar filtros
function initializeFilters() {
	const filterButtons = document.querySelectorAll('.filter-btn');

	filterButtons.forEach((button) => {
		button.addEventListener('click', function () {
			// Remove classe ativa de todos os botões
			filterButtons.forEach((btn) => btn.classList.remove('active'));

			// Adiciona classe ativa ao botão clicado
			this.classList.add('active');

			// Aplica filtro
			const filterType = this.getAttribute('data-filter');
			filterPartners(filterType);
		});
	});
}

// Filtrar parceiros por tipo
function filterPartners(type) {
	let filteredPartners = allPartners;

	if (type !== 'all') {
		filteredPartners = allPartners.filter(
			(partner) => partner.tipoParceiro === type
		);
	}

	displayPartners(filteredPartners);
	updateSearchInfo('', filteredPartners.length);

	// Mostrar notificação
	const typeNames = {
		ECO: 'Ecopontos',
		COO: 'Cooperativas',
		PEV: 'PEVs',
		all: 'Todos os parceiros'
	};

	showNotification(
		`Filtro aplicado: ${typeNames[type]} (${filteredPartners.length} resultado(s))`,
		'info'
	);
}

// =================== CARREGAMENTO E EXIBIÇÃO DE PARCEIROS ===================

// Função para carregar parceiros da API
async function loadPartners() {
	const partnersContainer = document.querySelector('.partners-grid');
	if (!partnersContainer) return;

	// Mostrar loading
	partnersContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
        </div>
    `;

	try {
		// Fazer requisição à API
		const response = await fetch(
			'https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros'
		);
		console.log('Response List:', JSON.stringify(response));
		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const partners = await response.json();

		// Armazenar todos os parceiros para pesquisa
		allPartners = partners;

		// Exibir parceiros usando a nova função
		displayPartners(allPartners);

		// Atualizar informações de pesquisa
		updateSearchInfo();
	} catch (error) {
		console.error('Erro ao carregar parceiros:', error);
		partnersContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                Erro ao carregar dados dos parceiros. Tente novamente.
                <button onclick="loadPartners()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 5px; margin-left: 1rem; cursor: pointer;">
                    Tentar novamente
                </button>
            </div>
        `;
	}
}

function displayPartners(partners) {
	const partnersContainer = document.querySelector('.partners-grid');
	if (!partnersContainer) return;

	// Limpar container
	partnersContainer.innerHTML = '';

	if (partners.length === 0) {
		partnersContainer.innerHTML = `
			<div class="empty-state">
				<i class="fas fa-search"></i>
				<h3>Nenhum parceiro encontrado</h3>
				<p>Tente pesquisar por outro termo ou verifique se há parceiros cadastrados.</p>
			</div>
		`;
		return;
	}

	partners.forEach((partner) => {
		const partnerCard = createPartnerCard(partner);
		partnersContainer.appendChild(partnerCard);
	});
}

function createPartnerCard(partner) {
	const card = document.createElement('div');
	card.className = 'partner-card clickable';
	card.setAttribute('data-partner-id', partner.id);

	// Mapear tipos de parceiro
	const typeMap = {
		ECO: 'Ecoponto',
		COO: 'Cooperativa',
		PEV: 'Ponto de Entrega Voluntária'
	};

	// Avatar e cores baseados no tipo
	const typeConfig = {
		ECO: {
			icon: 'fas fa-recycle',
			color: '#2ECC71',
			bgColor: 'rgba(46, 204, 113, 0.1)'
		},
		COO: {
			icon: 'fas fa-handshake',
			color: '#3498DB',
			bgColor: 'rgba(52, 152, 219, 0.1)'
		},
		PEV: {
			icon: 'fas fa-box',
			color: '#E67E22',
			bgColor: 'rgba(230, 126, 34, 0.1)'
		}
	};

	const config = typeConfig[partner.tipoParceiro] || typeConfig.ECO;

	// Formatar data de inclusão
	const createdDate = partner.createdAt
		? formatDate(partner.createdAt)
		: 'Data não disponível';

	// Criar lista de tipos de resíduos aceitos
	const wasteTypes = [];
	if (partner.papel) wasteTypes.push('Papel');
	if (partner.plastico) wasteTypes.push('Plástico');
	if (partner.vidro) wasteTypes.push('Vidro');
	if (partner.metal) wasteTypes.push('Metal');
	if (partner.oleoCozinha) wasteTypes.push('Óleo de Cozinha');
	if (partner.pilhaBateria) wasteTypes.push('Pilhas e Baterias');
	if (partner.eletronico) wasteTypes.push('Eletrônicos');
	if (partner.roupa) wasteTypes.push('Roupas');
	if (partner.outros) wasteTypes.push('Outros');

	card.innerHTML = `
		<div class="partner-card-header">
			<div class="partner-avatar" style="background: ${config.bgColor};">
				<i class="${config.icon}" style="color: ${config.color};"></i>
			</div>
			
			<div class="partner-header">
				<h3 class="partner-name">${partner.nomeParceiro}</h3>
				<span class="partner-type" style="background: ${config.color};">${
		typeMap[partner.tipoParceiro] || partner.tipoParceiro
	}</span>
			</div>
		</div>
		
		<div class="partner-card-body">
			<div class="partner-basic-info">
				<p class="partner-neighborhood">
					<i class="fas fa-map-marker-alt"></i> 
					${partner.bairro}
				</p>
			<p class="partner-date">
    <i class="fas fa-calendar-plus"></i> 
    Cadastrado em: ${formatDate(partner.dataCriacao)}
</p>
			</div>
			
			<div class="partner-details">
				<p><i class="fas fa-user"></i> ${partner.responsavelParceiro}</p>
				<p><i class="fas fa-phone"></i> ${partner.telResponsavel}</p>
				<p><i class="fas fa-envelope"></i> ${partner.emailResponsavel}</p>
				<p><i class="fas fa-home"></i> ${partner.rua}, ${partner.numero}</p>
			</div>
			
			<div class="partner-waste-types">
				<strong class="waste-title">Resíduos Aceitos:</strong>
				<div class="waste-list">
					${
						wasteTypes.length > 0
							? wasteTypes
									.map(
										(type) =>
											`<span class="waste-type active">${type}</span>`
									)
									.join('')
							: '<span class="waste-type">Nenhum tipo especificado</span>'
					}
				</div>
			</div>
			
			<div class="card-actions">
				<button class="btn-action btn-view" onclick="event.stopPropagation(); viewPartner('${
					partner.id
				}')">
					<i class="fas fa-eye"></i>
					Ver Detalhes
				</button>
				<button class="btn-action btn-edit" onclick="event.stopPropagation(); editPartner('${
					partner.id
				}')">
					<i class="fas fa-edit"></i>
					Editar
				</button>
				<button class="btn-action btn-delete" onclick="event.stopPropagation(); deletePartner('${
					partner.id
				}', '${partner.nomeParceiro}')">
					<i class="fas fa-trash"></i>
					Excluir
				</button>
			</div>
		</div>
	`;

	card.addEventListener('click', function () {
		redirectToPartnerDetails(partner);
	});

	// Efeito hover
	card.addEventListener('mouseenter', function () {
		this.style.transform = 'translateY(-8px) scale(1.02)';
		this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
	});

	card.addEventListener('mouseleave', function () {
		this.style.transform = 'translateY(0) scale(1)';
		this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
	});

	return card;
}

function redirectToPartnerDetails(partner) {
	// Salvar dados do parceiro no localStorage para usar na página de detalhes
	localStorage.setItem('selectedPartner', JSON.stringify(partner));

	// Redirecionar para a página de detalhes
	window.location.href = 'partner-details.html';
}

// =================== OPERAÇÕES CRUD ===================

// Função para visualizar detalhes de um parceiro específico (GET /parceiros/:id)
async function viewPartner(partnerId) {
	try {
		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${partnerId}`
		);
		console.log('Response GET /parceiros/:id) : ', response);

		if (!response.ok) {
			throw new Error('Erro ao buscar parceiro');
		}

		const partner = await response.json();

		// Salvar no localStorage e redirecionar para detalhes
		localStorage.setItem('selectedPartner', JSON.stringify(partner));
		window.location.href = 'partner-details.html';
	} catch (error) {
		console.error('Erro ao buscar parceiro:', error);
		showNotification('Erro ao carregar dados do parceiro', 'error');
	}
}

// Função para editar parceiro (PUT /parceiros/:id)
async function editPartner(partnerId) {
	try {
		// Buscar dados atuais do parceiro
		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${partnerId}`
		);
		console.log('Response PUT /parceiros/:id : ', response);

		if (!response.ok) {
			throw new Error('Erro ao buscar parceiro');
		}

		const partner = await response.json();

		// Abrir modal de edição
		openEditModal(partner);
	} catch (error) {
		console.error('Erro ao buscar parceiro para edição:', error);
		showNotification('Erro ao carregar dados do parceiro', 'error');
	}
}

// Função para excluir parceiro (DELETE /parceiros/:id)
async function deletePartner(partnerId, partnerName) {
	// Confirmar exclusão
	const confirmDelete = confirm(
		`Tem certeza que deseja excluir o parceiro "${partnerName}"?\n\nEsta ação não pode ser desfeita.`
	);

	if (!confirmDelete) {
		return;
	}

	try {
		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${partnerId}`,
			{
				method: 'DELETE'
			}
		);
		console.log('Response DELETE /parceiros/:id : ', response);

		if (!response.ok) {
			throw new Error('Erro ao excluir parceiro');
		}

		// Mostrar notificação de sucesso
		showNotification(
			`Parceiro "${partnerName}" excluído com sucesso!`,
			'success'
		);

		// Recarregar lista de parceiros
		loadPartners();
	} catch (error) {
		console.error('Erro ao excluir parceiro:', error);
		showNotification('Erro ao excluir parceiro. Tente novamente.', 'error');
	}
}

// =================== MODAIS DE EDIÇÃO E ADIÇÃO ===================

// Função para abrir modal de edição
function openEditModal(partner) {
	// Criar modal de edição
	const modal = document.createElement('div');
	modal.className = 'edit-modal';
	modal.innerHTML = `
		<div class="edit-modal-content">
			<div class="edit-modal-header">
				<h3><i class="fas fa-edit"></i> Editar Parceiro</h3>
				<button class="close-modal" onclick="closeEditModal()">
					<i class="fas fa-times"></i>
				</button>
			</div>
			
			<form id="editPartnerForm" class="edit-form">
				<div class="form-row">
					<div class="form-group">
						<label for="editNomeParceiro">Nome do Parceiro *</label>
						<input type="text" id="editNomeParceiro" value="${
							partner.nomeParceiro
						}" required>
					</div>
					<div class="form-group">
						<label for="editTipoParceiro">Tipo *</label>
						<select id="editTipoParceiro" required>
							<option value="ECO" ${
								partner.tipoParceiro === 'ECO' ? 'selected' : ''
							}>Ecoponto</option>
							<option value="COO" ${
								partner.tipoParceiro === 'COO' ? 'selected' : ''
							}>Cooperativa</option>
							<option value="PEV" ${
								partner.tipoParceiro === 'PEV' ? 'selected' : ''
							}>PEV</option>
						</select>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editResponsavelParceiro">Responsável *</label>
						<input type="text" id="editResponsavelParceiro" value="${
							partner.responsavelParceiro
						}" required>
					</div>
					<div class="form-group">
						<label for="editTelResponsavel">Telefone *</label>
						<input type="tel" id="editTelResponsavel" value="${
							partner.telResponsavel
						}" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editEmailResponsavel">Email *</label>
						<input type="email" id="editEmailResponsavel" value="${
							partner.emailResponsavel
						}" required>
					</div>
					<div class="form-group">
						<label for="editBairro">Bairro *</label>
						<input type="text" id="editBairro" value="${partner.bairro}" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editRua">Rua *</label>
						<input type="text" id="editRua" value="${partner.rua}" required>
					</div>
					<div class="form-group">
						<label for="editNumero">Número *</label>
						<input type="text" id="editNumero" value="${partner.numero}" required>
					</div>
				</div>
				
				<div class="form-group">
					<label for="editCep">CEP *</label>
					<input type="text" id="editCep" value="${
						partner.cep ? partner.cep : 'Não foi Informado'
					}" required>
				</div>
				
				<div class="form-group">
					<label>Resíduos Aceitos:</label>
					<div class="waste-types-checkboxes">
						<label class="checkbox-label">
							<input type="checkbox" id="editPapel" ${partner.papel ? 'checked' : ''}>
							<span>Papel</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editPlastico" ${partner.plastico ? 'checked' : ''}>
							<span>Plástico</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editVidro" ${partner.vidro ? 'checked' : ''}>
							<span>Vidro</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editMetal" ${partner.metal ? 'checked' : ''}>
							<span>Metal</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editOleoCozinha" ${
								partner.oleoCozinha ? 'checked' : ''
							}>
							<span>Óleo de Cozinha</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editPilhaBateria" ${
								partner.pilhaBateria ? 'checked' : ''
							}>
							<span>Pilhas e Baterias</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editEletronico" ${
								partner.eletronico ? 'checked' : ''
							}>
							<span>Eletrônicos</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editRoupa" ${partner.roupa ? 'checked' : ''}>
							<span>Roupas</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editOutros" ${partner.outros ? 'checked' : ''}>
							<span>Outros</span>
						</label>
					</div>
				</div>
				
				<div class="form-actions">
					<button type="button" class="btn-cancel" onclick="closeEditModal()">
						<i class="fas fa-times"></i> Cancelar
					</button>
					<button type="submit" class="btn-save">
						<i class="fas fa-save"></i> Salvar Alterações
					</button>
				</div>
			</form>
		</div>
	`;

	// Adicionar modal ao corpo da página
	document.body.appendChild(modal);

	// Configurar evento de submit do formulário
	document
		.getElementById('editPartnerForm')
		.addEventListener('submit', function (e) {
			e.preventDefault();
			updatePartner(partner.id);
		});

	// Mostrar modal com animação
	setTimeout(() => {
		modal.classList.add('show');
	}, 10);
}

// Função para fechar modal de edição
function closeEditModal() {
	const modal = document.querySelector('.edit-modal');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => {
			document.body.removeChild(modal);
		}, 300);
	}
}

// Função para atualizar parceiro (PUT /parceiros/:id)
async function updatePartner(partnerId) {
	try {
		// Coletar dados do formulário
		const formData = {
			nomeParceiro: document.getElementById('editNomeParceiro').value,
			tipoParceiro: document.getElementById('editTipoParceiro').value,
			responsavelParceiro: document.getElementById(
				'editResponsavelParceiro'
			).value,
			telResponsavel: document.getElementById('editTelResponsavel').value,
			emailResponsavel: document.getElementById('editEmailResponsavel')
				.value,
			bairro: document.getElementById('editBairro').value,
			rua: document.getElementById('editRua').value,
			numero: document.getElementById('editNumero').value,
			cep: document.getElementById('editCep').value,
			papel: document.getElementById('editPapel').checked,
			plastico: document.getElementById('editPlastico').checked,
			vidro: document.getElementById('editVidro').checked,
			metal: document.getElementById('editMetal').checked,
			oleoCozinha: document.getElementById('editOleoCozinha').checked,
			pilhaBateria: document.getElementById('editPilhaBateria').checked,
			eletronico: document.getElementById('editEletronico').checked,
			roupa: document.getElementById('editRoupa').checked,
			outros: document.getElementById('editOutros').checked
		};

		// Fazer requisição PUT
		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${partnerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			}
		);
		console.log('Response PUT /parceiros/:id : ', response);

		if (!response.ok) {
			throw new Error('Erro ao atualizar parceiro');
		}

		// Mostrar notificação de sucesso
		showNotification('Parceiro atualizado com sucesso!', 'success');

		// Fechar modal
		closeEditModal();

		// Recarregar lista de parceiros
		loadPartners();
	} catch (error) {
		console.error('Erro ao atualizar parceiro:', error);
		showNotification(
			'Erro ao atualizar parceiro. Tente novamente.',
			'error'
		);
	}
}

// Função para abrir modal de adicionar parceiro
function openAddPartnerModal() {
	const modal = document.createElement('div');
	modal.className = 'edit-modal';
	modal.innerHTML = `
		<div class="edit-modal-content">
			<div class="edit-modal-header">
				<h3><i class="fas fa-plus"></i> Adicionar Novo Parceiro</h3>
				<button class="close-modal" onclick="closeAddPartnerModal()">
					<i class="fas fa-times"></i>
				</button>
			</div>
			
			<form id="addPartnerForm" class="edit-form">
				<div class="form-row">
					<div class="form-group">
						<label for="addNomeParceiro">Nome do Parceiro *</label>
						<input type="text" id="addNomeParceiro" required>
					</div>
					<div class="form-group">
						<label for="addTipoParceiro">Tipo *</label>
						<select id="addTipoParceiro" required>
							<option value="">Selecione o tipo</option>
							<option value="ECO">Ecoponto</option>
							<option value="COO">Cooperativa</option>
							<option value="PEV">PEV</option>
						</select>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="addResponsavelParceiro">Responsável *</label>
						<input type="text" id="addResponsavelParceiro" required>
					</div>
					<div class="form-group">
						<label for="addTelResponsavel">Telefone *</label>
						<input type="tel" id="addTelResponsavel" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="addEmailResponsavel">Email *</label>
						<input type="email" id="addEmailResponsavel" required>
					</div>
					<div class="form-group">
						<label for="addBairro">Bairro *</label>
						<input type="text" id="addBairro" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="addRua">Rua *</label>
						<input type="text" id="addRua" required>
					</div>
					<div class="form-group">
						<label for="addNumero">Número *</label>
						<input type="text" id="addNumero" required>
					</div>
				</div>
				
				<div class="form-group">
					<label for="addCep">CEP *</label>
					<input type="text" id="addCep" required>
				</div>
				
				<div class="form-group">
					<label>Resíduos Aceitos:</label>
					<div class="waste-types-checkboxes">
						<label class="checkbox-label">
							<input type="checkbox" id="addPapel">
							<span>Papel</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addPlastico">
							<span>Plástico</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addVidro">
							<span>Vidro</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addMetal">
							<span>Metal</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addOleoCozinha">
							<span>Óleo de Cozinha</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addPilhaBateria">
							<span>Pilhas e Baterias</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addEletronico">
							<span>Eletrônicos</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addRoupa">
							<span>Roupas</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="addOutros">
							<span>Outros</span>
						</label>
					</div>
				</div>
				
				<div class="form-actions">
					<button type="button" class="btn-cancel" onclick="closeAddPartnerModal()">
						<i class="fas fa-times"></i> Cancelar
					</button>
					<button type="submit" class="btn-save">
						<i class="fas fa-plus"></i> Adicionar Parceiro
					</button>
				</div>
			</form>
		</div>
	`;

	// Adicionar modal ao corpo da página
	document.body.appendChild(modal);

	// Configurar evento de submit do formulário
	document
		.getElementById('addPartnerForm')
		.addEventListener('submit', function (e) {
			e.preventDefault();
			handleAddPartner();
		});

	// Mostrar modal com animação
	setTimeout(() => {
		modal.classList.add('show');
	}, 10);
}

// Função para fechar modal de adicionar parceiro
function closeAddPartnerModal() {
	const modal = document.querySelector('.edit-modal');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => {
			document.body.removeChild(modal);
		}, 300);
	}
}

// Função para processar adição de parceiro
async function handleAddPartner() {
	try {
		// Coletar dados do formulário
		const formData = {
			nomeParceiro: document.getElementById('addNomeParceiro').value,
			tipoParceiro: document.getElementById('addTipoParceiro').value,
			responsavelParceiro: document.getElementById(
				'addResponsavelParceiro'
			).value,
			telResponsavel: document.getElementById('addTelResponsavel').value,
			emailResponsavel: document.getElementById('addEmailResponsavel')
				.value,
			bairro: document.getElementById('addBairro').value,
			rua: document.getElementById('addRua').value,
			numero: document.getElementById('addNumero').value,
			cep: document.getElementById('addCep').value,
			papel: document.getElementById('addPapel').checked,
			plastico: document.getElementById('addPlastico').checked,
			vidro: document.getElementById('addVidro').checked,
			metal: document.getElementById('addMetal').checked,
			oleoCozinha: document.getElementById('addOleoCozinha').checked,
			pilhaBateria: document.getElementById('addPilhaBateria').checked,
			eletronico: document.getElementById('addEletronico').checked,
			roupa: document.getElementById('addRoupa').checked,
			outros: document.getElementById('addOutros').checked
		};

		// Criar parceiro
		await createPartner(formData);

		// Fechar modal
		closeAddPartnerModal();

		// Recarregar lista de parceiros
		loadPartners();
	} catch (error) {
		console.error('Erro ao adicionar parceiro:', error);
	}
}

// Função para criar novo parceiro (POST /parceiros)
async function createPartner(formData) {
	try {
		const response = await fetch(
			'https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			}
		);
		console.log('Response POST /parceiros : ', response);

		if (!response.ok) {
			throw new Error('Erro ao criar parceiro');
		}

		const newPartner = await response.json();

		// Mostrar notificação de sucesso
		showNotification('Parceiro criado com sucesso!', 'success');

		// Recarregar lista de parceiros se estiver no dashboard
		if (window.location.pathname.includes('dashboard.html')) {
			loadPartners();
		}

		return newPartner;
	} catch (error) {
		console.error('Erro ao criar parceiro:', error);
		showNotification('Erro ao criar parceiro. Tente novamente.', 'error');
		throw error;
	}
}

// =================== FUNÇÕES UTILITÁRIAS ===================

// Função para buscar parceiros com filtros avançados
async function searchPartners(filters = {}) {
	try {
		let url =
			'https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros';

		// Adicionar parâmetros de filtro se fornecidos
		const params = new URLSearchParams();
		if (filters.tipo) params.append('tipoParceiro', filters.tipo);
		if (filters.bairro) params.append('bairro', filters.bairro);
		if (filters.nome) params.append('nomeParceiro', filters.nome);

		if (params.toString()) {
			url += '?' + params.toString();
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Erro ao buscar parceiros');
		}

		const partners = await response.json();
		return partners;
	} catch (error) {
		console.error('Erro ao buscar parceiros:', error);
		throw error;
	}
}

// Função para atualizar dados periodicamente
function startAutoRefresh() {
	// Atualizar dados a cada 5 minutos
	setInterval(() => {
		if (document.querySelector('.partners-grid')) {
			loadPartners();
		}
	}, 5 * 60 * 1000);
}

// Iniciar refresh automático se estiver no dashboard
if (window.location.pathname.includes('dashboard.html')) {
	startAutoRefresh();
}
