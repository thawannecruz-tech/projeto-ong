// ==========================================================
// DADOS DOS PROJETOS
// Fonte única de informação: para criar, editar ou remover um
// projeto, basta mudar este array. Os cartões da página de
// projetos e as opções do formulário são gerados a partir dele.
// ==========================================================

const PROJETOS = [
  {
    id: 'acolher',
    titulo: 'Acolher',
    descricao: 'Atendimento psicológico gratuito e grupos de apoio para mulheres em situação de violência.',
    imagem: 'acolhimento.svg',
    alt: 'Ilustração de um coração entre duas mãos',
    categoria: { texto: 'Apoio psicológico', tipo: 'primaria' },
    status: { texto: 'Vagas abertas', tipo: 'sucesso' }
  },
  {
    id: 'direitos',
    titulo: 'Direitos em Foco',
    descricao: 'Orientação jurídica sobre medidas protetivas, pensão, guarda dos filhos e divórcio.',
    imagem: 'juridico.svg',
    alt: 'Ilustração de uma balança da justiça',
    categoria: { texto: 'Jurídico', tipo: 'info' },
    status: { texto: 'Poucas vagas', tipo: 'aviso' }
  },
  {
    id: 'empreendem',
    titulo: 'Mulheres que Empreendem',
    descricao: 'Cursos de capacitação profissional e empreendedorismo para conquistar a independência financeira.',
    imagem: 'capacitacao.svg',
    alt: 'Ilustração de um computador',
    categoria: { texto: 'Capacitação', tipo: 'neutro' },
    status: { texto: 'Vagas abertas', tipo: 'sucesso' }
  },
  {
    id: 'cuidar',
    titulo: 'Cuidar de Si',
    descricao: 'Rodas de conversa sobre saúde da mulher, autoestima e bem-estar.',
    imagem: 'saude.svg',
    alt: 'Ilustração de uma flor',
    categoria: { texto: 'Saúde', tipo: 'primaria' },
    status: { texto: 'Em breve', tipo: 'aviso' }
  }
];

// Mulheres atendidas por ano (usado no gráfico do Chart.js e na tabela)
const ATENDIMENTOS_POR_ANO = [
  { ano: 2021, total: 420 },
  { ano: 2022, total: 560 },
  { ano: 2023, total: 710 },
  { ano: 2024, total: 850 },
  { ano: 2025, total: 960 }
];
