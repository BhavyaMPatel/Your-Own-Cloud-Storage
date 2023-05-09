const menu=document.querySelector("#menu");
const button=document.querySelector("#menu-button");


button.addEventListener('click',()=>{
menu.classList.toggle('hidden');
console.log("hi")
});