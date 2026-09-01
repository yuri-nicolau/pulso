# Projeto: Pulso Concept - Landing Page

## 1. Visão Geral
Este projeto é uma landing page (Single Page Application) de alta conversão para o Studio premium de treinamento "Pulso Concept". O objetivo é transmitir um ambiente moderno, acolhedor e com atendimento humanizado, focando na união de saúde, performance e bem-estar.

## 2. Stack Tecnológica e Ferramentas
- **Gerenciador de Pacotes e Runtime:** Bun
- **Framework:** React + TypeScript (Vite)
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React (ou Phosphor Icons)
- **Formulários e E-mails:** FormSubmit.co (integração com Google Sheets e e-mail)
- **Hospedagem (Alvo):** Vercel

## 3. Comandos Principais
- Instalar dependências: `bun install`
- Rodar o servidor de desenvolvimento: `bun run dev`
- Fazer o build de produção: `bun run build`

## 4. Estrutura de Diretórios (Arquitetura)
O projeto deve seguir a seguinte estrutura de pastas dentro de `src/`:
- `/assets`: Imagens estáticas, SVGs e grafismos (ex: círculo laranja do Pulso).
- `/components/ui`: Componentes reaproveitáveis do Design System (Buttons, Inputs, Cards).
- `/components/sections`: Componentes que representam as dobras da landing page (Hero, About, Spaces, Features, Gallery, Testimonials, ContactForm).
- `/hooks`: Custom hooks do React (se necessário).
- `/utils`: Funções utilitárias e de formatação.

## 5. Diretrizes de Design (Design System)
- **Cores Principais:** Preto (textos e fundos contrastantes), Branco (respiro e fundos clean), Tons Neutros (Areia/Cinza claro) e **Laranja** (Cor de destaque baseada no logo, utilizada em CTAs, ícones e detalhes visuais).
- **Tipografia:** Elegante, limpa e moderna.
- **Espaçamento:** Uso abundante de "white space" para gerar sensação de ambiente premium, exclusivo e organizado.
- **Grafismos:** Utilizar elementos circulares sutis (referenciando o círculo laranja do logo "Pulso") em divisórias, fundos ou bullets.

## 6. Padrões de Código
- **TypeScript:** Tipagem estrita. Crie interfaces/tipos para todas as props de componentes.
- **Tailwind CSS:** Utilize classes utilitárias de forma semântica e evite estilos inline. Centralize cores e fontes customizadas no `tailwind.config.js`.
- **Componentização:** Mantenha os componentes de UI pequenos e focados em uma única responsabilidade. As seções devem apenas consumir esses componentes menores.
- **Formulário:** O formulário de captura de leads deve usar tags HTML nativas com atributos do FormSubmit (`action`, `method="POST"`, inputs hidden para `_captcha` e `_next`).

## 7. Estrutura da Landing Page (7 Dobras)
1. **Hero Section:** Foto de fundo, promessa de valor e CTA principal.
2. **About:** Seção dividida (foto e texto) sobre o ambiente e comunidade.
3. **Spaces:** Comparativo elegante entre "Sala Funcional" e "Sala de Musculação".
4. **Features:** Grid com ícones destacando os diferenciais (grupos reduzidos, MOOVZ, etc.).
5. **Gallery:** Grid de fotos (recepção, salas, alunos, professores).
6. **Testimonials:** Prova social de alunos.
7. **Contact/CTA:** Chamada final e formulário de agendamento de aula.