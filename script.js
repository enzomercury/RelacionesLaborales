// script.js
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'rl_asignaturas';
  let cursadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  // Inicializa el estado de cada asignatura
  document.querySelectorAll('.asignatura').forEach(el => {
    const code = el.dataset.codigo;
    const prereqs = el.dataset.prerequisitos
                      .split(',')
                      .filter(x => x);
    
    // Marcar como cursada si ya está en localStorage
    if (cursadas.includes(code)) {
      el.classList.add('cursada');
    }
    
    // Determinar bloqueada/disponible
    const pendientes = prereqs.filter(p => !cursadas.includes(p));
    if (pendientes.length === 0) {
      el.classList.remove('bloqueada');
      el.classList.add('disponible');
    } else {
      el.classList.remove('disponible');
      el.classList.add('bloqueada');
    }
    
    // Listener de clic
    el.addEventListener('click', () => {
      if (el.classList.contains('bloqueada')) return;
      
      el.classList.toggle('cursada');
      const idx = cursadas.indexOf(code);
      if (idx >= 0) {
        cursadas.splice(idx, 1);
      } else {
        cursadas.push(code);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cursadas));
      
      // Actualiza dependientes
      actualizarDependientes(code);
    });
  });
  
  function actualizarDependientes(triggerCode) {
    document.querySelectorAll('.asignatura').forEach(el => {
      const prereqs = el.dataset.prerequisitos.split(',').filter(x=>x);
      // Si uno de los prereqs es el trigger
      if (prereqs.includes(triggerCode)) {
        const faltan = prereqs.filter(p => !cursadas.includes(p));
        if (faltan.length === 0) {
          el.classList.remove('bloqueada');
          el.classList.add('disponible');
        } else {
          el.classList.add('bloqueada');
          el.classList.remove('disponible');
        }
      }
    });
  }
});
