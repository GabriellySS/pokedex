# [📘 Pokédex Interativa](https://gabriellyss.github.io/pokedex/)

Uma [Pokédex](https://gabriellyss.github.io/pokedex/) desenvolvida com HTML, CSS e JavaScript puro, que consome a [PokeAPI](https://pokeapi.co/) para exibir detalhes sobre os Pokémon da primeira geração. Este projeto foi desenvolvido como parte de um desafio do bootcamp **Desenvolvimento Frontend com Angular** da plataforma [DIO](https://www.dio.me/).

---

## 🚀 Funcionalidades

- Listagem interativa dos Pokémon.
- Página de detalhes com abas:
  - Sobre o Pokémon (About)
  - Estatísticas (Stats)
  - Movimentos (Moves)
  - Evoluções (Evolution)
  - Localizações (Location)

---

## 🧱 Estrutura do Projeto
```
pokedex/
│
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── colors.css
│   │   ├── global.css
│   │   ├── pokedex.css
│   │   ├── pokemon-tabs.css
│   │   ├── pokemon-tabs-about.css   
│   │   ├── pokemon-tabs-evolution.css
│   │   ├── pokemon-tabs-location.css
│   │   ├── pokemon-tabs-moves.css
│   │   └── pokemon-tabs-stats.css
│   ├── 📁 images/
|   |   └── pokeball.svg
│   └── 📁 js/
│       ├── main.js
│       ├── poke-api.js
│       ├── pokemon.js
│       └── pokemon-model.js
│
├── index.html
└── pokemon.html
```
---

## 🖥 Como rodar o projeto localmente

1. **Clone ou baixe** este repositório.
2. Extraia o conteúdo (caso tenha baixado um `.zip`).
3. Abra o terminal no diretório do projeto e instale as dependências do projeto utilizando o comando:
```
npm install
```
4. Após a instalação, abra o arquivo `index.html` em qualquer navegador moderno.

> **Nota:** Este projeto utiliza o **Node.js** para o desenvolvimento em JavaScript. Caso ainda não tenha o Node.js instalado, você pode baixá-lo [aqui](https://nodejs.org/).

> **Não é necessário servidor local ou backend.** Tudo funciona com HTML + JavaScript puro!

---

## 📦 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- [PokeAPI](https://pokeapi.co/)
- Node.js (para gerenciamento de dependências)

---

## ✨ Créditos

Projeto desenvolvido como exercício de prática com consumo de APIs e manipulação de DOM em JavaScript.

Inspirado pelos seguintes projetos de layout:

- [Pokedex App no Dribbble](https://dribbble.com/shots/6540871-Pokedex-App)
- [Pokedex no Behance](https://www.behance.net/gallery/155301139/Daily-UI-Pokdex?tracking_source=search_projects|pokedex&l=3)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.
