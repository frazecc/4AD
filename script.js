// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    let imageResources = [];
    
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

        // Ordinamento alfabetico per nome
        imageResources.sort((a, b) => a.name.localeCompare(b.name));
        
    } catch (error) {
        checklistDiv.innerHTML = `<p style="color: red; font-weight: bold;">ERRORE DI CARICAMENTO!</p><p style="color: red;">Dettagli: ${error.message}</p>`;
        console.error("Errore nel caricamento del JSON:", error);
        return; 
    }

    // Passa le risorse alla funzione che le renderizza
    renderChecklist(imageResources);
    displaySelectedImages();
}

// NUOVA FUNZIONE DI GRUPPO: Seleziona/Deseleziona tutti gli elementi di una sottocartella
function toggleGroup(groupName, checked) {
    // Seleziona tutte le checkbox che appartengono a questo gruppo (groupName)
    const checkboxes = document.querySelectorAll(`input[data-group="${groupName}"]`);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    
    // Aggiorna immediatamente la visualizzazione delle immagini
    displaySelectedImages();
}


// Funzione per generare la lista di spunta (Checklist)
function renderChecklist(resources) {
    const checklistDiv = document.getElementById('checklist');
    checklistDiv.innerHTML = ''; 
    
    // 1. Raggruppa le risorse per nome della sottocartella (group)
    const groupedResources = resources.reduce((acc, resource) => {
        const group = resource.group || 'Altro'; // Usa 'Altro' se group non è definito
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(resource);
        return acc;
    }, {});
    
    // 2. Itera sui gruppi (sottocartelle) e crea i selettori di gruppo
    for (const groupName in groupedResources) {
        // Crea l'intestazione del gruppo
        const groupHeader = document.createElement('h3');
        groupHeader.style.marginTop = '15px';
        groupHeader.style.marginBottom = '5px';
        groupHeader.style.fontSize = '1.1em';
        groupHeader.style.color = '#bb86fc';
        
        // Crea la checkbox principale del gruppo
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.id = `group-${groupName}`;
        groupCheckbox.checked = true; // Seleziona il gruppo di default
        // Collega la funzione toggleGroup al click sulla checkbox
        groupCheckbox.onchange = (e) => toggleGroup(groupName, e.target.checked);
        
        const groupLabel = document.createElement('label');
        groupLabel.htmlFor = groupCheckbox.id;
        groupLabel.textContent = groupName.toUpperCase(); // Mostra il nome della cartella in maiuscolo
        
        checklistDiv.appendChild(groupHeader);
        checklistDiv.appendChild(groupCheckbox);
        checklistDiv.appendChild(groupLabel);
        checklistDiv.appendChild(document.createElement('hr')); // Linea separatrice
        
        // 3. Itera sugli elementi singoli all'interno del gruppo
        groupedResources[groupName].forEach((resource, index) => {
            const inputId = `img-checkbox-${groupName}-${index}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = inputId;
            checkbox.value = resource.path;
            checkbox.checked = true; 
            checkbox.onchange = displaySelectedImages; 
            checkbox.setAttribute('data-group', groupName); // Aggiunge l'attributo per il selettore di gruppo
            
            const label = document.createElement('label');
            label.htmlFor = inputId;
            label.textContent = resource.name;
            
            checklistDiv.appendChild(checkbox);
            checklistDiv.appendChild(label);
            checklistDiv.appendChild(document.createElement('br'));
        });
        
        checklistDiv.appendChild(document.createElement('br')); // Spazio dopo il gruppo
    }
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
        // Ignora le checkbox di gruppo, gestisce solo quelle singole
        if (checkbox.id.startsWith('group-')) {
            return;
        }

        const imagePath = checkbox.value; 
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = checkbox.nextElementSibling.textContent; 
        
        // Al click, apre l'immagine a schermo intero
        img.onclick = () => window.open(imagePath, '_blank');
        img.style.cursor = 'pointer'; 

        outputDiv.appendChild(img);
    });
}

// Avvia l'applicazione chiamando la funzione initApp quando la pagina è caricata
window.onload = initApp;
