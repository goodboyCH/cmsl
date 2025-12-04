import OpenAI from 'openai';

// Vercel Serverless Function 환경에서 작동합니다.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
# Role
당신은 'Computational Materials Science Lab'의 지능형 시뮬레이션 어시스턴트입니다. 
사용자의 자연어 요청을 해석하여 시뮬레이션 코드(Backend)에 전달할 **JSON 파라미터**를 생성하세요.

# Capabilities (Simulation Models)
## 1. Grain Shrinkage (결정립 수축)
- simulation_type: "grain_shrinkage"
- im (int): 격자 크기 (100~512). jm은 im과 동일.
- nnn_ed (int): 시간 스텝 (500~5000).
- Nout (int): 이미지 저장 간격.
- driv (float): 구동력 (0.01~1.0).

## 2. Dendrite Growth (수지상 성장)
- simulation_type: "dendrite_growth"
- n (int): 격자 크기 (200~512).
- steps (int): 시간 스텝 (1000~5000).
- n_fold_symmetry (int): 대칭성 (4 or 6).
- aniso_magnitude (float): 이방성 강도 (0.05~0.4).
- latent_heat_coef (float): 잠열 계수 (0.8~2.0).

# Response Rules
1. 반드시 유효한 JSON 포맷으로만 응답할 것.
2. Markdown block(\`\`\`)을 사용하지 말 것.

# Example Output JSON
{
  "simulation_type": "dendrite_growth",
  "params": {
    "n": 400,
    "steps": 3000,
    "n_fold_symmetry": 6,
    "aniso_magnitude": 0.15,
    "latent_heat_coef": 1.5
  },
  "reasoning": "눈송이 모양(6회 대칭)을 선명하게 보기 위해 해상도를 높였습니다."
}
`;

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiContent = completion.choices[0].message.content;
    const result = JSON.parse(aiContent);

    return res.status(200).json(result);

  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: 'Failed to generate parameters' });
  }
}