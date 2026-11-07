const progress = document.getElementById('progress-bar');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

function updateProgress(){
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrollable > 0 ? window.scrollY / scrollable * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = (index % 3) * 70 + 'ms';
  observer.observe(element);
});
