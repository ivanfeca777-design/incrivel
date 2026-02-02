
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Correct initialization as per guidelines: use named parameter and process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `És o Assistente de Compras da "Amazing Shop". 
O teu objetivo é ajudar os clientes a encontrar produtos, responder a perguntas sobre a nossa loja e fornecer recomendações.
Sê sempre profissional, amigável e prestável. Responde sempre em Português.

Informações sobre a Amazing Shop:
- Email: ivanfeca777@gmail.com
- Telefone: 921179574
- Localização: Luanda, Angola
- Moeda: Kwanza (KZ)
- Categorias Expandidas:
  1. Eletrónicos & Gaming: Consolas PS5 e PS4, Auscultadores, Cabos HDMI, Carregadores Rápidos.
  2. Material Elétrico Técnico: Tomadas de embutir, disjuntores Hager (unipolares e diferenciais), quadros elétricos, extensões multi-tomadas.
  3. Maquinaria & Escritório: Impressoras industriais Konica, Prensas térmicas de sublimação.
  4. Lifestyle: Bicicletas vintage clássicas.
  5. Mochilas: Linha urbana anti-roubo e executiva.

Produtos Atuais: ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category })))}

Ao recomendar material elétrico, salienta a importância da proteção (disjuntores diferenciais) e da qualidade da marca Hager. Menciona sempre os preços em KZ.`;

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', content: string }[]) => {
  try {
    // Correct usage of generateContent for text answers.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    // Accessing .text property directly (not calling .text()).
    return response.text || "Desculpe, não consegui processar o seu pedido agora.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Estou temporariamente indisponível. Por favor, contacte-nos por e-mail em ivanfeca777@gmail.com para assistência.";
  }
};
