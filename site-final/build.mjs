// ==========================================================
// BUILD DE PRODUÇÃO
// Gera a pasta dist/ com os arquivos otimizados:
// - JS: os 7 scripts viram um único app.min.js (bundle + minificação)
// - CSS: style.css vira style.min.css (minificação)
// - HTML: remove comentários e espaços extras e aponta para os .min
// - Imagens: copiadas sem alteração
// Uso: npm install e depois npm run build
// ==========================================================

import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = 'dist';

// Ordem de carregamento: cada arquivo usa funções dos anteriores
const SCRIPTS = [
  'js/dados.js',
  'js/armazenamento.js',
  'js/templates.js',
  'js/feedback.js',
  'js/script.js',
  'js/grafico.js',
  'js/router.js'
];

const PAGINAS = ['index.html', 'html/projetos.html', 'html/cadastro.html', 'html/componentes.html'];

const tamanhos = [];

function registrar(nome, original, final) {
  tamanhos.push({ nome, original, final });
}

function bytes(caminho) {
  return fs.statSync(caminho).size;
}

// 1) Limpa a pasta dist e recria a estrutura
fs.rmSync(DIST, { recursive: true, force: true });
for (const pasta of ['css', 'js', 'html', 'imagens']) {
  fs.mkdirSync(path.join(DIST, pasta), { recursive: true });
}

// 2) JavaScript: junta os scripts na ordem certa e minifica.
//    Os arquivos são scripts clássicos (não módulos) e compartilham funções
//    pelo escopo global. O esbuild não renomeia nomes de nível superior
//    quando não há "format" definido, então essas ligações continuam valendo.
const codigoJs = SCRIPTS.map((arquivo) => fs.readFileSync(arquivo, 'utf8')).join(';\n');
const js = await esbuild.transform(codigoJs, { loader: 'js', minify: true, target: 'es2018' });
fs.writeFileSync(path.join(DIST, 'js/app.min.js'), js.code);
registrar('js/app.min.js (7 arquivos)', Buffer.byteLength(codigoJs), Buffer.byteLength(js.code));

// tema.js fica separado: precisa rodar no <head>, antes da página aparecer
const codigoTema = fs.readFileSync('js/tema.js', 'utf8');
const tema = await esbuild.transform(codigoTema, { loader: 'js', minify: true, target: 'es2018' });
fs.writeFileSync(path.join(DIST, 'js/tema.min.js'), tema.code);
registrar('js/tema.min.js', Buffer.byteLength(codigoTema), Buffer.byteLength(tema.code));

// 3) CSS
const codigoCss = fs.readFileSync('css/style.css', 'utf8');
const css = await esbuild.transform(codigoCss, { loader: 'css', minify: true });
fs.writeFileSync(path.join(DIST, 'css/style.min.css'), css.code);
registrar('css/style.min.css', Buffer.byteLength(codigoCss), Buffer.byteLength(css.code));

// 4) HTML: troca as referências e remove comentários e espaços extras.
//    Espaços entre tags viram UM espaço (e não zero), porque entre elementos
//    em linha, como <strong> e texto, o espaço aparece na tela.
for (const pagina of PAGINAS) {
  const prefixo = pagina.startsWith('html/') ? '../' : '';
  let html = fs.readFileSync(pagina, 'utf8');
  const original = Buffer.byteLength(html);

  html = html
    .replace(`${prefixo}css/style.css`, `${prefixo}css/style.min.css`)
    .replace(`${prefixo}js/tema.js`, `${prefixo}js/tema.min.js`);

  // Os 7 <script> locais viram um só (o do Chart.js no CDN continua)
  const tags = SCRIPTS.map((s) => `<script src="${prefixo}${s}"></script>`);
  for (const tag of tags) {
    if (!html.includes(tag)) throw new Error(`Script não encontrado em ${pagina}: ${tag}`);
  }
  html = html.replace(tags[0], `<script src="${prefixo}js/app.min.js"></script>`);
  for (const tag of tags.slice(1)) html = html.replace(tag, '');

  html = html
    .replace(/<!--[\s\S]*?-->/g, '')   // comentários
    .replace(/\s+/g, ' ')              // qualquer sequência de espaços vira um espaço
    .replace(/> </g, '><')             // espaço entre duas tags...
    .trim();

  // ...exceto entre tags de texto em linha, onde o espaço é visível
  html = html.replace(/(<\/(strong|span|a|abbr|code|time|b|em)>)<(?!\/)/g, '$1 <');

  fs.writeFileSync(path.join(DIST, pagina), html);
  registrar(pagina, original, Buffer.byteLength(html));
}

// 5) Imagens: cópia direta
for (const imagem of fs.readdirSync('imagens')) {
  fs.copyFileSync(path.join('imagens', imagem), path.join(DIST, 'imagens', imagem));
}

// 6) Relatório de tamanhos
let totalOriginal = 0;
let totalFinal = 0;
console.log('\nArquivo                          Original    Final   Redução');
for (const { nome, original, final } of tamanhos) {
  totalOriginal += original;
  totalFinal += final;
  const reducao = ((1 - final / original) * 100).toFixed(1);
  console.log(`${nome.padEnd(32)} ${String(original).padStart(8)} ${String(final).padStart(8)}   ${reducao}%`);
}
const reducaoTotal = ((1 - totalFinal / totalOriginal) * 100).toFixed(1);
console.log(`${'TOTAL (texto)'.padEnd(32)} ${String(totalOriginal).padStart(8)} ${String(totalFinal).padStart(8)}   ${reducaoTotal}%`);

// Tamanho real na rede, com a compressão gzip que os servidores aplicam
const gzipAntes = SCRIPTS.concat('js/tema.js', 'css/style.css', ...PAGINAS)
  .reduce((soma, arquivo) => soma + zlib.gzipSync(fs.readFileSync(arquivo)).length, 0);
const gzipDepois = ['js/app.min.js', 'js/tema.min.js', 'css/style.min.css', ...PAGINAS]
  .reduce((soma, arquivo) => soma + zlib.gzipSync(fs.readFileSync(path.join(DIST, arquivo))).length, 0);
console.log(`Com gzip: ${gzipAntes} -> ${gzipDepois} bytes (${((1 - gzipDepois / gzipAntes) * 100).toFixed(1)}% menor)`);
console.log(`Requisições de JS locais: 8 -> 2\n`);
console.log('Build concluída em dist/');
