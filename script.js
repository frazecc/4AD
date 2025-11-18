// VARIABILE GLOBALE PER SALVARE TUTTE LE RISORSE CARICATE
let allImageResources = [];

// Funzione principale: carica il JSON e avvia la costruzione della lista
async function initApp() {
    const checklistDiv = document.getElementById('checklist-output'); // Nota il cambio di ID
    checklistDiv.innerHTML = 'Caricamento file di configurazione...';

    try {
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
    
    // Rimuoviamo il vecchio #image-output e creiamo la griglia delle colonne
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
        groupCheckbox.checked = true; 
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
    // Cerchiamo tutte le immagini selezionate tra tutte le colonne
    const selectedImages = [];
    const allCheckboxes = document.querySelectorAll('.column-checklist input[type="checkbox"]:checked');
    
    allCheckboxes.forEach(checkbox => {
        // Ignoriamo le checkbox di gruppo (che non hanno valore o alt)
        if (checkbox.value) {
            // Troviamo il nome leggibile cercando il label associato
            const imageLabel = document.querySelector(`label[for="${checkbox.id}"]`).textContent;
            
            selectedImages.push({
                path: checkbox.value,
                name: imageLabel
            });
        }
    });

    const outputDiv = document.getElementById('results');
    // Rimuove il vecchio contenuto sotto la sezione Risorse Selezionate
    let oldImageOutput = document.getElementById('final-image-output');
    if (oldImageOutput) {
        oldImageOutput.remove();
    }
    
    const finalImageOutput = document.createElement('div');
    finalImageOutput.id = 'final-image-output';
    finalImageOutput.style.marginTop = '20px';
    outputDiv.appendChild(finalImageOutput);


    if (selectedImages.length === 0) {
        finalImageOutput.innerHTML = '<p>Seleziona almeno un elemento per visualizzarlo.</p>';
        return;
    }

    // Qui creiamo la visualizzazione delle immagini selezionate, separata dalle checklist
    selectedImages.forEach(image => {
        const img = document.createElement('img');
        img.src = image.path;
        img.alt = image.name; 
        
        // Al click, apre l'immagine a schermo intero
        img.onclick = () => window.open(image.path, '_blank');
        img.style.cursor = 'pointer'; 

        finalImageOutput.appendChild(img);
    });
}

// Funzione che apre l'immagine a schermo intero (è ancora necessaria, ma la usiamo in linea)
function showFullscreen(imagePath) {
    window.open(imagePath, '_blank');
}

// Avvia l'applicazione chiamando la funzione initApp quando la pagina è caricata
window.onload = initApp;
