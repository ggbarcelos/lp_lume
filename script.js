document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

if (menuButton && navigation) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      menuButton.focus();
    }
  });
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
    }
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const progressBar = document.querySelector('.reading-progress');
let scrollFrame = false;
function updateScroll() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`;
  scrollFrame = false;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer: fine)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;
    const bounds = heroVisual.getBoundingClientRect();
    heroVisual.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
    heroVisual.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--pointer-x', '0px');
    heroVisual.style.setProperty('--pointer-y', '0px');
  });
}

const demo = document.querySelector('.experience-console');
const demoButton = document.querySelector('#demo-start');
const demoTitle = document.querySelector('#demo-title');
const demoDescription = document.querySelector('#demo-description');
const demoNumber = document.querySelector('.demo-stage-number');
const demoStages = [
  ['O SOS começa no Lume.', 'O SOS usa a localização atual ou um endereço salvo. Depois de confirmado, não pode ser cancelado pela mulher.'],
  ['O pedido encontra o caminho.', 'A localização é compartilhada e o sistema considera as equipes disponíveis na região.'],
  ['O alerta chega ao Lume Force.', 'O Lume Force notifica a equipe disponível, mesmo sem o app aberto na tela. O aceite confirma quem assumiu.'],
  ['A equipe assume. Os dois lados acompanham.', 'O Lume mostra o status e a aproximação. O Lume Force acompanha a ocorrência e o caminho.']
];
let demoTimer;
let demoIndex = 0;
let demoRunning = false;
let demoStarted = false;
let demoCompleted = false;
let demoRemaining = 4000;
let demoDeadline = 0;

function updateDemoButton() {
  const label = demoRunning ? 'Pausar animação'
    : demoCompleted ? 'Ver novamente'
    : demoStarted ? 'Continuar animação' : 'Ver os apps funcionando';
  demoButton.querySelector('.demo-button-text').textContent = label;
  demoButton.querySelector('.demo-button-icon').textContent = demoRunning ? 'Ⅱ' : '▷';
  demoButton.setAttribute('aria-label', label);
}
function showDemoStage(index) {
  demoIndex = index;
  demo.dataset.phase = String(index + 1);
  demoTitle.textContent = demoStages[index][0];
  demoDescription.textContent = demoStages[index][1];
  demoNumber.textContent = `0${index + 1} / 04`;
  demo.querySelectorAll('.demo-timeline > button').forEach((step, position) => {
    step.classList.toggle('is-active', position === index);
    step.setAttribute('aria-pressed', String(position === index));
  });
  const tracking = index === 3;
  demo.querySelector('.lume-status-title').textContent = tracking ? 'Equipe a caminho.' : 'Pedido enviado.';
  demo.querySelector('.lume-status-description').textContent = tracking
    ? 'A equipe assumiu o chamado. Acompanhe a aproximação.'
    : 'Sua localização está conectada ao SOS.';
  demo.querySelector('.lume-tracking-label').textContent = tracking
    ? 'Atendimento assumido no Lume Force' : index === 2
    ? 'Alerta recebido pela equipe' : 'Buscando equipe disponível';
  demo.querySelector('.lume-screen-caption').textContent = [
    'Um toque inicia o pedido.', 'SOS e localização enviados.',
    'O pedido chegou à equipe.', 'A aproximação aparece no mapa.'
  ][index];
  demo.querySelector('.force-screen-caption').textContent = [
    'Equipe conectada e disponível.', 'Disponibilidade orienta a conexão.',
    'O SOS chega com a localização.', 'Atendimento assumido. Equipe a caminho.'
  ][index];
}
function scheduleDemoStep(delay = 4000) {
  demoRemaining = delay;
  demoDeadline = performance.now() + delay;
  demoTimer = setTimeout(() => {
    if (demoIndex < 3) {
      showDemoStage(demoIndex + 1);
      scheduleDemoStep(demoIndex === 3 ? 6500 : 4000);
    } else {
      demoRunning = false;
      demoCompleted = true;
      // Keep the final map visible after the sequence has completed.
      demo.dataset.playing = 'false';
      updateDemoButton();
    }
  }, delay);
}
function startDemo() {
  clearTimeout(demoTimer);
  demoStarted = true;
  demoCompleted = false;
  demoRunning = true;
  demo.dataset.playing = 'true';
  demo.dataset.manual = 'false';
  showDemoStage(0);
  scheduleDemoStep();
  updateDemoButton();
}
function pauseDemo() {
  if (!demoRunning) return;
  clearTimeout(demoTimer);
  demoRemaining = Math.max(100, demoDeadline - performance.now());
  demoRunning = false;
  demo.dataset.playing = 'false';
  updateDemoButton();
}
if (demo && demoButton) {
  demo.dataset.playing = 'false';
  updateDemoButton();
  demo.querySelectorAll('.demo-timeline > button').forEach((step) => {
    step.addEventListener('click', () => {
      clearTimeout(demoTimer);
      demoStarted = true;
      demoRunning = false;
      demoCompleted = Number(step.dataset.stage) === 3;
      demo.dataset.playing = 'false';
      demo.dataset.manual = 'true';
      demoRemaining = 4000;
      showDemoStage(Number(step.dataset.stage));
      updateDemoButton();
    });
  });
  demoButton.addEventListener('click', () => {
    if (demoRunning) pauseDemo();
    else if (!demoStarted || demoCompleted) startDemo();
    else {
      demoRunning = true;
      demo.dataset.playing = 'true';
      demo.dataset.manual = 'false';
      scheduleDemoStep(demoRemaining);
      updateDemoButton();
    }
  });
  demo.querySelector('.screen-sos').addEventListener('click', startDemo);
  demo.querySelector('.screen-accept').addEventListener('click', () => {
    clearTimeout(demoTimer);
    demoStarted = true;
    demoCompleted = false;
    demoRunning = true;
    demo.dataset.playing = 'true';
    demo.dataset.manual = 'false';
    showDemoStage(3);
    scheduleDemoStep(6500);
    updateDemoButton();
  });
  // Run once when the section enters view; preserve manual pause and replay.
  if ('IntersectionObserver' in window) {
    const demoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !demoStarted && !reducedMotion.matches) startDemo();
        if (!entry.isIntersecting && demoRunning) pauseDemo();
      });
    }, { threshold: .2 });
    demoObserver.observe(demo);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseDemo();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) pauseDemo();
  });
}

if ('IntersectionObserver' in window) {
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-current', entry.isIntersecting));
  }, { rootMargin: '-25% 0px -35% 0px' });
  document.querySelectorAll('.step-card').forEach((step) => stepObserver.observe(step));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
