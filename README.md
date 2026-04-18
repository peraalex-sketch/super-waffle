# Carrossel Instagram - Dra. Tânia Pera

## 📱 Visão Geral

Carrossel profissional de 5 slides para Instagram com design minimalista, paleta azul profundo e dourado, otimizado para dispositivos móveis.

**Características:**
- ✨ Design responsivo (1080x1350px - padrão Instagram)
- 🎨 Paleta Professional Blue/Gold
- ⌨️ Navegação por teclado e touchscreen
- ♿ Acessibilidade WCAG AA
- 📱 Mobile-first approach
- 🚀 Performance otimizada

---

## 📂 Estrutura de Arquivos

```
super-waffle/
├── index.html              # Arquivo principal (5 slides)
├── css/
│   ├── typography.css      # Sistema de tipografia (Playfair Display + Inter)
│   ├── styles.css          # Variáveis, paleta de cores, estilos base
│   └── carousel.css        # Navegação e indicadores
├── js/
│   └── carousel.js         # Lógica de navegação (vanilla JS)
├── images/
│   ├── slide-1-capa.jpg         # Capa com foto
│   ├── slide-2-bio.jpg          # Bio
│   ├── slide-3-trajetoria.jpg   # Trajetória
│   ├── slide-4-atuacao.jpg      # Atuação
│   └── slide-5-cta.jpg          # CTA/Encerramento
└── README.md               # Este arquivo
```

---

## 🎨 Slides

### Slide 1: Capa
- **Conteúdo:** "20 anos de direito tributário me ensinaram uma coisa..."
- **Visual:** Foto da Dra. Tânia com overlay azul
- **Layout:** Texto centralizado nos últimos 35% do slide
- **Arquivo:** `slide-1-capa.jpg`

### Slide 2: Bio
- **Conteúdo:** "Sou Dra. Tânia Pera, advogada especialista..."
- **Visual:** Ícone ⚖️ dourado, fundo branco
- **Layout:** Centro, elementos alinhados verticalmente
- **Arquivo:** `slide-2-bio.jpg`

### Slide 3: Trajetória
- **Conteúdo:** Experiência em organizações religiosas
- **Visual:** Timeline com bullets dourados, divisores
- **Layout:** Listagem vertical com espaçamento
- **Arquivo:** `slide-3-trajetoria.jpg`

### Slide 4: Atuação
- **Conteúdo:** OAB-SP, Igrejas, ONGs, Associações
- **Visual:** Grid 2x2 com cards sutis
- **Layout:** Responsivo (1 coluna em mobile)
- **Arquivo:** `slide-4-atuacao.jpg`

### Slide 5: CTA/Encerramento
- **Conteúdo:** "Aqui você aprende sobre..." + chamada para ação
- **Visual:** Fundo gradiente azul, texto branco
- **Layout:** Centro com rodapé discreto
- **Arquivo:** `slide-5-cta.jpg`

---

## 📝 Como Adicionar as Imagens

### Requisitos para as Imagens:
- **Dimensão:** 1080x1350px (padrão Instagram 4:5)
- **Formato:** JPG (qualidade 85-90) ou PNG
- **Tamanho:** < 500KB por imagem (otimizado)
- **Nome:** Sem espaços, minúsculas

### Passo a Passo:

1. **Prepare as imagens:**
   - Redimensione para 1080x1350px
   - Optimize o tamanho (comprima se necessário)
   - Nomeie com a convenção: `slide-{N}-{descricao}.jpg`

2. **Copie para a pasta `/images/`:**
   ```
   ./images/slide-1-capa.jpg
   ./images/slide-2-bio.jpg
   ./images/slide-3-trajetoria.jpg
   ./images/slide-4-atuacao.jpg
   ./images/slide-5-cta.jpg
   ```

3. **Verifique no navegador:**
   ```bash
   # Inicie um servidor local
   python3 -m http.server 8000
   
   # Acesse em http://localhost:8000
   ```

4. **Faça commit:**
   ```bash
   git add images/
   git commit -m "feat: adicionar imagens do carrossel"
   git push origin claude/instagram-carousel-design-1k23n
   ```

---

## 🎯 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Profundo | `#003366` | Headers, backgrounds |
| Azul Médio | `#1a5580` | Acentos, elementos secundários |
| Azul Claro | `#e6f0f7` | Backgrounds sutis |
| Dourado | `#d4af37` | Linhas, ênfase, ícones |
| Branco | `#ffffff` | Texto principal |
| Cinza Escuro | `#2c2c2c` | Texto secundário |

---

## ⌨️ Navegação

### Teclado:
- **←** (Seta esquerda): Slide anterior
- **→** (Seta direita): Próximo slide

### Mouse:
- **← →** Botões de navegação
- **Indicadores (dots):** Clique direto em um dot para ir para aquele slide

### Touch:
- **Swipe esquerdo:** Próximo slide
- **Swipe direito:** Slide anterior

---

## 🚀 Preview Local

```bash
# Navegue até o diretório do projeto
cd super-waffle

# Inicie um servidor HTTP local (Python 3)
python3 -m http.server 8000

# Abra no navegador
# http://localhost:8000

# Para parar o servidor: Ctrl+C
```

---

## ✅ Checklist de Testes

### Visual
- [ ] Cores correspondem à paleta (Blue/Gold)
- [ ] Tipografia legível em desktop e mobile
- [ ] Linhas decorativas alinhadas
- [ ] Espaçamentos consistentes (40px desktop, 20px mobile)
- [ ] Overlays de foto com boa legibilidade

### Funcional
- [ ] Navegação anterior/próximo funciona
- [ ] Indicadores (dots) atualizam corretamente
- [ ] Setas de teclado funcionam
- [ ] Imagens carregam sem erro 404
- [ ] Nenhum erro no console (F12)

### Responsividade
- [ ] Desktop (1080px+): Layout completo
- [ ] Tablet (768px): Ajustes apropriados
- [ ] Mobile (320px): Legível e funcional
- [ ] Imagens não se distorcem

### Acessibilidade
- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA)
- [ ] Navegação por Tab funciona
- [ ] Botões com aria-labels
- [ ] Leitor de tela anuncia slides

---

## 🛠️ Personalização

### Mudar cores:
Edite `/css/styles.css` - seção `:root`:
```css
:root {
  --color-primary: #003366;      /* Azul profundo */
  --color-gold: #d4af37;          /* Dourado */
  /* ... mais cores ... */
}
```

### Mudar fontes:
Edite `/css/typography.css` - seção Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=SuaFonte&display=swap');
```

### Ajustar espaçamento:
Edite `/css/styles.css` - seção `:root` (spacing):
```css
--spacing-lg: 40px;  /* Desktop */
--spacing-md: 20px;  /* Tablet */
```

---

## 📱 Compartilhamento no Instagram

### Para Instagram Stories:
1. Exporte cada slide como imagem (1080x1350px)
2. Faça upload direto: Stories → Criar história
3. Use para carrossel com múltiplas imagens

### Para Instagram Feed (Carrossel):
1. Prepare as 5 imagens em ordem
2. Post → Múltiplas imagens/vídeos
3. Carregue na ordem: 1, 2, 3, 4, 5
4. Adicione legendas e hashtags

### Legenda Sugerida:
```
📚 20 anos de direito tributário me ensinaram uma coisa:
A maioria das entidades religiosas paga imposto que não deve.

Sou Dra. Tânia Pera, advogada especialista em direito tributário.
Atuo na Comissão do Terceiro Setor da OAB-SP ajudando igrejas, ONGs e associações a se defenderem.

🔗 Me segue e ativa o sininho para aprender mais!

#DireitoTributário #OAB #TerceiroSetor #Igrejas #ONGs
```

---

## 🐛 Troubleshooting

### Imagens não carregam:
- Verifique se o arquivo está em `/images/`
- Confirme o nome exato: `slide-{N}-{descricao}.jpg`
- Veja o console (F12) para mensagens de erro

### Navegação não funciona:
- Verifique se `js/carousel.js` está carregando (console F12)
- Tente recarregar a página (Ctrl+R ou Cmd+R)

### Layout quebrado:
- Limpe cache do navegador (Ctrl+Shift+Del)
- Verifique se todos os arquivos CSS estão carregando
- Teste em outro navegador

### Cores estranhas:
- Verifique se as cores foram customizadas em `styles.css`
- Restaure valores padrão da paleta

---

## 📄 Licença

Este projeto foi desenvolvido para Dra. Tânia Pera. Uso pessoal e comercial autorizado.

---

## 📧 Suporte

Para ajuda com os slides, verifique:
1. Este README
2. Comentários no código (CSS/JS)
3. Seu navegador console (F12) para erros

---

**Última atualização:** Abril de 2026
**Versão:** 1.0
**Compatibilidade:** Chrome, Firefox, Safari, Edge (mobile e desktop)