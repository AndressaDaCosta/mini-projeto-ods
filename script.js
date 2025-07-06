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
					showModal(
						'Parcerias',
						'Interessado em ser parceiro? Entre em contato conosco através do e-mail: parceiros@ecojoinville.com.br'
					);
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

	console.log('🌱 EcoJoinville carregado com sucesso!');
});
