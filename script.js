// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    let imageResources = [];
    
    // Riferimento al div dove mostrare la lista di spunta
    const checklistDiv = document.getElementById('checklist');
    checklistDiv.innerHTML = 'Caricamento file di configurazione...';

    try {
        // CORREZIONE ANTI-CACHE: Aggiungiamo un timestamp per forzare il download del file aggiornato
        const jsonPath = '/4AD/files.json'; 
        const cacheBuster = `?v=${new Date().getTime()}`; 
        const fullPath = jsonPath + cacheBuster; 
        
        const response = await fetch(fullPath);
        
        if (!response.ok) {
            throw new Error(`Impossibile trovare files.json (Status: ${response.status}).`);
        }
        
        imageResources = await response.json();

        // Ordinamento alfabetico
        imageResources.sort((a, b) => a.name.localeCompare(b.name));
        
    } catch (error) {
        // Mostra un errore chiaro direttamente sul sito in caso di fallimento
        checklistDiv.innerHTML = `<p style="color: red; font-weight: bold;">ERRORE DI CARICAMENTO!</p><p style="color: red;">Dettagli: ${error.message}</p>`;
        console.error("Errore nel caricamento del JSON:", error);
        return; 
    }

    // Se il caricamento ha successo, procede a costruire la lista ordinata
    renderChecklist(imageResources);
    displaySelectedImages();
}


// Funzione per generare la lista di spunta (Checklist)
function renderChecklist(resources) {
    const checklistDiv = document.getElementById('checklist');
    checklistDiv.innerHTML = ''; 
    
    resources.forEach((resource, index) => {
        const inputId = `img-checkbox-${index}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = inputId;
        checkbox.value = resource.path;
        checkbox.checked = true; 
        checkbox.onchange = displaySelectedImages; 
        
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = resource.name;
        
        checklistDiv.appendChild(checkbox);
        checklistDiv.appendChild(label);
        checklistDiv.appendChild(document.createElement('br'));
    });
}

// Funzione per visualizzare solo le immagini spuntate
function displaySelectedImages() {
    const outputDiv = document.getElementById('image-output');
    outputDiv.innerHTML = ''; 
    
    const selectedCheckboxes = document.querySelectorAll('#checklist input[type="checkbox"]:checked');
    
    if (selectedCheckboxes.length === 0) {
        outputDiv.innerHTML = '<p>Seleziona almeno un elemento per visualizzarlo.</p>';
        return;
    }
    
    selectedCheckboxes.forEach(checkbox => {
        const imagePath = checkbox.value; 
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = checkbox.nextElementSibling.textContent; 
        
        outputDiv.appendChild(img);
    });
}

// Avvia l'applicazione chiamando la funzione initApp quando la pagina è caricata
window.onload = initApp;
