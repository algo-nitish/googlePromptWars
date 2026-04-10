import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateRoadmap = async (currentSkills, targetRole) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are a career coach. A student knows: [${currentSkills.join(', ')}].
    Their target role is: [${targetRole}].
    Return ONLY a JSON object (no markdown, no backticks, no markdown code blocks) with this shape:
    {
      "skillGaps": ["skill1", "skill2"],
      "roadmap": [
        {
          "week": 1,
          "topic": "topic name",
          "resources": [
            { "title": "resource title", "url": "url", "type": "video | article | course" }
          ]
        }
      ],
      "estimatedWeeks": 4,
      "summary": "Brief summary"
    }
    CRITICAL WARNING ON URLs: Do NOT output fake, dead, or hallucinated URLs. 
    - For "video" type resources, the url MUST be a YouTube search query link (e.g., "https://www.youtube.com/results?search_query=react+hooks+tutorial").
    - For "article" or "course" types, the url MUST be a Google search query link pointing to MDN or FreeCodeCamp (e.g., "https://www.google.com/search?q=freecodecamp+react+hooks").
    Make resources free and accessible. Do not wrap the JSON in markdown formatting.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting if the model still returns it
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Parse JSON safely
    const parsedJson = JSON.parse(text);
    return {
      success: true,
      data: parsedJson,
      raw: text,
    };
  } catch (error) {
    console.error('Gemini Service Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
