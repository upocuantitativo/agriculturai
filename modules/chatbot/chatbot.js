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

        let conversationHistory = [];
        let intentsData = null;

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

        // Generar respuesta
        function generateResponse(message) {
            const intent = detectIntent(message);

            if (intent) {
                // Seleccionar respuesta aleatoria del intent
                const responses = intent.responses;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                return randomResponse;
            }

            // Respuesta por defecto si no se encuentra intent
            return `No tengo información específica sobre eso. Puedo ayudarte con:

• Enfermedades de plantas (tizón, mildiu, oídio)
• Fertilización (NPK, nutrientes, aplicación)
• Riego (frecuencia, cantidad)
• Control de plagas (pulgones, mosca blanca, ácaros)
• Cultivos específicos (tomate, papa, maíz, etc.)

¿Sobre qué te gustaría saber más?`;
        }

        // Procesar mensaje del usuario
        function processUserMessage(message) {
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

            // Generar respuesta después de un delay
            setTimeout(() => {
                // Remover indicador de escritura
                typingDiv.remove();

                // Generar y mostrar respuesta
                const response = generateResponse(message);
                addMessage(response, false);

                // Guardar en historial
                conversationHistory.push({
                    role: 'bot',
                    message: response,
                    timestamp: new Date().toISOString()
                });

                console.log('Respuesta del bot:', response);
            }, 800 + Math.random() * 400);

            // Limpiar input
            chatInput.value = '';
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
                    chatMessages.innerHTML = '';
                    showWelcomeMessage();
                }
            });
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
            showWelcomeMessage();
            chatInput.focus();
            console.log('=== initChat completado ===');
        }

        init();

    }, 100);
};
