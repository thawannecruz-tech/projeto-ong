// ==========================================================
// GRÁFICO DE IMPACTO com a biblioteca Chart.js (via CDN)
// A biblioteca cria a variável global "Chart". Este arquivo
// só a usa dentro da função iniciarGrafico(), sem criar
// outras variáveis globais além de "graficoAtual".
// ==========================================================

let graficoAtual = null; // guarda o gráfico para poder destruí-lo na SPA

function iniciarGrafico() {
  const canvas = document.getElementById('grafico-atendimentos');
  if (!canvas) return; // a página atual não tem gráfico

  // Plano B: se o CDN não carregar (ex.: sem internet), mostra a tabela
  if (typeof Chart === 'undefined') {
    canvas.parentElement.hidden = true;
    document.getElementById('tabela-atendimentos').open = true;
    return;
  }

  // Na SPA a página pode ser renderizada de novo: destrói o gráfico antigo
  if (graficoAtual) {
    graficoAtual.destroy();
  }

  // Lê as cores direto das variáveis do Design System (CSS)
  const estilo = getComputedStyle(document.documentElement);
  const cor = function (nome) { return estilo.getPropertyValue(nome).trim(); };
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  graficoAtual = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ATENDIMENTOS_POR_ANO.map(function (item) { return item.ano; }),
      datasets: [{
        label: 'Mulheres atendidas',
        data: ATENDIMENTOS_POR_ANO.map(function (item) { return item.total; }),
        backgroundColor: cor('--cor-primaria'),
        hoverBackgroundColor: cor('--cor-primaria-escura'),
        borderRadius: 4,          // cantos arredondados no topo da barra
        borderSkipped: 'start',   // base da barra fica reta
        maxBarThickness: 56
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduzirMovimento ? false : { duration: 700 },
      plugins: {
        legend: { display: false }, // uma série só: o título já explica
        tooltip: {
          backgroundColor: cor('--cor-vinho'),
          callbacks: {
            label: function (contexto) {
              return contexto.parsed.y.toLocaleString('pt-BR') + ' mulheres atendidas';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: cor('--cor-texto-suave') }
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: cor('--cor-borda') },
          ticks: { color: cor('--cor-texto-suave') }
        }
      }
    }
  });
}

iniciarGrafico();
