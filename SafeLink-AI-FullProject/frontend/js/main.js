document.addEventListener('DOMContentLoaded', () => {
    const scanForm = document.getElementById('scan-form');
    const loader = document.getElementById('loader-container');
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    let activeTab = 'text';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
            activeTab = tabName;
        });
    });

    // File input functionality
    const fileInput = document.getElementById('file-input');
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileNameDisplay = document.getElementById('file-name');

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = `Selected file: ${fileInput.files[0].name}`;
        }
    });

    // Drag and drop listeners
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
    });
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('drag-over');
    });
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileNameDisplay.textContent = `Selected file: ${files[0].name}`;
        }
    });

    // Form submission
    scanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loader.style.display = 'flex';

        try {
            let result;
            if (activeTab === 'text') {
                const input = document.getElementById('text-input').value.trim();
                if (!input) throw new Error('Text input is empty.');
                result = await scanInput(input);
            } else if (activeTab === 'url') {
                const input = document.getElementById('url-input').value.trim();
                if (!input) throw new Error('URL input is empty.');
                result = await scanInput(input);
            } else if (activeTab === 'file') {
                const file = fileInput.files[0];
                if (!file) throw new Error('No file selected.');
                result = await scanFile(file); // scanFile needs to be in api.js
            }
            
            sessionStorage.setItem('scanResult', JSON.stringify(result));
            window.location.href = 'results.html';

        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        } finally {
            loader.style.display = 'none';
        }
    });
});