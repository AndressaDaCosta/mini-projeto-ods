// Funcionalidades da página de detalhes do parceiro
document.addEventListener('DOMContentLoaded', function () {
	const partnerDetailsContainer = document.querySelector(
		'.partner-details-container'
	);
	if (
		partnerDetailsContainer &&
		window.location.pathname.includes('partner-details.html')
	) {
		initializePartnerDetails();
	}
});

// Variável global para armazenar dados do parceiro atual
let currentPartner = null;

// Inicializar funcionalidades da página de detalhes
function initializePartnerDetails() {
	console.log('Inicializando detalhes do parceiro...');

	// Verificar se o usuário está logado
	const adminEmail = localStorage.getItem('adminEmail');
	if (!adminEmail) {
		console.log('Usuário não logado, redirecionando...');
		window.location.href = 'login.html';
		return;
	}

	// Verificar se há dados do parceiro selecionado
	const partnerData = localStorage.getItem('selectedPartner');
	console.log('Dados do parceiro no localStorage:', partnerData);

	if (!partnerData) {
		console.log('Nenhum dado de parceiro encontrado, redirecionando...');
		// Se não há dados, redirecionar para o dashboard
		window.location.href = 'dashboard.html';
		return;
	}

	try {
		currentPartner = JSON.parse(partnerData);
		console.log('Parceiro carregado:', currentPartner);
		displayPartnerDetails(currentPartner);
	} catch (error) {
		console.error('Erro ao carregar dados do parceiro:', error);
		window.location.href = 'dashboard.html';
	}

	// Configurar botões de ação
	setupActionButtons();
}

// =================== EXIBIÇÃO DE DETALHES ===================

// Função para exibir detalhes completos do parceiro
function displayPartnerDetails(partner) {
	console.log('Exibindo detalhes do parceiro:', partner);

	// Esconder loading e mostrar conteúdo
	const loadingContainer = document.getElementById('loadingContainer');
	const contentContainer = document.getElementById('partnerDetailsContent');
	const errorContainer = document.getElementById('errorContainer');

	console.log('Elementos encontrados:', {
		loadingContainer: !!loadingContainer,
		contentContainer: !!contentContainer,
		errorContainer: !!errorContainer
	});

	if (loadingContainer) {
		loadingContainer.style.display = 'none';
		console.log('Loading escondido');
	}
	if (errorContainer) {
		errorContainer.style.display = 'none';
		console.log('Error escondido');
	}
	if (contentContainer) {
		contentContainer.style.display = 'block';
		console.log('Conteúdo exibido');
	}

	// Atualizar título da página
	document.title = `${partner.nomeParceiro} - Detalhes do Parceiro`;

	// Mapear tipos de parceiro
	const typeMap = {
		ECO: 'Ecoponto',
		COO: 'Cooperativa',
		PEV: 'Ponto de Entrega Voluntária'
	};

	// Configuração de ícones e cores por tipo
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

	// Atualizar cabeçalho
	updatePartnerHeader(partner, config, typeMap);

	// Atualizar seções de informações
	updateContactInfo(partner);
	updateAddressInfo(partner);
	updateWasteTypes(partner);
	updateAdditionalInfo(partner);
}

// Função para atualizar o cabeçalho do parceiro
function updatePartnerHeader(partner, config, typeMap) {
	// Atualizar avatar
	const avatarElement = document.getElementById('partnerAvatar');
	if (avatarElement) {
		avatarElement.innerHTML = `<i class="${config.icon}"></i>`;
		avatarElement.style.background = config.bgColor;
		avatarElement.querySelector('i').style.color = config.color;
	}

	// Atualizar nome
	const nameElement = document.getElementById('partnerName');
	if (nameElement) {
		nameElement.textContent = partner.nomeParceiro;
	}

	// Atualizar tipo
	const typeElement = document.getElementById('partnerType');
	if (typeElement) {
		typeElement.textContent =
			typeMap[partner.tipoParceiro] || partner.tipoParceiro;
		typeElement.style.background = config.color;
	}

	// Aplicar classe CSS dinâmica ao header baseado no tipo
	const headerElement = document.querySelector('.partner-header-details');
	if (headerElement) {
		// Remover classes anteriores
		headerElement.classList.remove('type-eco', 'type-coo', 'type-pev');

		// Adicionar classe correspondente ao tipo
		const typeClass = getHeaderClassByType(partner.tipoParceiro);
		if (typeClass) {
			headerElement.classList.add(typeClass);
			console.log(
				`Aplicada classe '${typeClass}' ao header para tipo '${partner.tipoParceiro}'`
			);
		}
	} else {
		console.warn('Elemento .partner-header-details não encontrado');
	}
}

// Função para obter a classe CSS baseada no tipo de parceiro
function getHeaderClassByType(partnerType) {
	const typeClasses = {
		ECO: 'type-eco',
		COO: 'type-coo',
		PEV: 'type-pev'
	};

	return typeClasses[partnerType] || 'type-eco'; // Default para ECO
}

// Função para atualizar informações de contato
function updateContactInfo(partner) {
	// Atualizar informações de contato usando os IDs do HTML
	updateElementText('responsibleName', partner.responsavelParceiro);
	updateElementText('responsiblePhone', partner.telResponsavel);
	updateElementText('responsibleEmail', partner.emailResponsavel);
}

// Função para atualizar informações de endereço
function updateAddressInfo(partner) {
	// Atualizar informações de endereço usando os IDs do HTML
	updateElementText('street', partner.rua);
	updateElementText('number', partner.numero);
	updateElementText('neighborhood', partner.bairro);
	updateElementText('city', partner.cidade || 'Joinville');
	updateElementText('state', partner.estado || 'SC');
	updateElementText('zipCode', partner.cep);

	// Atualizar dados de cadastro
	console.log('partner.dataCriacao', partner.dataCriacao);
	console.log('formatDate test:', formatDate(partner.dataCriacao));

	const createdDateElement = document.getElementById('createdDate');
	console.log('createdDate element:', createdDateElement);

	updateElementText(
		'createdDate',
		partner.dataCriacao ? formatDate(partner.dataCriacao) : 'Não disponível'
	);

	console.log(
		'After updateElementText, createdDate innerHTML:',
		createdDateElement ? createdDateElement.innerHTML : 'element not found'
	);

	updateElementText(
		'updatedDate',
		partner.dataAtualizacao
			? formatDate(partner.dataAtualizacao)
			: partner.dataCriacao
			? formatDate(partner.dataCriacao)
			: 'Não disponível'
	);
	updateElementText('partnerId', partner.id);
}

// Função para atualizar tipos de resíduos aceitos
function updateWasteTypes(partner) {
	const wasteTypesGrid = document.getElementById('wasteTypesGrid');
	if (!wasteTypesGrid) return;

	// Mapear tipos de resíduos com ícones
	const wasteTypes = [
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

	wasteTypesGrid.innerHTML = '';

	wasteTypes.forEach((wasteType) => {
		const isAccepted = partner[wasteType.key] === true;
		const wasteElement = document.createElement('div');
		wasteElement.className = `waste-type-detail ${
			isAccepted ? 'accepted' : 'not-accepted'
		}`;

		wasteElement.innerHTML = `
			<i class="${wasteType.icon}"></i>
			<span>${wasteType.name}</span>
			<i class="fas ${
				isAccepted ? 'fa-check' : 'fa-times'
			}" style="margin-left: auto; font-size: 0.9rem;"></i>
		`;

		wasteTypesGrid.appendChild(wasteElement);
	});
}

// Função auxiliar para atualizar texto de elementos
function updateElementText(elementId, text) {
	const element = document.getElementById(elementId);
	if (element) {
		element.textContent = text || 'Não informado';
	}
}

// Função para atualizar informações adicionais
function updateAdditionalInfo(partner) {
	// Esta função pode ser expandida ...TODO
	console.log(
		'Informações adicionais carregadas para:',
		partner.nomeParceiro
	);
}

// Função para atualizar botões de ação
function updateActionButtons(partner) {
	const actionsContainer = document.querySelector('.partner-actions');
	if (!actionsContainer) return;

	actionsContainer.innerHTML = `
		<button class="btn-primary" onclick="editCurrentPartner()">
			<i class="fas fa-edit"></i> Editar Parceiro
		</button>
		<button class="btn-secondary" onclick="refreshPartnerData()">
			<i class="fas fa-sync-alt"></i> Atualizar Dados
		</button>
		<button class="btn-danger" onclick="deleteCurrentPartner()">
			<i class="fas fa-trash"></i> Excluir Parceiro
		</button>
		<button class="btn-back" onclick="goBackToDashboard()">
			<i class="fas fa-arrow-left"></i> Voltar ao Dashboard
		</button>
	`;
}

// =================== CONFIGURAÇÃO DE BOTÕES ===================

// Função para configurar event listeners dos botões
function setupActionButtons() {
	// Botão de voltar
	const backButton = document.querySelector('.btn-back');
	if (backButton) {
		backButton.addEventListener('click', goBackToDashboard);
	}

	// Botão de editar
	const editButton = document.querySelector('.btn-edit');
	if (editButton) {
		editButton.addEventListener('click', editCurrentPartner);
	}

	// Botão de excluir
	const deleteButton = document.querySelector('.btn-delete');
	if (deleteButton) {
		deleteButton.addEventListener('click', deleteCurrentPartner);
	}

	// Botão de atualizar
	const refreshButton = document.querySelector('.btn-refresh');
	if (refreshButton) {
		refreshButton.addEventListener('click', refreshPartnerData);
	}
}

// =================== OPERAÇÕES CRUD ===================

// Função para editar o parceiro atual
function editCurrentPartner() {
	if (!currentPartner) return;

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
							currentPartner.nomeParceiro
						}" required>
					</div>
					<div class="form-group">
						<label for="editTipoParceiro">Tipo *</label>
						<select id="editTipoParceiro" required>
							<option value="ECO" ${
								currentPartner.tipoParceiro === 'ECO'
									? 'selected'
									: ''
							}>Ecoponto</option>
							<option value="COO" ${
								currentPartner.tipoParceiro === 'COO'
									? 'selected'
									: ''
							}>Cooperativa</option>
							<option value="PEV" ${
								currentPartner.tipoParceiro === 'PEV'
									? 'selected'
									: ''
							}>PEV</option>
						</select>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editResponsavelParceiro">Responsável *</label>
						<input type="text" id="editResponsavelParceiro" value="${
							currentPartner.responsavelParceiro
						}" required>
					</div>
					<div class="form-group">
						<label for="editTelResponsavel">Telefone *</label>
						<input type="tel" id="editTelResponsavel" value="${
							currentPartner.telResponsavel
						}" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editEmailResponsavel">Email *</label>
						<input type="email" id="editEmailResponsavel" value="${
							currentPartner.emailResponsavel
						}" required>
					</div>
					<div class="form-group">
						<label for="editBairro">Bairro *</label>
						<input type="text" id="editBairro" value="${currentPartner.bairro}" required>
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="editRua">Rua *</label>
						<input type="text" id="editRua" value="${currentPartner.rua}" required>
					</div>
					<div class="form-group">
						<label for="editNumero">Número *</label>
						<input type="text" id="editNumero" value="${currentPartner.numero}" required>
					</div>
				</div>
				
				<div class="form-group">
					<label for="editCep">CEP *</label>
					<input type="text" id="editCep" value="${currentPartner.cep}" required>
				</div>
				
				<div class="form-group">
					<label>Resíduos Aceitos:</label>
					<div class="waste-types-checkboxes">
						<label class="checkbox-label">
							<input type="checkbox" id="editPapel" ${currentPartner.papel ? 'checked' : ''}>
							<span>Papel</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editPlastico" ${
								currentPartner.plastico ? 'checked' : ''
							}>
							<span>Plástico</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editVidro" ${currentPartner.vidro ? 'checked' : ''}>
							<span>Vidro</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editMetal" ${currentPartner.metal ? 'checked' : ''}>
							<span>Metal</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editOleoCozinha" ${
								currentPartner.oleoCozinha ? 'checked' : ''
							}>
							<span>Óleo de Cozinha</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editPilhaBateria" ${
								currentPartner.pilhaBateria ? 'checked' : ''
							}>
							<span>Pilhas e Baterias</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editEletronico" ${
								currentPartner.eletronico ? 'checked' : ''
							}>
							<span>Eletrônicos</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editRoupa" ${currentPartner.roupa ? 'checked' : ''}>
							<span>Roupas</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" id="editOutros" ${
								currentPartner.outros ? 'checked' : ''
							}>
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
			updateCurrentPartner();
		});

	// Mostrar modal com animação
	setTimeout(() => {
		modal.classList.add('show');
	}, 10);
}

// Função para atualizar dados do parceiro atual
async function updateCurrentPartner() {
	if (!currentPartner) return;

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
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${currentPartner.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			}
		);

		if (!response.ok) {
			throw new Error('Erro ao atualizar parceiro');
		}

		const updatedPartner = await response.json();

		// Atualizar dados locais
		currentPartner = updatedPartner;
		localStorage.setItem('selectedPartner', JSON.stringify(updatedPartner));

		// Atualizar exibição
		displayPartnerDetails(updatedPartner);

		// Mostrar notificação de sucesso
		showNotification('Parceiro atualizado com sucesso!', 'success');

		// Fechar modal
		closeEditModal();
	} catch (error) {
		console.error('Erro ao atualizar parceiro:', error);
		showNotification(
			'Erro ao atualizar parceiro. Tente novamente.',
			'error'
		);
	}
}

// Função para excluir o parceiro atual
async function deleteCurrentPartner() {
	if (!currentPartner) return;

	// Confirmar exclusão
	const confirmDelete = confirm(
		`Tem certeza que deseja excluir o parceiro "${currentPartner.nomeParceiro}"?\n\nEsta ação não pode ser desfeita e você será redirecionado para o dashboard.`
	);

	if (!confirmDelete) return;

	try {
		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${currentPartner.id}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			throw new Error('Erro ao excluir parceiro');
		}

		// Mostrar notificação de sucesso
		showNotification(
			`Parceiro "${currentPartner.nomeParceiro}" excluído com sucesso!`,
			'success'
		);

		// Limpar dados locais
		localStorage.removeItem('selectedPartner');

		// Redirecionar para o dashboard ocm delay
		setTimeout(() => {
			window.location.href = 'dashboard.html';
		}, 1500);
	} catch (error) {
		console.error('Erro ao excluir parceiro:', error);
		showNotification('Erro ao excluir parceiro. Tente novamente.', 'error');
	}
}

// Função para recarregar dados do parceiro
async function refreshPartnerData() {
	if (!currentPartner) return;

	try {
		showNotification('Atualizando dados...', 'info');

		const response = await fetch(
			`https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros/${currentPartner.id}`
		);

		if (!response.ok) {
			throw new Error('Erro ao buscar dados atualizados');
		}

		const updatedPartner = await response.json();

		// Atualizar dados locais
		currentPartner = updatedPartner;
		localStorage.setItem('selectedPartner', JSON.stringify(updatedPartner));

		// Atualizar exibição
		displayPartnerDetails(updatedPartner);

		showNotification('Dados atualizados com sucesso!', 'success');
	} catch (error) {
		console.error('Erro ao atualizar dados:', error);
		showNotification('Erro ao atualizar dados. Tente novamente.', 'error');
	}
}

// =================== NAVEGAÇÃO ===================

// Função para voltar ao dashboard
function goBackToDashboard() {
	window.location.href = 'dashboard.html';
}

// =================== MODAIS ===================

// Função para fechar modal de edição
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

// Inicializar funcionalidades avançadas se estiver na página de detalhes
if (window.location.pathname.includes('partner-details.html')) {
	// Adicionar atalhos de teclado
	document.addEventListener('keydown', function (e) {
		if (e.ctrlKey) {
			switch (e.key) {
				case 'e':
					e.preventDefault();
					editCurrentPartner();
					break;
				case 'r':
					e.preventDefault();
					refreshPartnerData();
					break;
				case 'Backspace':
					e.preventDefault();
					goBackToDashboard();
					break;
			}
		}
	});
}
