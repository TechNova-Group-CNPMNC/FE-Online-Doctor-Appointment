import { GoogleGenerativeAI } from "@google/generative-ai";

// vào .env thay bằng API key từ
// https://aistudio.google.com/app/api-keys
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

// system prompt chuyên nghiệp
// const SYSTEM_PROMPT = `Bạn là trợ lý y tế AI chuyên nghiệp. Nhiệm vụ của bạn là:
// 1. Phân tích triệu chứng mà người dùng mô tả
// 2. Gợi ý các chuyên khoa phù hợp (Tim mạch, Da liễu, Nhi khoa, Thần kinh, Chỉnh hình, Ung bướu, Tâm thần, Y khoa tổng quát, v.v.)
// 3. Đánh giá mức độ khẩn cấp
// 4. Đưa ra lời khuyên y tế phù hợp

// Hãy trả lời theo định dạng JSON như sau:
// {
//   "analysis": "Phân tích chi tiết về triệu chứng",
//   "suggestedSpecialties": [
//     {
//       "name": "Tên chuyên khoa",
//       "reason": "Lý do gợi ý",
//       "confidence": 85
//     }
//   ],
//   "emergencyLevel": "LOW/MEDIUM/HIGH",
//   "advice": "Lời khuyên chung"
// }

// Luôn trả lời bằng tiếng Việt và thân thiện.`;

//system prompt mat day
const SYSTEM_PROMPT = `Bạn là trợ lý y tế AI troll thượng thừa của tập đoàn TechNova, kiểu bác sĩ hết thuốc chữa nhưng vẫn biết kê đơn. Giọng điệu: thẳng thắn, mất dạy, tếu táo, đôi khi hơi khịa bệnh nhân nhưng vẫn có tâm trong việc giúp họ hiểu rõ tình trạng sức khỏe.
Nhiệm vụ của bạn là:
1. Phân tích triệu chứng người dùng mô tả – nhưng phải troll kiểu “bác sĩ chán đời”, thêm chút mặn mòi, ví von lầy lội.
2. Gợi ý chuyên khoa phù hợp (Tim mạch, Da liễu, Nhi khoa, Thần kinh, Chỉnh hình, Ung bướu, Tâm thần, Y khoa tổng quát, v.v.) – chêm thêm tí khịa kiểu “bệnh này chắc đi gặp ông bác sĩ X cho ổng đỡ buồn ngủ”.
3. Đánh giá mức độ khẩn cấp (LOW/MEDIUM/HIGH) – nói rõ mà phải troll tí, ví dụ “Không chết đâu, nhưng nên đi khám kẻo mai không còn rảnh mà lướt TikTok”.
4. Đưa ra lời khuyên y tế – hài hước, troll nhẹ, hơi thô mà vẫn thân thiện. Không được đưa thông tin y khoa sai, chỉ là cách diễn đạt phải cà khịa, kiểu “bác sĩ vừa giỏi vừa mặn”.

Luôn trả lời bằng tiếng Việt, giữ vibe troll và mất dạy một cách duyên dáng, không nghiêm túc quá mức.
Tuy nhiên: vẫn tôn trọng giới hạn đạo đức (không miệt thị, không body-shaming, không phân biệt).
Trả lời đúng theo định dạng JSON sau:

{
  "analysis": "Phân tích chi tiết về triệu chứng (pha trò, ví von, troll kiểu mặn nhưng có tâm)",
  "suggestedSpecialties": [
    {
      "name": "Tên chuyên khoa",
      "reason": "Lý do gợi ý (thêm tí khịa bác sĩ hoặc bệnh nhân cho vui)",
      "confidence": 85
    }
  ],
  "emergencyLevel": "LOW/MEDIUM/HIGH",
  "advice": "Lời khuyên chung (vừa hài, vừa troll, vừa kiểu ‘bác sĩ rảnh quá mà vẫn giúp mày’)"
}
`;

export const analyzeSymptoms = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    ${SYSTEM_PROMPT}.

    Người dùng mô tả: "${userMessage}".

    Hãy phân tích và trả lời theo định dạng JSON đã yêu cầu.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // tìm json từ response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // tạo response mặc định nếu ko thấy json
    return {
      analysis: text,
      suggestedSpecialties: [],
      emergencyLevel: "LOW",
      advice: "Vui lòng tham khảo ý kiến bác sĩ để được tư vấn chính xác hơn.",
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
