// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    let imageResources = [];
    
    // Riferimento al div dove mostrare la lista di spunta
    const checklistDiv = document.getElementById('checklist');
    checklistDiv.innerHTML = 'Caricamento file di configurazione...';

    try {
        // Legge il file files.json generato dall'azione GitHub
        const response = await fetch('files.json');
        
        if (!response.ok) {
            // Se non trova il file, lo notifica
            throw new Error(`Impossibile trovare files.json (Status: ${response.status}). Assicurati che l'azione GitHub sia stata completata.`);
        }
        
        // Converte il JSON in un oggetto JavaScript
        imageResources = await response.json();
    } catch (error) {
        checklistDiv.innerHTML = `<p style="color: red;">Errore di caricamento: ${error.message}.</p>`;
        console.error("Errore nel caricamento del JSON:", error);
        return; 
    }

    // Se il caricamento ha successo, procedi a costruire la lista
    renderChecklist(imageResources);
    // Visualizza le immagini di default (tutte spuntate)
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
        
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '15px auto'; 

        outputDiv.appendChild(img);
    });
}

// Avvia l'applicazione chiamando la funzione initApp
window.onload = initApp;
