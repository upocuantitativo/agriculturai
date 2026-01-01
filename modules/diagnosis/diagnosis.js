/**
 * Módulo de Diagnóstico Visual
 * Maneja la carga de imágenes y análisis de plantas
 */

// Función de inicialización de la página de diagnóstico
window.initDiagnosis = function() {
    console.log('=== INICIO initDiagnosis ===');

    // Esperar a que el DOM esté listo
    setTimeout(() => {
        console.log('Buscando elementos del DOM...');

        const cameraInput = document.getElementById('camera-input');
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        const previewArea = document.getElementById('preview-area');
        const resultsArea = document.getElementById('results-area');
        const previewImage = document.getElementById('preview-image');
        const removeImageBtn = document.getElementById('remove-image');
        const analyzeBtn = document.getElementById('analyze-btn');
        const newAnalysisBtn = document.getElementById('new-analysis');
        const diagnosisResults = document.getElementById('diagnosis-results');

        console.log('Elementos encontrados:', {
            cameraInput: !!cameraInput,
            fileInput: !!fileInput,
            uploadArea: !!uploadArea,
            previewArea: !!previewArea
        });

        if (!fileInput) {
            console.error('ERROR: No se encontró el input de archivo');
            return;
        }

        let selectedImage = null;

        // Manejar selección de imagen (cámara o archivo)
        const handleImageSelect = (e) => {
            console.log('handleImageSelect llamado');
            const file = e.target.files[0];

            if (!file) {
                console.log('No se seleccionó archivo');
                return;
            }

            console.log('Archivo seleccionado:', file.name, file.type, file.size);

            // Validar tipo de archivo
            if (!file.type.match('image.*')) {
                console.log('ERROR: No es una imagen');
                alert('Por favor selecciona una imagen válida (JPG o PNG)');
                return;
            }

            // Validar tamaño (10MB - más permisivo)
            if (file.size > 10 * 1024 * 1024) {
                console.log('ERROR: Imagen muy grande');
                alert('La imagen es muy grande. Tamaño máximo: 10MB');
                return;
            }

            // Guardar archivo original
            selectedImage = file;
            console.log('Imagen guardada, iniciando lectura...');

            // Mostrar preview inmediatamente
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('FileReader completado, mostrando imagen');
                previewImage.src = e.target.result;
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                resultsArea.style.display = 'none';
                console.log('Preview mostrado');
            };
            reader.onerror = () => {
                console.error('Error en FileReader');
                alert('Error al leer la imagen. Intenta con otra imagen.');
            };
            reader.readAsDataURL(file);
        };

        console.log('Agregando event listeners...');
        cameraInput.addEventListener('change', handleImageSelect);
        fileInput.addEventListener('change', handleImageSelect);
        console.log('Event listeners agregados');

        // Remover imagen
        removeImageBtn.addEventListener('click', () => {
            console.log('Removiendo imagen');
            selectedImage = null;
            previewImage.src = '';
            cameraInput.value = '';
            fileInput.value = '';
            uploadArea.style.display = 'block';
            previewArea.style.display = 'none';
            resultsArea.style.display = 'none';
        });

        // Analizar imagen
        analyzeBtn.addEventListener('click', () => {
            console.log('Botón analizar clickeado');

            if (!selectedImage) {
                console.log('ERROR: No hay imagen seleccionada');
                alert('No hay imagen para analizar');
                return;
            }

            // Mostrar loading
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Analizando...';
            console.log('Iniciando análisis simulado...');

            // Simular análisis (2 segundos)
            setTimeout(() => {
                console.log('Generando resultados...');
                // Resultados de ejemplo (simulados)
                const mockResults = [
                    {
                        disease: 'Tizón tardío (Phytophthora infestans)',
                        confidence: 0.87,
                        symptoms: 'Manchas marrones en hojas, bordes amarillentos',
                        treatment: 'Aplicar fungicida cúprico cada 7-10 días',
                        prevention: 'Evitar exceso de humedad, mejorar ventilación'
                    },
                    {
                        disease: 'Mildiu velloso',
                        confidence: 0.65,
                        symptoms: 'Manchas amarillas en haz, pelusa blanca en envés',
                        treatment: 'Fungicida sistémico específico para mildiu',
                        prevention: 'Reducir riego por aspersión, aumentar espaciamiento'
                    },
                    {
                        disease: 'Planta sana',
                        confidence: 0.12,
                        symptoms: 'No se detectan síntomas evidentes',
                        treatment: 'Continuar con manejo normal del cultivo',
                        prevention: 'Mantener buenas prácticas agrícolas'
                    }
                ];

                displayResults(mockResults);

                previewArea.style.display = 'none';
                resultsArea.style.display = 'block';

                // Restaurar botón
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="bi bi-cpu me-2"></i>Analizar Planta';
                console.log('Análisis completado y mostrado');

            }, 2000);
        });

        // Mostrar resultados
        const displayResults = (results) => {
            console.log('Mostrando resultados:', results.length);
            diagnosisResults.innerHTML = '';

            results.forEach((result, index) => {
                const confidencePercent = Math.round(result.confidence * 100);
                const confidenceClass = confidencePercent >= 70 ? 'confidence-high' :
                                       confidencePercent >= 40 ? 'confidence-medium' :
                                       'confidence-low';

                const resultCard = document.createElement('div');
                resultCard.className = 'diagnosis-result';
                resultCard.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="mb-0">${index + 1}. ${result.disease}</h5>
                        <span class="badge ${confidenceClass === 'confidence-high' ? 'bg-success' :
                                              confidenceClass === 'confidence-medium' ? 'bg-warning' :
                                              'bg-secondary'}">
                            ${confidencePercent}%
                        </span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill ${confidenceClass}" style="width: ${confidencePercent}%"></div>
                    </div>
                    <div class="mt-3">
                        <p class="mb-2"><strong><i class="bi bi-search me-2"></i>Síntomas:</strong> ${result.symptoms}</p>
                        <p class="mb-2"><strong><i class="bi bi-capsule me-2"></i>Tratamiento:</strong> ${result.treatment}</p>
                        <p class="mb-0"><strong><i class="bi bi-shield-check me-2"></i>Prevención:</strong> ${result.prevention}</p>
                    </div>
                `;
                diagnosisResults.appendChild(resultCard);
            });
        };

        // Nuevo análisis
        newAnalysisBtn.addEventListener('click', () => {
            selectedImage = null;
            previewImage.src = '';
            cameraInput.value = '';
            fileInput.value = '';
            uploadArea.style.display = 'block';
            previewArea.style.display = 'none';
            resultsArea.style.display = 'none';
            diagnosisResults.innerHTML = '';
            console.log('Reiniciado para nuevo análisis');
        });

        console.log('=== initDiagnosis completado ===');

    }, 100); // Fin del setTimeout
};
