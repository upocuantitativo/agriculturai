# Modelos de Machine Learning

Esta carpeta contiene los modelos de TensorFlow.js para el diagnóstico visual de enfermedades en plantas.

## Modelo de Diagnóstico de Enfermedades

### Opción 1: Usar modelo pre-convertido (RECOMENDADO)

El modelo más usado es MobileNetV2 entrenado con el dataset PlantVillage.

**Modelo recomendado:**
- **Hugging Face**: [linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification](https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification)
- **Clases**: 38 enfermedades de plantas
- **Precisión**: ~95%
- **Tamaño**: ~9MB

**Pasos para integrar:**

1. **Descargar el modelo** de Hugging Face o TensorFlow Hub

2. **Convertir a TensorFlow.js** (si no está ya convertido):
   ```bash
   # Instalar tensorflowjs
   pip install tensorflowjs

   # Convertir modelo
   tensorflowjs_converter \
       --input_format=tf_saved_model \
       --output_format=tfjs_graph_model \
       --signature_name=serving_default \
       --saved_model_tags=serve \
       path/to/saved_model \
       plant-disease/
   ```

3. **Copiar archivos** a esta carpeta:
   ```
   models/plant-disease/
   ├── model.json
   ├── group1-shard1of1.bin (o weights.bin)
   └── labels.json
   ```

4. **Crear archivo labels.json** con las 38 clases:
   ```json
   [
     "Apple___Apple_scab",
     "Apple___Black_rot",
     "Apple___Cedar_apple_rust",
     "Apple___healthy",
     "Blueberry___healthy",
     "Cherry_(including_sour)___healthy",
     "Cherry_(including_sour)___Powdery_mildew",
     "Corn_(maize)___Cercospora_leaf_spot",
     "Corn_(maize)___Common_rust_",
     "Corn_(maize)___healthy",
     "Corn_(maize)___Northern_Leaf_Blight",
     "Grape___Black_rot",
     "Grape___Esca_(Black_Measles)",
     "Grape___healthy",
     "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
     "Orange___Haunglongbing_(Citrus_greening)",
     "Peach___Bacterial_spot",
     "Peach___healthy",
     "Pepper,_bell___Bacterial_spot",
     "Pepper,_bell___healthy",
     "Potato___Early_blight",
     "Potato___healthy",
     "Potato___Late_blight",
     "Raspberry___healthy",
     "Soybean___healthy",
     "Squash___Powdery_mildew",
     "Strawberry___healthy",
     "Strawberry___Leaf_scorch",
     "Tomato___Bacterial_spot",
     "Tomato___Early_blight",
     "Tomato___healthy",
     "Tomato___Late_blight",
     "Tomato___Leaf_Mold",
     "Tomato___Septoria_leaf_spot",
     "Tomato___Spider_mites_Two-spotted_spider_mite",
     "Tomato___Target_Spot",
     "Tomato___Tomato_mosaic_virus",
     "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
   ]
   ```

### Opción 2: Entrenar tu propio modelo

Si quieres entrenar un modelo personalizado con cultivos locales:

**Datasets disponibles:**
- **PlantVillage**: 54,306 imágenes, 38 clases ([Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease))
- **PlantDoc**: 2,598 imágenes, condiciones reales ([GitHub](https://github.com/pratikkayal/PlantDoc-Dataset))

**Pasos:**

1. **Descargar dataset** PlantVillage
2. **Entrenar en Google Colab** (GPU gratuita):
   ```python
   # Ejemplo básico con TensorFlow/Keras
   import tensorflow as tf
   from tensorflow.keras.applications import MobileNetV2
   from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
   from tensorflow.keras.models import Model

   # Cargar base pre-entrenada
   base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
   base_model.trainable = False

   # Agregar clasificador
   x = base_model.output
   x = GlobalAveragePooling2D()(x)
   x = Dense(128, activation='relu')(x)
   predictions = Dense(38, activation='softmax')(x)

   model = Model(inputs=base_model.input, outputs=predictions)
   model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

   # Entrenar (usa tu dataset)
   # model.fit(train_generator, epochs=10, validation_data=val_generator)

   # Guardar
   model.save('plant_disease_model')
   ```

3. **Convertir a TensorFlow.js** (ver pasos arriba)

### Opción 3: Usar Hugging Face Inference API (más fácil)

Si prefieres no gestionar el modelo localmente, usa la API:

```javascript
// En modules/diagnosis/model.js
const API_URL = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";
const API_KEY = "hf_xxxxx"; // Tu API key

async function diagnoseImage(imageFile) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "image/jpeg"
        },
        body: imageFile
    });
    return await response.json();
}
```

**Ventajas:**
- ✅ No necesitas gestionar modelo pesado
- ✅ Implementación inmediata
- ✅ 30,000 requests/mes gratis

**Desventajas:**
- ❌ Requiere conexión a internet
- ❌ Latencia mayor (~2-3 segundos)
- ❌ Límite de requests

## Estructura esperada

```
models/
└── plant-disease/
    ├── model.json          # Arquitectura del modelo
    ├── weights.bin         # Pesos (o varios shards: group1-shard1of1.bin, etc.)
    ├── labels.json         # Nombres de las clases
    └── README.md           # Este archivo
```

## Recursos útiles

- **Dataset PlantVillage**: https://www.kaggle.com/datasets/emmarex/plantdisease
- **TensorFlow.js**: https://www.tensorflow.org/js
- **Hugging Face Models**: https://huggingface.co/models?pipeline_tag=image-classification&search=plant
- **Tutorial conversión**: https://www.tensorflow.org/js/tutorials/conversion/import_saved_model
- **Google Colab**: https://colab.research.google.com/

## Licencias

- PlantVillage dataset: Dominio público
- MobileNetV2: Apache 2.0
- Hugging Face models: Ver licencia específica de cada modelo

## Contribuir

Si entrenas un modelo mejorado para cultivos locales, considera compartirlo en Hugging Face para que otros lo usen.
