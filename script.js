// VARIABILE GLOBALE PER SALVARE TUTTE LE RISORSE CARICATE
let allImageResources = [];

// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    const checklistDiv = document.getElementById('checklist-output'); 
    checklistDiv.innerHTML = 'Caricamento file di configurazione...';

    try {
        // ANTI-CACHE: Aggiungiamo un timestamp per forzare il download del file aggiornato
        const jsonPath = '/4AD/files.json'; 
        const cacheBuster = `?v=${new Date().getTime()}`; 
        const fullPath = jsonPath + cacheBuster; 
        
        const response = await fetch(fullPath);
        
        if (!response.ok) {
            throw new Error(`Impossibile trovare files.json (Status: ${response.status}).`);
        }
        
        allImageResources = await response.json();

        // Ordinamento alfabetico per nome
        allImageResources.sort((a, b) => a.name.localeCompare(b.name));
        
    } catch (error) {
        checklistDiv.innerHTML = `<p style="color: red; font-weight: bold;">ERRORE DI CARICAMENTO!</p><p style="color: red;">Dettagli: ${error.message}</p>`;
        console.error("Errore nel caricamento del JSON:", error);
        return; 
    }

    renderChecklist(allImageResources);
    displaySelectedImages();
}

// Funzione di Gruppo: Seleziona/Deseleziona tutti gli elementi di una sottocartella
function toggleGroup(groupName, checked) {
    // Seleziona tutte le checkbox che appartengono a questo gruppo (groupName)
    const checkboxes = document.querySelectorAll(`input[data-group="${groupName}"]`);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
    });
    
    // Aggiorna immediatamente la visualizzazione delle immagini
    displaySelectedImages();
}


// Funzione per generare le colonne della lista di spunta
function renderChecklist(resources) {
    const checklistOutputDiv = document.getElementById('checklist-output');
    checklistOutputDiv.innerHTML = ''; 
    
    // 1. Raggruppa le risorse per nome della sottocartella (group)
    const groupedResources = resources.reduce((acc, resource) => {
        const group = resource.group || 'altro'; 
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(resource);
        return acc;
    }, {});
    
    // Creiamo la griglia delle colonne
    const imageOutputGrid = document.createElement('div');
    imageOutputGrid.id = 'image-output'; 
    
    // 2. Itera sui gruppi (sottocartelle) e crea la COLONNA per ciascuno
    for (const groupName in groupedResources) {
        
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('image-column');
        
        // --- HEADER DELLA COLONNA (Titolo + Checkbox Gruppo) ---
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('column-header');
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = groupName.toUpperCase();
        
        // Checkbox principale del gruppo
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.id = `group-${groupName}`;
        groupCheckbox.checked = true; // Seleziona il gruppo di default
        groupCheckbox.onchange = (e) => toggleGroup(groupName, e.target.checked);
        
        headerDiv.appendChild(headerTitle);
        headerDiv.appendChild(groupCheckbox);
        columnDiv.appendChild(headerDiv);

        // --- LISTA CHECKBOX SINGOLE ---
        const checklistContainer = document.createElement('div');
        checklistContainer.classList.add('column-checklist');

        groupedResources[groupName].forEach((resource, index) => {
            const inputId = `img-checkbox-${groupName}-${index}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = inputId;
            checkbox.value = resource.path;
            checkbox.checked = true; 
            checkbox.onchange = displaySelectedImages; // Aggiorna le immagini
            checkbox.setAttribute('data-group', groupName); // Attributo per il selettore di gruppo
            
            const label = document.createElement('label');
            label.htmlFor = inputId;
            label.textContent = resource.name;
            
            checklistContainer.appendChild(checkbox);
            checklistContainer.appendChild(label);
            checklistContainer.appendChild(document.createElement('br'));
        });
        
        columnDiv.appendChild(checklistContainer);
        imageOutputGrid.appendChild(columnDiv);
    }
    
    checklistOutputDiv.appendChild(imageOutputGrid);
}


// Funzione per visualizzare solo le immagini spuntate
function displaySelectedImages() {
    const selectedImages = [];
