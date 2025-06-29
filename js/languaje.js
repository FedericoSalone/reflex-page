document.addEventListener('DOMContentLoaded', function() {
  // Cargar el idioma guardado o usar español por defecto
  const currentLang = localStorage.getItem('language') || 'es';
  
  // Crear botón de idioma si no existe
  if (!document.getElementById('language-toggle')) {
    const langToggle = document.createElement('div');
    langToggle.id = 'language-toggle';
    langToggle.style.cssText = 'cursor: pointer; position: fixed; top: 20px; right: 60px; z-index: 1000;';
    
    const langFlag = document.createElement('img');
    langFlag.id = 'language-flag';
    langFlag.width = 30;
    langFlag.height = 20;
    langFlag.alt = currentLang === 'es' ? 'Español' : 'English';
    langFlag.src = currentLang === 'es' ? '/images/argentina-flag.png' : '/images/uk-flag.png';
    
    langToggle.appendChild(langFlag);
    document.body.appendChild(langToggle);
    
    langToggle.addEventListener('click', toggleLanguage);
  }
  
  // Cargar las traducciones
  loadTranslations(currentLang);
});

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
      ? '/images/argentina-flag.png' 
      : '/images/uk-flag.png';
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