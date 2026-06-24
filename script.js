const btnActiver = document.getElementById( 'btn-activer' );
const btnDesactiver = document.getElementById( 'btn-desactiver' );
const etatText = document.getElementById( 'etat' );
const intrus = document.getElementById( 'intrus' );
const alarme = new Audio( 'alerte-bip.mp3' );
const voix = new Audio( 'sonerie.mp3' );
const log = document.getElementById( 'log' );

let actif = false;
let alerteActive = false;

const vitesse = 10;
let posX = 900;
let posY = 50;
let vy = 0;
const gravite = 2;
const saut = 30;
const sol = 50;

const detecteurX = 70;
const detecteurY = 60;
const distanceDetection = 500;

function ajouterHistorique( message ) {
    const li = document.createElement( 'li' );
    const time = new Date().toLocaleTimeString();
    li.textContent = `[${ time }] ${ message }`;
    log.prepend( li );
}

btnActiver.addEventListener( 'click', activer );
btnDesactiver.addEventListener( 'click', desactiver );
window.addEventListener( 'keydown', deplacer );
intrus.style.display = "block";
intrus.style.left = posX + "px";
intrus.style.bottom = posY + "px";
function activer() {
    if ( actif ) return;
    actif = true;
    etatText.textContent = "🟢 Surveillance active";
    intrus.style.display = "block";
    btnActiver.disabled = true;
    btnDesactiver.disabled = false;
    ajouterHistorique( "Système activé" );
    requestAnimationFrame( animation );
}

function desactiver() {
    actif = false;
    etatText.textContent = "🔴 Système désactivé";
    btnActiver.disabled = false;
    btnDesactiver.disabled = true;
    if ( alerteActive ) stopAlerte();
    ajouterHistorique( "Système désactivé" );
}

function deplacer( e ) {
    if ( e.key === "ArrowLeft" ) posX -= vitesse;
    else if ( e.key === "ArrowRight" ) posX += vitesse;
    else if ( e.key === "ArrowUp" || e.key === " " ) {
        if ( posY === sol ) vy = saut;
    }
    posX = Math.max( 50, Math.min( 900, posX ) );
    intrus.style.left = posX + "px";
    intrus.style.bottom = posY + "px";
}

function animation() {
    if ( !actif ) return;

    if ( posY > sol || vy > 0 ) {
        posY += vy;
        vy -= gravite;
        if ( posY < sol ) { posY = sol; vy = 0; }
    }

    intrus.style.left = posX + "px";
    intrus.style.bottom = posY + "px";

    const intrusCenterX = posX + intrus.offsetWidth / 2;
    const intrusCenterY = posY + intrus.offsetHeight / 2;

    const dx = intrusCenterX - detecteurX;
    const dy = intrusCenterY - detecteurY;
    const distance = Math.sqrt( dx * dx + dy * dy );

    if ( distance < distanceDetection && !alerteActive ) startAlerte();
    else if ( distance >= distanceDetection && alerteActive ) stopAlerte();

    requestAnimationFrame( animation );
}

function startAlerte() {
    etatText.textContent = "🚨 Intrusion détectée !";
    alerteActive = true;
    document.body.classList.add( 'flash' );
    alarme.loop = true;
    voix.loop = true;
    alarme.play();
    voix.play();
    ajouterHistorique( "Intrusion détectée !" );
}

function stopAlerte() {
    etatText.textContent = "🟢 Surveillance active";
    alerteActive = false;
    document.body.classList.remove( 'flash' );
    alarme.pause();
    alarme.currentTime = 0;
    voix.pause();
    voix.currentTime = 0;
    ajouterHistorique( "Alerte stoppée" );
}

btnDesactiver.disabled = true;

const links = document.querySelectorAll( ".nav-link" );

links.forEach( link => {
    link.addEventListener( "click", function () {
        links.forEach( l => l.classList.remove( "active" ) );
        this.classList.add( "active" );
    } );
} );
function goTo( page ) {
    document.querySelectorAll( ".page" ).forEach( p => p.classList.add( "d-none" ) );
    document.getElementById( page ).classList.remove( "d-none" );

    document.querySelectorAll( ".nav-link" ).forEach( l => l.classList.remove( "active" ) );
    document.querySelector( `[data-page="${ page }"]` ).classList.add( "active" );
}

document.querySelectorAll( ".nav-link" ).forEach( link => {
    link.addEventListener( "click", () => {
        goTo( link.dataset.page );
    } );
} );

function goTo( page ) {
    document.querySelectorAll( ".page" ).forEach( p => p.classList.add( "d-none" ) );
    document.getElementById( page ).classList.remove( "d-none" );

    document.querySelectorAll( ".nav-link" ).forEach( l => l.classList.remove( "active" ) );
    document.querySelector( `[data-page="${ page }"]` ).classList.add( "active" );
}

document.querySelectorAll( ".nav-link" ).forEach( link => {
    link.addEventListener( "click", () => goTo( link.dataset.page ) );
} );

const badge = document.getElementById( "badge-etat" );

function updateBadge( text, color ) {
    badge.textContent = text;
    badge.className = "badge bg-" + color;
}

const oldActiver = activer;
activer = function () {
    oldActiver();
    updateBadge( "Actif", "success" );
};

const oldDesactiver = desactiver;
desactiver = function () {
    oldDesactiver();
    updateBadge( "Inactif", "secondary" );
};

const oldAlerte = startAlerte;
startAlerte = function () {
    oldAlerte();
    updateBadge( "ALERTE", "danger" );
};
