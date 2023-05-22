// Basado en este código
// https://codepen.io/mignunez/pen/BaZRvML
// https://youtu.be/a4R0D3UkyyY
// https://medium.com/@mignunez/how-to-create-a-slide-transition-between-separate-pages-with-html-css-and-javascript-bb7a14393d1 

const pages = document.querySelectorAll(".paginas");

const translateAmount = 100; 
let translate = 0;

slide = (direction) => 
  {
    direction === "next" ? translate -= translateAmount : translate += translateAmount;
    pages.forEach(pages => (pages.style.transform = `translateX(${translate}%)`));
  }