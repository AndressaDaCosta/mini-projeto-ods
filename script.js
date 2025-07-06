document.addEventListener('DOMContentLoaded', function () {
	// Elementos do DOM
	const hamburger = document.querySelector('.hamburger');
	const navMenu = document.querySelector('.nav-menu');
	const navLinks = document.querySelectorAll('.nav-link');
	const header = document.querySelector('.header');

	// Toggle menu mobile
	hamburger.addEventListener('click', function () {
		navMenu.classList.toggle('active');
		hamburger.classList.toggle('active');
	});

	// Fechar menu ao clicar em um link
	navLinks.forEach((link) => {
		link.addEventListener('click', function () {
			navMenu.classList.remove('active');
			hamburger.classList.remove('active');
		});
	});

	// Scroll suave para âncoras
	navLinks.forEach((link) => {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			const targetSection = document.querySelector(targetId);

			if (targetSection) {
				const headerHeight = header.offsetHeight;
				const targetPosition = targetSection.offsetTop - headerHeight;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});

	// Efeito de scroll no header
	window.addEventListener('scroll', function () {
		if (window.scrollY > 100) {
			header.style.background = 'rgba(255, 255, 255, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = '#FFFFFF';
			header.style.backdropFilter = 'none';
		}
	});

	// Animação de entrada para elementos
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function (entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);

	const animatedElements = document.querySelectorAll(
		'.objective-card, .impact-item, .action-card'
	);
	animatedElements.forEach((element) => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(30px)';
		element.style.transition =
			'opacity 0.6s ease-out, transform 0.6s ease-out';
		observer.observe(element);
	});

	// Botão de scroll to top
	const scrollTopBtn = document.createElement('button');
	scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
	scrollTopBtn.className = 'scroll-top';
	scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
	document.body.appendChild(scrollTopBtn);

	// Mostrar/esconder botão de scroll to top
	window.addEventListener('scroll', function () {
		if (window.scrollY > 300) {
			scrollTopBtn.classList.add('show');
		} else {
			scrollTopBtn.classList.remove('show');
		}
	});

	scrollTopBtn.addEventListener('click', function () {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	// Efeito de hover nos cards
	const cards = document.querySelectorAll('.objective-card, .action-card');
	cards.forEach((card) => {
		card.addEventListener('mouseenter', function () {
			this.style.transform = 'translateY(-5px) scale(1.02)';
		});

		card.addEventListener('mouseleave', function () {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});

	// Funcionalidade dos botões de ação
	const actionButtons = document.querySelectorAll('.action-button');
	actionButtons.forEach((button) => {
		button.addEventListener('click', function () {
			const buttonText = this.textContent;

			// Simulação de ação baseada no texto do botão
			switch (buttonText) {
				case 'Encontrar Cooperativas':
					showModal(
						'Cooperativas Locais',
						'Em breve você poderá visualizar o mapa com todas as cooperativas de reciclagem de Joinville!'
					);
					break;
				case 'Ver Eventos':
					showModal(
						'Eventos e Campanhas',
						'Fique atento! Em breve divulgaremos os próximos eventos de conscientização ambiental.'
					);
					break;
				case 'Seja Parceiro':
					// Redirecionar para o formulário
					const formSection =
						document.getElementById('cadastro-parceiro');
					if (formSection) {
						const headerHeight = header.offsetHeight;
						const targetPosition =
							formSection.offsetTop - headerHeight;

						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth'
						});
					}
					break;
				default:
					break;
			}
		});
	});

	function showModal(title, message) {
		const modal = document.createElement('div');
		modal.className = 'modal';
		modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn">Entendi</button>
                </div>
            </div>
        `;

		const modalStyles = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .modal.show {
                opacity: 1;
            }
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            .modal.show .modal-content {
                transform: scale(1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
            }
            .modal-header h3 {
                margin: 0;
                color: var(--primary-color);
            }
            .close-modal {
                font-size: 2rem;
                cursor: pointer;
                color: #999;
                transition: color 0.3s ease;
            }
            .close-modal:hover {
                color: #333;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .modal-footer {
                padding: 1.5rem;
                text-align: center;
                border-top: 1px solid #eee;
            }
            .modal-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.3s ease;
            }
            .modal-btn:hover {
                background: var(--secondary-color);
            }
        `;

		if (!document.querySelector('#modal-styles')) {
			const styleSheet = document.createElement('style');
			styleSheet.id = 'modal-styles';
			styleSheet.textContent = modalStyles;
			document.head.appendChild(styleSheet);
		}

		document.body.appendChild(modal);

		setTimeout(() => {
			modal.classList.add('show');
		}, 10);

		function closeModal() {
			modal.classList.remove('show');
			setTimeout(() => {
				document.body.removeChild(modal);
			}, 300);
		}

		// Event listeners para fechar modal
		modal
			.querySelector('.close-modal')
			.addEventListener('click', closeModal);
		modal.querySelector('.modal-btn').addEventListener('click', closeModal);
		modal.addEventListener('click', function (e) {
			if (e.target === modal) {
				closeModal();
			}
		});

		// Fechar modal com ESC
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				closeModal();
			}
		});
	}

	// Efeito de digitação no título principal
	const heroTitle = document.querySelector('.hero h1');
	if (heroTitle) {
		const originalText = heroTitle.textContent;
		heroTitle.textContent = '';

		let index = 0;
		const typingSpeed = 100;

		function typeWriter() {
			if (index < originalText.length) {
				heroTitle.textContent += originalText.charAt(index);
				index++;
				setTimeout(typeWriter, typingSpeed);
			}
		}

		setTimeout(typeWriter, 500);
	}

	// Contador animado para estatísticas (pode ser expandido no futuro)
	function animateCounter(element, target, duration = 2000) {
		const start = 0;
		const startTime = Date.now();

		function update() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const current = Math.floor(progress * target);

			element.textContent = current;

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		update();
	}

	window.addEventListener('scroll', function () {
		const scrolled = window.pageYOffset;
		const heroImage = document.querySelector('.hero-image img');

		if (heroImage) {
			const speed = 0.5;
			heroImage.style.transform = `translateY(${scrolled * speed}px)`;
		}
	});

	// Preloader (opcional)
	window.addEventListener('load', function () {
		document.body.classList.add('loaded');
	});

	// Lazy loading para imagens
	const images = document.querySelectorAll('img[data-src]');
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

	images.forEach((img) => imageObserver.observe(img));

	// Feedback visual para formulários futuros
	function showSuccessMessage(message) {
		const successDiv = document.createElement('div');
		successDiv.className = 'success-message';
		successDiv.textContent = message;
		successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

		document.body.appendChild(successDiv);

		setTimeout(() => {
			successDiv.style.transform = 'translateX(0)';
		}, 10);

		setTimeout(() => {
			successDiv.style.transform = 'translateX(100%)';
			setTimeout(() => {
				document.body.removeChild(successDiv);
			}, 300);
		}, 3000);
	}

	// Funcionalidade do botão CTA principal
	const ctaButton = document.querySelector('.cta-button');
	if (ctaButton) {
		ctaButton.addEventListener('click', function () {
			// Scroll suave para a seção de ações
			const actionsSection = document.querySelector('#acoes');
			if (actionsSection) {
				const headerHeight = header.offsetHeight;
				const targetPosition = actionsSection.offsetTop - headerHeight;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	}

	// Funcionalidade do formulário de parceiro
	const partnerForm = document.getElementById('partnerForm');
	if (partnerForm) {
		partnerForm.addEventListener('submit', handlePartnerFormSubmit);
	}

	// Função para manipular o envio do formulário
	async function handlePartnerFormSubmit(event) {
		event.preventDefault();

		const submitButton = document.querySelector('.submit-button');
		const formData = new FormData(event.target);

		// Validar campos obrigatórios
		if (!validateForm(formData)) {
			return;
		}

		// Preparar dados para envio
		const partnerData = {
			nomeParceiro: formData.get('nomeParceiro'),
			tipoParceiro: formData.get('tipoParceiro'),
			responsavelParceiro: formData.get('responsavelParceiro'),
			telResponsavel: formData.get('telResponsavel'),
			emailResponsavel: formData.get('emailResponsavel'),
			rua: formData.get('rua'),
			numero: parseInt(formData.get('numero')),
			bairro: formData.get('bairro'),
			papel: formData.has('papel'),
			plastico: formData.has('plastico'),
			vidro: formData.has('vidro'),
			metal: formData.has('metal'),
			oleoCozinha: formData.has('oleoCozinha'),
			pilhaBateria: formData.has('pilhaBateria'),
			eletronico: formData.has('eletronico'),
			roupa: formData.has('roupa'),
			outros: formData.has('outros')
		};

		// Mostrar estado de carregamento
		submitButton.disabled = true;
		submitButton.classList.add('loading');
		submitButton.innerHTML =
			'<i class="fas fa-spinner fa-spin"></i> Enviando...';

		try {
			// Enviar dados para a API
			const response = await fetch(
				'https://6860899b8e74864084437167.mockapi.io/jmt-futurodev/api/parceiros',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(partnerData)
				}
			);
			console.log('JSON API', JSON.stringify(partnerData));
			console.log('Response:', response);
			if (response.ok) {
				window.alert('Dados enviados com sucesso!');
				partnerForm.reset();
				showSuccessNotification('Cadastro realizado com sucesso!');
			} else {
				throw new Error('Erro ao enviar dados');
			}
		} catch (error) {
			console.error('Erro ao enviar formulário:', error);
			window.alert('Erro ao enviar dados. Tente novamente.');
		} finally {
			submitButton.disabled = false;
			submitButton.classList.remove('loading');
			submitButton.innerHTML =
				'<i class="fas fa-paper-plane"></i> Enviar Cadastro';
		}
	}

	// Função para validar formulário
	function validateForm(formData) {
		const requiredFields = [
			'nomeParceiro',
			'tipoParceiro',
			'responsavelParceiro',
			'telResponsavel',
			'emailResponsavel',
			'rua',
			'numero',
			'bairro'
		];

		let isValid = true;

		// Limpar erros anteriores
		document
			.querySelectorAll('.error')
			.forEach((el) => el.classList.remove('error'));
		document
			.querySelectorAll('.error-message')
			.forEach((el) => el.classList.remove('show'));

		// Validar campos obrigatórios
		requiredFields.forEach((field) => {
			const value = formData.get(field);
			const input = document.getElementById(field);

			if (!value || value.trim() === '') {
				showFieldError(input, 'Este campo é obrigatório');
				isValid = false;
			}
		});

		// Validar email
		const email = formData.get('emailResponsavel');
		const emailInput = document.getElementById('emailResponsavel');
		if (email && !isValidEmail(email)) {
			showFieldError(emailInput, 'Por favor, insira um email válido');
			isValid = false;
		}

		// Validar telefone
		const phone = formData.get('telResponsavel');
		const phoneInput = document.getElementById('telResponsavel');
		if (phone && !isValidPhone(phone)) {
			showFieldError(phoneInput, 'Por favor, insira um telefone válido');
			isValid = false;
		}

		// Validar se pelo menos um tipo de resíduo foi selecionado
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		const hasCheckedBox = Array.from(checkboxes).some((cb) => cb.checked);

		if (!hasCheckedBox) {
			showGeneralError('Selecione pelo menos um tipo de resíduo aceito');
			isValid = false;
		}

		return isValid;
	}

	// Função para mostrar erro em campo específico
	function showFieldError(input, message) {
		input.classList.add('error');

		let errorElement = input.parentNode.querySelector('.error-message');
		if (!errorElement) {
			errorElement = document.createElement('div');
			errorElement.className = 'error-message';
			input.parentNode.appendChild(errorElement);
		}

		errorElement.textContent = message;
		errorElement.classList.add('show');
	}

	// Função para mostrar erro geral
	function showGeneralError(message) {
		const checkboxGroup = document.querySelector('.checkbox-group');
		let errorElement =
			checkboxGroup.parentNode.querySelector('.error-message');

		if (!errorElement) {
			errorElement = document.createElement('div');
			errorElement.className = 'error-message';
			checkboxGroup.parentNode.appendChild(errorElement);
		}

		errorElement.textContent = message;
		errorElement.classList.add('show');
	}

	// Função para validar email
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Função para validar telefone
	function isValidPhone(phone) {
		const phoneRegex = /^[\d\s\-\(\)]+$/;
		return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
	}

	// Função para mostrar notificação de sucesso
	function showSuccessNotification(message) {
		const notification = document.createElement('div');
		notification.className = 'success-notification';
		notification.innerHTML = `
			<i class="fas fa-check-circle"></i>
			<span>${message}</span>
		`;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.classList.add('show');
		}, 10);

		setTimeout(() => {
			notification.classList.remove('show');
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 4000);
	}

	// Limpar erros quando o usuário começar a digitar
	document.addEventListener('input', function (e) {
		if (e.target.matches('input, select')) {
			e.target.classList.remove('error');
			const errorMessage =
				e.target.parentNode.querySelector('.error-message');
			if (errorMessage) {
				errorMessage.classList.remove('show');
			}
		}
	});

	// Máscara para telefone
	const phoneInput = document.getElementById('telResponsavel');
	if (phoneInput) {
		phoneInput.addEventListener('input', function (e) {
			let value = e.target.value.replace(/\D/g, '');

			if (value.length <= 11) {
				value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
				value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
				value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
				value = value.replace(/^(\d{1,2})$/, '($1');
			}

			e.target.value = value;
		});
	}

	console.log('🌱 EcoJoinville carregado com sucesso!');
});
