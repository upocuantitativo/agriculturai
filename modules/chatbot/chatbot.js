/**
 * Módulo de Chatbot Agrícola
 * Sistema basado en reglas con intents predefinidos
 */

window.initChat = function() {
    console.log('=== INICIO initChat ===');

    setTimeout(() => {
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const chatForm = document.getElementById('chat-form');
        const clearBtn = document.getElementById('clear-chat');
        const quickButtons = document.querySelectorAll('.quick-suggestion');

        let conversationHistory = window.utils.storage.get('chatHistory') || [];
        let intentsData = null;

        const saveHistory = () => {
            // Limitar a los últimos 50 mensajes para no inflar localStorage
            const trimmed = conversationHistory.slice(-50);
            window.utils.storage.set('chatHistory', trimmed);
        };

        // Cargar intents desde JSON
        async function loadIntents() {
            try {
                console.log('Cargando intents del chatbot...');
                const response = await fetch('data/chat-intents.json');
                const data = await response.json();
                intentsData = data.intents;
                console.log(`${intentsData.length} intents cargados`);
            } catch (error) {
                console.error('Error cargando intents:', error);
                intentsData = [];
            }
        }

        // Agregar mensaje al chat
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = isUser ? '<i class="bi bi-person-circle"></i>' : '<i class="bi bi-robot"></i>';

            const content = document.createElement('div');
            content.className = 'message-content';
            content.innerHTML = text.replace(/\n/g, '<br>');

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            chatMessages.appendChild(messageDiv);

            // Scroll al final
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Detectar intención del mensaje
        function detectIntent(message) {
            const normalizedMessage = message.toLowerCase().trim();

            // Buscar coincidencia en patterns
            for (const intent of intentsData) {
                for (const pattern of intent.patterns) {
                    if (normalizedMessage.includes(pattern.toLowerCase())) {
                        return intent;
                    }
                }
            }

            return null;
        }

        // Generar respuesta con IA
        async function generateResponse(message) {
            const intent = detectIntent(message);

            // Si hay un intent específico, usar la respuesta predefinida
            if (intent) {
                const responses = intent.responses;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                return randomResponse;
            }

            // Si no hay intent, usar IA para generar respuesta
            return await generateAIResponse(message);
        }

        // Generar respuesta usando IA (Hugging Face o modelo local)
        async function generateAIResponse(message) {
            try {
                // Intentar usar Hugging Face Inference API (gratuita)
                const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // API pública sin key requerida para modelos públicos
                    },
                    body: JSON.stringify({
                        inputs: `Eres un asistente agrícola experto. Responde en español de forma clara y concisa.

Pregunta del agricultor: ${message}

Respuesta profesional:`,
                        parameters: {
                            max_length: 300,
                            temperature: 0.7,
                            top_p: 0.9
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data[0] && data[0].generated_text) {
                        return data[0].generated_text;
                    }
                }

                // Si falla la API, usar respuesta de fallback mejorada
                return generateSmartFallback(message);

            } catch (error) {
                console.error('Error generando respuesta con IA:', error);
                return generateSmartFallback(message);
            }
        }

        // Generar respuesta de fallback inteligente
        function generateSmartFallback(message) {
            const messageLower = message.toLowerCase();

            // Intentar dar una respuesta útil basada en palabras clave
            if (messageLower.includes('fertilizante') || messageLower.includes('abono')) {
                return `Para consultas sobre fertilización, te recomiendo:

1. Identificar la etapa del cultivo (crecimiento, floración, fructificación)
2. Análisis de suelo si es posible
3. NPK balanceado 15-15-15 para crecimiento general
4. Mayor fósforo (P) para floración

¿Sobre qué cultivo específico necesitas información?`;
            }

            if (messageLower.includes('enfermedad') || messageLower.includes('hongo') || messageLower.includes('plaga')) {
                return `Para diagnóstico de enfermedades:

1. Usa nuestra función de **Diagnóstico Visual** con foto
2. Observa síntomas: manchas, decoloración, marchitez
3. Verifica humedad y ventilación

¿Puedes describir los síntomas que observas?`;
            }

            if (messageLower.includes('riego') || messageLower.includes('agua')) {
                return `El riego adecuado depende de varios factores:

• **Clima**: Mayor frecuencia en verano
• **Tipo de cultivo**: Raíces profundas vs superficiales
• **Suelo**: Arenoso drena rápido, arcilloso retiene
• **Etapa**: Más agua en floración/fructificación

¿Qué cultivo tienes y en qué clima estás?`;
            }

            // Respuesta general
            return `Puedo ayudarte con información agrícola sobre:

• 🌱 Diagnóstico de enfermedades (usa Diagnóstico Visual con foto)
• 💧 Riego y nutrición
• 🐛 Control de plagas
• 🌾 Información específica de cultivos
• 🧪 Fertilizantes y productos

Por favor, hazme una pregunta más específica o usa nuestras herramientas especializadas.`;
        }

        // Procesar mensaje del usuario
        async function processUserMessage(message) {
            if (!message.trim()) return;

            console.log('Mensaje del usuario:', message);

            // Agregar mensaje del usuario
            addMessage(message, true);

            // Guardar en historial
            conversationHistory.push({
                role: 'user',
                message: message,
                timestamp: new Date().toISOString()
            });
            saveHistory();

            // Limpiar input
            chatInput.value = '';

            // Simular "escribiendo..."
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-avatar"><i class="bi bi-robot"></i></div>
                <div class="message-content">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Generar respuesta (ahora es async)
            try {
                const response = await generateResponse(message);

                // Remover indicador de escritura
                typingDiv.remove();

                // Mostrar respuesta
                addMessage(response, false);

                // Guardar en historial
                conversationHistory.push({
                    role: 'bot',
                    message: response,
                    timestamp: new Date().toISOString()
                });
                saveHistory();

                console.log('Respuesta del bot:', response);
            } catch (error) {
                console.error('Error procesando respuesta:', error);
                typingDiv.remove();
                addMessage('Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.', false);
            }
        }

        // Event listeners
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                processUserMessage(chatInput.value);
            });
        }

        // Botones de preguntas rápidas
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.textContent.trim();
                chatInput.value = question;
                chatInput.focus();
            });
        });

        // Botón limpiar chat
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('¿Deseas limpiar el historial del chat?')) {
                    conversationHistory = [];
                    window.utils.storage.remove('chatHistory');
                    chatMessages.innerHTML = '';
                    showWelcomeMessage();
                }
            });
        }

        // Restaurar mensajes previos
        function restoreHistory() {
            if (!conversationHistory.length) return false;
            conversationHistory.forEach((msg) => {
                addMessage(msg.message, msg.role === 'user');
            });
            return true;
        }

        // Mensaje de bienvenida
        function showWelcomeMessage() {
            addMessage(`¡Hola! 👋 Soy tu asistente agrícola virtual.

Puedo ayudarte con:
• Diagnóstico de enfermedades
• Recomendaciones de fertilización
• Manejo de plagas
• Información sobre cultivos
• Consejos de riego

¿En qué puedo ayudarte hoy?`, false);
        }

        // Inicializar
        async function init() {
            await loadIntents();
            const restored = restoreHistory();
            if (!restored) {
                showWelcomeMessage();
            }
            chatInput.focus();
            console.log('=== initChat completado ===');
        }

        init();

    }, 100);
};
