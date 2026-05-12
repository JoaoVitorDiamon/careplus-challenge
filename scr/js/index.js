document.addEventListener('DOMContentLoaded', () => {
    
    // Remove a borda azul do card anterior e coloca no que foi clicado
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove o destaque
            cards.forEach(c => c.classList.remove('active-card'));
            
            // Adiciona o destaque apenas ao clicado
            this.classList.add('active-card');
        });
    });

    // Efeito Visual na Navbar ao Rolar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });

    //Navegação Suave (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});