// Animation d'entrée des éléments au défilement
document.addEventListener('DOMContentLoaded', () => {
    // Configuration de l'Intersection Observer pour les animations d'apparition
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Fonction pour gérer les entrées d'observation
    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    // Création de l'observateur
    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Cibler les éléments à animer
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in');
    
    // Observer chaque élément
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Animation du curseur personnalisé
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Suivi du curseur
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Effet de particules
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.classList.add('particles-container');
        document.body.appendChild(particlesContainer);

        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Position aléatoire
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.5 + 0.1;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`;
            particle.style.opacity = opacity;
            
            particlesContainer.appendChild(particle);
        }
    }

    // Initialisation des particules
    createParticles();

    // Animation au survol des liens
    const links = document.querySelectorAll('a, button, .hover-effect');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Animation de vague au survol des boutons
    const buttons = document.querySelectorAll('.btn, .menu a');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
});

// Animation de texte machine à écrire
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 50);
    }
}

// Initialisation de l'animation machine à écrire
document.addEventListener('DOMContentLoaded', () => {
    const typeElements = document.querySelectorAll('.typewriter');
    
    typeElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        typeWriter(element, text);
    });
});
