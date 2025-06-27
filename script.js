let preguntas = [];
let preguntaIndex = 0;
let aciertos = 0;
let timer;
let tiempoRestante;

const startBtn = document.getElementById('startBtn');
const testContainer = document.getElementById('testContainer');
const preguntaActual = document.getElementById('preguntaActual');
const opciones = document.getElementById('opciones');
const resultadoContainer = document.getElementById('resultadoContainer');
const resultadoTexto = document.getElementById('resultadoTexto');
const reintentarBtn = document.getElementById('reintentarBtn');
const timerDisplay = document.getElementById('timer');
const progreso = document.getElementById('progreso');

startBtn.addEventListener('click', comenzarTest);
reintentarBtn.addEventListener('click', comenzarTest);

async function cargarPreguntas() {
    const res = await fetch('preguntas.json');
    preguntas = await res.json();
}

function comenzarTest() {
    preguntaIndex = 0;
    aciertos = 0;
    resultadoContainer.classList.add('hidden');
    startBtn.classList.add('hidden');
    testContainer.classList.remove('hidden');
    mostrarPregunta();
}

function mostrarPregunta() {
    clearInterval(timer);
    if (preguntaIndex >= preguntas.length) {
        finalizarTest();
        return;
    }

    const pregunta = preguntas[preguntaIndex];
    preguntaActual.textContent = pregunta.pregunta;
    opciones.innerHTML = '';
    progreso.textContent = \`Pregunta \${preguntaIndex + 1} de \${preguntas.length}\`;

    for (let letra in pregunta.opciones) {
        const btn = document.createElement('button');
        btn.textContent = \`\${letra}) \${pregunta.opciones[letra]}\`;
        btn.onclick = () => seleccionarRespuesta(letra);
        opciones.appendChild(btn);
    }

    tiempoRestante = pregunta.tiempo_segundos;
    timerDisplay.textContent = \`Tiempo: \${tiempoRestante}s\`;
    timer = setInterval(() => {
        tiempoRestante--;
        timerDisplay.textContent = \`Tiempo: \${tiempoRestante}s\`;
        if (tiempoRestante <= 0) {
            clearInterval(timer);
            registrarFallo();
        }
    }, 1000);
}

function seleccionarRespuesta(letraSeleccionada) {
    clearInterval(timer);
    const pregunta = preguntas[preguntaIndex];
    if (letraSeleccionada === pregunta.respuesta_correcta) {
        aciertos++;
    }
    preguntaIndex++;
    mostrarPregunta();
}

function registrarFallo() {
    preguntaIndex++;
    mostrarPregunta();
}

function finalizarTest() {
    testContainer.classList.add('hidden');
    resultadoContainer.classList.remove('hidden');
    resultadoTexto.textContent = \`Has acertado \${aciertos} de \${preguntas.length} preguntas (\${Math.round((aciertos / preguntas.length) * 100)}%).\`;
    startBtn.classList.remove('hidden');
}
