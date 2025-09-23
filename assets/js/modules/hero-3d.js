// Hero section parallax and 3D effect
export function initHero3D() {
    const hero = document.querySelector('.hero');
    const content = hero.querySelector('.hero-content');
    
    // 3D tilt effect
    const handleMouseMove = (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        content.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    // Parallax effect for background elements
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero.querySelector('.background-layer')) {
            hero.querySelector('.background-layer').style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    };

    // Smooth reset on mouse leave
    const handleMouseLeave = () => {
        content.style.transform = 'rotateY(0deg) rotateX(0deg)';
        content.style.transition = 'all 0.5s ease';
    };

    // Event listeners
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Add perspective to hero
    hero.style.perspective = '1000px';
    content.style.transformStyle = 'preserve-3d';
}