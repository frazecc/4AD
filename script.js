// Elenco dei percorsi delle tue immagini
// Assicurati che questi percorsi corrispondano ai nomi delle immagini che caricherai nella cartella 'images/'
const imagePaths = [
    "images/mappa_1.jpg", 
    "images/mostro_2.png", 
    "images/tesoro_3.jpg",
    "images/evento_4.png"
];

let currentImageIndex = 0;
const dynamicImage = document.getElementById('dynamic-image');

// Funzione richiamata quando si clicca sul pulsante
function changeImage() {
    // Aggiorna l'indice per mostrare la prossima immagine
    currentImageIndex++;
    
    // Se l'indice supera la lunghezza dell'array, torna al primo elemento
    if (currentImageIndex >= imagePaths.length) {
        currentImageIndex = 0;
    }
    
    // Cambia la sorgente dell'immagine
    dynamicImage.src = imagePaths[currentImageIndex];
    
    console.log("Immagine cambiata in: " + imagePaths[currentImageIndex]);
}

// Imposta l'immagine iniziale all'avvio
window.onload = function() {
    // Questo assume che tu abbia almeno un'immagine caricata
    dynamicImage.src = imagePaths[currentImageIndex];
};
