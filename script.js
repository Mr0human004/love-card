const text=document.getElementById("sceneText");
const card=document.getElementById("card");
const inner=document.getElementById("inner");
const msg=document.getElementById("msg");
const endBtn=document.getElementById("endBtn");

/* сцены */
const scenes=[
"В бесконечной вселенной...",
"Среди миллиардов людей...",
"Я нашёл самое ценное..."
];

let step=0;

/* запуск сцен */
function nextScene(){
if(step<scenes.length){
text.style.opacity=0;

setTimeout(()=>{
text.textContent=scenes[step];
text.style.opacity=1;
step++;
setTimeout(nextScene,2000);
},800);

}else{
setTimeout(startCard,1500);
}
}
nextScene();

/* показ открытки */
function startCard(){
text.style.opacity=0;
card.classList.remove("hidden");
voice("Это для тебя");
}

/* переворот */
inner.onclick=()=>{
inner.classList.add("flip");
type("Ты — самое прекрасное, что случилось со мной ❤️");
};

/* печать */
function type(t){
let i=0;
const inter=setInterval(()=>{
msg.textContent+=t[i];
i++;
if(i>=t.length) clearInterval(inter);
},40);
}

/* голос */
function voice(t){
const v=new SpeechSynthesisUtterance(t);
v.lang="ru-RU";
speechSynthesis.speak(v);
}

/* финал эффект */
endBtn.onclick=(e)=>{
e.stopPropagation();
finale();
};

function finale(){
voice("Я люблю тебя");
setInterval(()=>{
const el=document.createElement("div");
el.className="love";
el.textContent="❤";
el.style.left=Math.random()*100+"vw";
el.style.bottom="-20px";
el.style.animationDuration=3+Math.random()*3+"s";
document.body.appendChild(el);
setTimeout(()=>el.remove(),6000);
},120);
}

/* космос */
const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;

let stars=Array.from({length:150},()=>({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
z:Math.random()*2
}));

function space(){
ctx.fillStyle="black";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
stars.forEach(s=>{
ctx.beginPath();
ctx.arc(s.x,s.y,s.z,0,Math.PI*2);
ctx.fill();
s.y+=s.z;
if(s.y>canvas.height)s.y=0;
});
requestAnimationFrame(space);
}
space();