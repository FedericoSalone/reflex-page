document.addEventListener('DOMContentLoaded', function() {
  // Efecto de carga suave
  document.body.style.opacity = '1';
  
  // ========== SISTEMA DE TRADUCCIÓN ==========
  // Cargar el idioma guardado o usar español por defecto
  const currentLang = localStorage.getItem('language') || 'es';
  
  // Elementos del selector de idioma
  const langToggle = document.createElement('div');
  langToggle.id = 'language-toggle';
  langToggle.style.cssText = 'cursor: pointer; position: fixed; top: 20px; right: 60px; z-index: 1000;';
  
  const langFlag = document.createElement('img');
  langFlag.id = 'language-flag';
  langFlag.width = 30;
  langFlag.height = 20;
  langFlag.alt = currentLang === 'es' ? 'Español' : 'English';
  langFlag.src = currentLang === 'es' ? 'images/argentina-flag.png' : 'images/uk-flag.png';
  
  langToggle.appendChild(langFlag);
  document.body.appendChild(langToggle);
  
  // Funciones de traducción
  function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'es';
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    localStorage.setItem('language', newLang);
    loadTranslations(newLang);
    updateFlag(newLang);
  }
  
  function updateFlag(lang) {
    const langFlag = document.getElementById('language-flag');
    if (langFlag) {
      langFlag.src = lang === 'es' 
        ? 'images/argentina-flag.png' 
        : 'images/uk-flag.png';
      langFlag.alt = lang === 'es' ? 'Español' : 'English';
    }
  }
  
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`/lang/${lang}.json`);
      const translations = await response.json();
      
      document.querySelectorAll('.lang').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[key]) {
          element.textContent = translations[key];
        }
      });
      
      document.documentElement.lang = lang;
      
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }
  
  langToggle.addEventListener('click', toggleLanguage);
  loadTranslations(currentLang);
  
  // ========== CÓDIGO EXISTENTE ==========
  // Menú activo
  const currentPage = window.location.pathname.split('/').pop() || '/index.html';
  const menuItems = document.querySelectorAll('.menu-principal a');
  
  menuItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (currentPage === itemHref || currentPage.includes(itemHref)) {
      item.classList.add('active');
      item.style.color = 'var(--primary)';
    }
  });

  // Elementos del menú
  const menuToggle = document.createElement('div');
  const menuContainer = document.querySelector('header');
  const nav = document.querySelector('.menu-principal');
  let isMobileMenuOpen = false;
  const mobileBreakpoint = 992;

  // Crear botón de menú móvil
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  menuToggle.classList.add('mobile-menu-toggle');
  menuContainer.insertBefore(menuToggle, nav);

  // Función para verificar si es móvil
  function isMobileView() {
    return window.innerWidth <= mobileBreakpoint;
  }

  // Función para alternar el menú móvil
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      nav.style.display = 'block';
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      nav.style.display = 'none';
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      closeAllDropdowns();
    }
  }

  // Función para cerrar todos los dropdowns
  function closeAllDropdowns(except = null) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      if (dropdown !== except) {
        dropdown.classList.remove('active');
        const submenu = dropdown.querySelector('.dropdown-menu');
        if (submenu) submenu.style.display = 'none';
      }
    });
  }

  // Manejar el menú principal
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Manejar dropdowns
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (isMobileView()) {
        e.preventDefault();
        const dropdown = this.parentElement;
        const isActive = dropdown.classList.contains('active');
        const submenu = dropdown.querySelector('.dropdown-menu');
        
        closeAllDropdowns(dropdown);
        
        if (!isActive) {
          dropdown.classList.add('active');
          if (submenu) submenu.style.display = 'block';
        } else {
          dropdown.classList.remove('active');
          if (submenu) submenu.style.display = 'none';
        }
      }
    });

    // Hover para desktop
    link.addEventListener('mouseenter', function() {
      if (!isMobileView()) {
        const dropdown = this.parentElement;
        const submenu = dropdown.querySelector('.dropdown-menu');
        closeAllDropdowns(dropdown);
        dropdown.classList.add('active');
        if (submenu) submenu.style.display = 'block';
      }
    });
  });

  // Cerrar menús al hacer click fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-menu-toggle')) {
      if (isMobileView() && isMobileMenuOpen) {
        toggleMobileMenu();
      }
      closeAllDropdowns();
    }
  });

  // Manejar hover en el contenedor dropdown para desktop
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseleave', function() {
      if (!isMobileView()) {
        this.classList.remove('active');
        const submenu = this.querySelector('.dropdown-menu');
        if (submenu) submenu.style.display = 'none';
      }
    });
  });

  // Manejar resize de ventana
  function handleResize() {
    if (isMobileView()) {
      menuToggle.style.display = 'flex';
      if (!isMobileMenuOpen) {
        nav.style.display = 'none';
      }
    } else {
      menuToggle.style.display = 'none';
      nav.style.display = 'block';
      closeAllDropdowns();
    }
  }

  // Inicializar y configurar evento resize
  handleResize();
  window.addEventListener('resize', handleResize);

  // Animaciones al hacer scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.card, .btn, .page-title');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  const animatedElements = document.querySelectorAll('.card, .btn');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Botón de scroll to top
  const scrollToTopBtn = document.createElement('div');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.classList.add('scroll-to-top');
  document.body.appendChild(scrollToTopBtn);
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', () => {
    scrollToTopBtn.style.opacity = window.pageYOffset > 300 ? '1' : '0';
  });
});