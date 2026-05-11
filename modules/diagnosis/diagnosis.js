/**
 * Módulo de Diagnóstico Visual
 * Maneja la carga de imágenes y análisis simulado de plantas
 */

// Mapeo de enfermedades a productos recomendados
const diseaseToProducts = {
    'Tizón tardío': ['p002', 'p006'],
    'Tizón tardío (Phytophthora infestans)': ['p002', 'p006'],
    'Tizón temprano': ['p002', 'p006'],
    'Mildiu velloso': ['p002', 'p006'],
    'Oídio': ['p011'],
    'Antracnosis': ['p002', 'p006'],
    'Mancha bacteriana': ['p002'],
    'Pulgones': ['p003', 'p005'],
    'Mosca blanca': ['p003', 'p005'],
    'Ácaros': ['p005', 'p011'],
    'Araña roja': ['p005', 'p011'],
    'Gusanos': ['p008'],
    'Larvas': ['p008'],
    'Planta sana': ['p001', 'p007', 'p012']
};

// Catálogo ampliado de posibles diagnósticos para resultados pseudo-aleatorios
const diagnosisCatalog = [
    {
        disease: 'Tizón tardío (Phytophthora infestans)',
        symptoms: 'Manchas marrones en hojas con bordes amarillentos, lesiones en tallos',
        treatment: 'Aplicar fungicida cúprico cada 7-10 días; eliminar partes afectadas',
        prevention: 'Evitar exceso de humedad, mejorar ventilación, rotación de cultivos'
    },
    {
        disease: 'Mildiu velloso',
        symptoms: 'Manchas amarillas en el haz y pelusa blanca-grisácea en el envés',
        treatment: 'Fungicida sistémico específico para oomicetos cada 10-14 días',
        prevention: 'Reducir riego por aspersión, aumentar espaciamiento entre plantas'
    },
    {
        disease: 'Oídio (Erysiphe spp.)',
        symptoms: 'Polvillo blanco en hojas y tallos, deformación foliar',
        treatment: 'Azufre mojable o bicarbonato potásico cada 7 días',
        prevention: 'Buena ventilación, evitar riego foliar, eliminar restos vegetales'
    },
    {
        disease: 'Antracnosis',
        symptoms: 'Manchas hundidas circulares marrones en frutos y hojas',
        treatment: 'Fungicida a base de cobre o mancozeb',
        prevention: 'Mejorar drenaje, eliminar plantas enfermas y restos'
    },
    {
        disease: 'Mancha bacteriana',
        symptoms: 'Pequeñas manchas oscuras con halo amarillo en hojas',
        treatment: 'Productos cúpricos; evitar trabajar con plantas mojadas',
        prevention: 'Usar semillas certificadas, desinfectar herramientas'
    },
    {
        disease: 'Pulgones (áfidos)',
        symptoms: 'Insectos pequeños agrupados en brotes tiernos, hojas rizadas',
        treatment: 'Jabón potásico o aceite de neem; introducir mariquitas',
        prevention: 'Vigilancia frecuente, plantas trampa, control biológico'
    },
    {
        disease: 'Mosca blanca',
        symptoms: 'Insectos blancos pequeños bajo las hojas, melaza pegajosa',
        treatment: 'Trampas amarillas adhesivas, jabón potásico, neem',
        prevention: 'Mallas anti-insectos, eliminar malas hierbas hospederas'
    },
    {
        disease: 'Araña roja (Tetranychus urticae)',
        symptoms: 'Punteado amarillo en hojas, telarañas finas en el envés',
        treatment: 'Aceite de neem o azufre; aumentar humedad ambiental',
        prevention: 'Mantener humedad relativa alta, evitar estrés hídrico'
    },
    {
        disease: 'Deficiencia de nitrógeno',
        symptoms: 'Hojas viejas amarillentas, crecimiento lento, plantas pequeñas',
        treatment: 'Aplicar fertilizante rico en nitrógeno (urea, NPK alto en N)',
        prevention: 'Análisis de suelo periódico, abonado equilibrado'
    },
    {
        disease: 'Deficiencia de potasio',
        symptoms: 'Bordes de hojas quemados, frutos pequeños y de baja calidad',
        treatment: 'Sulfato de potasio o cenizas vegetales',
        prevention: 'Suplemento de potasio en floración y fructificación'
    },
    {
        disease: 'Planta sana',
        symptoms: 'Sin síntomas visibles de enfermedad',
        treatment: 'Continuar con el manejo agronómico habitual',
        prevention: 'Mantener buenas prácticas agrícolas y monitoreo regular'
    }
];

function getRecommendedProducts(diseaseName) {
    for (const [disease, products] of Object.entries(diseaseToProducts)) {
        if (diseaseName.toLowerCase().includes(disease.toLowerCase()) ||
            disease.toLowerCase().includes(diseaseName.toLowerCase())) {
            return products;
        }
    }
    return ['p001', 'p007'];
}

// Hash simple del archivo para resultados deterministas por imagen
async function hashFile(file) {
    try {
        const buffer = await file.slice(0, Math.min(file.size, 100000)).arrayBuffer();
        if (crypto && crypto.subtle) {
            const digest = await crypto.subtle.digest('SHA-256', buffer);
            const view = new DataView(digest);
            return view.getUint32(0);
        }
    } catch (e) {}
    // Fallback: combina tamaño + nombre
    let h = 0;
    const s = (file.name || '') + file.size;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
}

// Genera 3 resultados deterministas pero variados por imagen
async function generateMockResults(file) {
    const seed = await hashFile(file);
    const picks = new Set();
    const results = [];

    // Confianza del top entre 65 y 92%
    const topConfidence = 0.65 + ((seed % 28) / 100);

    // Elegir 3 enfermedades distintas
    let i = 0;
    while (picks.size < 3 && i < 20) {
        const idx = (seed + i * 7) % diagnosisCatalog.length;
        picks.add(idx);
        i++;
    }

    const indices = Array.from(picks).slice(0, 3);
    indices.forEach((idx, n) => {
        const entry = diagnosisCatalog[idx];
        let confidence;
        if (n === 0) confidence = topConfidence;
        else if (n === 1) confidence = Math.max(0.15, topConfidence - 0.20 - (seed % 10) / 100);
        else confidence = Math.max(0.05, topConfidence - 0.50 - (seed % 15) / 100);

        results.push({ ...entry, confidence: Math.round(confidence * 100) / 100 });
    });

    return results;
}

window.initDiagnosis = function() {
    setTimeout(() => {
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

        if (!fileInput) {
            console.error('No se encontró el input de archivo');
            return;
        }

        // Inyectar disclaimer demo si no existe
        const cardBody = uploadArea?.parentElement;
        if (cardBody && !cardBody.querySelector('.demo-disclaimer')) {
            const disclaimer = document.createElement('div');
            disclaimer.className = 'demo-disclaimer';
            disclaimer.innerHTML = `
                <span class="demo-badge">DEMO</span>
                <strong class="ms-2">Modo demostración:</strong>
                Este diagnóstico genera resultados simulados basados en la imagen para mostrar el funcionamiento.
                Para producción se entrenaría un modelo TensorFlow.js con dataset PlantVillage. No tomar decisiones agronómicas sólo con esta herramienta.
            `;
            cardBody.insertBefore(disclaimer, uploadArea);
        }

        let selectedImage = null;

        const showPreview = (file) => {
            selectedImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                resultsArea.style.display = 'none';
            };
            reader.onerror = () => {
                window.utils.showToast('Error al leer la imagen. Intenta con otra.', 'danger');
            };
            reader.readAsDataURL(file);
        };

        const handleFile = (file) => {
            if (!file) return;
            if (!file.type.match('image.*')) {
                window.utils.showToast('Por favor selecciona una imagen válida (JPG o PNG)', 'warning');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                window.utils.showToast('La imagen es muy grande. Máximo 10MB', 'warning');
                return;
            }
            showPreview(file);
        };

        const handleImageSelect = (e) => {
            handleFile(e.target.files[0]);
        };

        cameraInput.addEventListener('change', handleImageSelect);
        fileInput.addEventListener('change', handleImageSelect);

        // Drag & drop
        ['dragenter', 'dragover'].forEach((evt) => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.add('upload-area-dragover');
            });
        });

        ['dragleave', 'drop'].forEach((evt) => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('upload-area-dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt && dt.files && dt.files[0];
            handleFile(file);
        });

        // Pegar imagen del portapapeles
        document.addEventListener('paste', (e) => {
            // Solo si la página de diagnóstico está activa
            if (!document.getElementById('upload-area')) return;
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        handleFile(file);
                        window.utils.showToast('Imagen pegada del portapapeles', 'info');
                        break;
                    }
                }
            }
        });

        removeImageBtn.addEventListener('click', () => {
            selectedImage = null;
            previewImage.src = '';
            cameraInput.value = '';
            fileInput.value = '';
            uploadArea.style.display = 'block';
            previewArea.style.display = 'none';
            resultsArea.style.display = 'none';
        });

        analyzeBtn.addEventListener('click', async () => {
            if (!selectedImage) {
                window.utils.showToast('No hay imagen para analizar', 'warning');
                return;
            }

            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Analizando...';

            try {
                // Pequeña espera para simular procesamiento
                await new Promise((r) => setTimeout(r, 1500));
                const mockResults = await generateMockResults(selectedImage);

                displayResults(mockResults);

                const topDiagnosis = mockResults[0];
                const diagnosisData = {
                    disease: topDiagnosis.disease,
                    confidence: topDiagnosis.confidence,
                    timestamp: new Date().toISOString(),
                    recommendedProducts: getRecommendedProducts(topDiagnosis.disease)
                };

                if (window.utils?.storage) {
                    window.utils.storage.set('lastDiagnosis', diagnosisData);

                    // Mantener historial (últimos 10)
                    const history = window.utils.storage.get('diagnosisHistory') || [];
                    history.unshift(diagnosisData);
                    window.utils.storage.set('diagnosisHistory', history.slice(0, 10));
                }

                previewArea.style.display = 'none';
                resultsArea.style.display = 'block';
            } catch (err) {
                console.error('Error analizando imagen:', err);
                window.utils.showToast('Error al analizar la imagen', 'danger');
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="bi bi-cpu me-2"></i>Analizar Planta';
            }
        });

        const displayResults = (results) => {
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

        newAnalysisBtn.addEventListener('click', () => {
            selectedImage = null;
            previewImage.src = '';
            cameraInput.value = '';
            fileInput.value = '';
            uploadArea.style.display = 'block';
            previewArea.style.display = 'none';
            resultsArea.style.display = 'none';
            diagnosisResults.innerHTML = '';
        });
    }, 100);
};
