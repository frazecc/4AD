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
        
        // *******************************************************
        // RIGHE RIMOSSE: gli stili sono ora in style.css!
        // img.style.maxWidth = '100%';
        // img.style.height = 'auto';
        // img.style.display = 'block';
        // img.style.margin = '15px auto'; 
        // *******************************************************

        outputDiv.appendChild(img);
    });
}
