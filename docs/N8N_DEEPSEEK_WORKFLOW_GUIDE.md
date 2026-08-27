# 🤖 Guía Técnica de Configuración: Workflow n8n + DeepSeek API (ViniChat)

> **Proyecto**: ViniGames  
> **Módulo**: Asistente IA Conversacional (ViniChat)  
> **Responsable**: Eduardo Ribera (Líder Técnico & Backend)  
> **Tecnologías**: n8n Automation Engine + DeepSeek API (`deepseek-chat`) + Supabase PostgreSQL + Next.js 16 Server Actions  

---

## 📌 1. Visión y Flujo de Datos

El motor de **ViniChat** implementa una arquitectura desacoplada y orientada a eventos. Cuando un usuario interactúa con la interfaz de chat en Next.js, la Server Action `sendChatMessageAction` despacha una solicitud HTTP POST al Webhook de **n8n** (hospedado en Railway Cloud), el cual enriquece el contexto con los datos de *Gamer DNA*, biblioteca y catálogo disponible antes de invocar al modelo **`deepseek-chat`** de DeepSeek.

```mermaid
sequenceDiagram
    autonumber
    actor User as 🎮 Gamer
    participant Next as ⚡ Next.js (/chat & Server Action)
    participant N8N as 🔄 n8n Webhook (Railway Cloud)
    participant Supabase as 🗄️ Supabase DB
    participant DeepSeek as 🧠 DeepSeek API (deepseek-chat)

    User->>Next: Envía mensaje ("Recomiéndame un RPG según mi ADN")
    Next->>Supabase: Registra mensaje usuario (sender: 'USER')
    Next->>Supabase: Consulta Gamer DNA (profiles) & Biblioteca (user_library)
    Next->>N8N: HTTP POST /webhook/vinichat (userId, message, sessionId, gamerDna, userOwnedGameIds, catalog)
    N8N->>DeepSeek: HTTP POST /chat/completions (System Prompt con Gamer DNA + JSON Schema)
    DeepSeek-->>N8N: JSON { reply, recommended_game_ids, topic_detected }
    N8N-->>Next: Retorna payload estructurado
    Next->>Supabase: Registra respuesta asistente (sender: 'ASSISTANT')
    Next->>Supabase: Carga tarjetas de videojuegos recomendados
    Next-->>User: Renderiza respuesta con Markdown + Tarjetas interactivas de compra
```

---

## 🛠️ 2. Especificación de los Nodos del Workflow en n8n

El workflow se compone de 4 nodos principales estructurados en serie:

### 1️⃣ Nodo Webhook (Entrada)
- **Tipo de Nodo**: `Webhook`
- **Nombre**: `Webhook ViniChat`
- **HTTP Method**: `POST`
- **Path**: `vinichat`
- **URL en Producción**: `https://n8n-production-cea7.up.railway.app/webhook/vinichat`
- **Respond**: `Using 'Respond to Webhook' Node`

---

### 2️⃣ Nodo Code (Preparación de Catálogo y Prompt)
- **Tipo de Nodo**: `Code`
- **Nombre**: `Preparar Prompt & Contexto`
- **Lenguaje**: `JavaScript`
- **Lógica**: Extrae el mensaje, el Gamer DNA, la biblioteca de juegos ya comprados y el catálogo con precios y descuentos para instruir al System Prompt de la IA.

---

### 3️⃣ Nodo HTTP Request (DeepSeek API)
- **Tipo de Nodo**: `HTTP Request`
- **Nombre**: `DeepSeek API (deepseek-chat)`
- **Method**: `POST`
- **URL**: `https://api.deepseek.com/chat/completions`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer sk-bb38e1b5625d455ba152128f24483fb0`

---

### 4️⃣ Nodo Respond to Webhook (Salida)
- **Tipo de Nodo**: `Respond to Webhook`
- **Nombre**: `Retornar Respuesta Estructurada`
- **Respond With**: `JSON`
- **Formato retornado**:
  ```json
  {
    "reply": "Texto formateado en Markdown...",
    "recommended_game_ids": [1, 2],
    "topic_detected": "Recomendaciones"
  }
  ```

---

## 🚀 3. Vinculación con Next.js y Vercel

En el archivo `.env.local` y en las variables de entorno de Vercel:

```env
N8N_WEBHOOK_URL=https://n8n-production-cea7.up.railway.app/webhook/vinichat
NEXT_PUBLIC_N8N_VINICHAT_WEBHOOK_URL=https://n8n-production-cea7.up.railway.app/webhook/vinichat
```

---

## 🛡️ 4. Mecanismo de Contingencia (Smart Fallback)

Si por algún motivo la conexión de red hacia n8n o la API de DeepSeek supera los 8 segundos de timeout, `sendChatMessageAction` en `app/actions/chat.actions.ts` activa el **Smart Fallback** local para responder con el catálogo de respaldo, garantizando que la aplicación web nunca falle ni muestre errores en pantalla al usuario.
