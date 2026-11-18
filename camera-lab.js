import {createFaceGame} from './minigames/photobooth/face-game.js';
const end=document.querySelector('#camera-lab-return');
const game=createFaceGame({onComplete:()=>end.hidden=false,onClose:()=>end.hidden=false});
end.querySelector('button').onclick=()=>{end.hidden=true;game.start();};
game.start();
