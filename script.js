// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    let imageResources = [];
    
    // Riferimento al div dove mostrare la lista di spunta
    const checklistDiv = document.getElementById('checklist');
    checklistDiv.innerHTML = 'Caricamento file di configurazione...';

    try {
        // MODIFICA CRITICA: Definiamo il percorso del file JSON
        // L'uso di './files.json' o 'files.json' dovrebbe funzionare, ma lo esplicitiamo 
        // per debug (per repository di progetto, il percorso corretto è essenziale).
        const jsonPath = 'files.json'; 

        const response = await fetch(jsonPath);
        
        if (!response.ok) {
            // Se non trova il file (es. 404), genera un errore
            throw new Error(`Impossibile trovare files.json (Status: ${response.status}).`);
        }
        
        // Converte il JSON in un oggetto JavaScript
        imageResources = await response.json();
    } catch (error) {
        // Mostra un errore chiaro direttamente sul sito in caso di fallimento
        checklistDiv.innerHTML = `<p style="color: red; font-weight: bold;">ERRORE DI CARICAMENTO! Controlla la console.</p><p style="color: red;">Dettagli: ${error.message}</p>`;
        console.error("Errore nel caricamento del JSON:", error);
        return; 
    }

    // Se il caricamento ha successo, procedi a costruire la lista
    renderChecklist(imageResources);
    // Visualizza le immagini di default (tutte spuntate)
    displaySelectedImages();
}
