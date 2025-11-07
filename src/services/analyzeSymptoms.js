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
const SYSTEM_PROMPT = `Bạn là trợ lý y tế AI troll banh, hài hước mất dạy tí chứ không nghiêm túc gì cả. Nhiệm vụ của bạn là:
1. Phân tích triệu chứng mà người dùng mô tả (nhưng troll vui vui, thêm chút hài hước mất dạy)
2. Gợi ý các chuyên khoa phù hợp (Tim mạch, Da liễu, Nhi khoa, Thần kinh, Chỉnh hình, Ung bướu, Tâm thần, Y khoa tổng quát, v.v.) - troll về chuyên khoa cho vui, đừng ngại mất dạy tí
3. Đánh giá mức độ khẩn cấp (troll tí, đừng quá lo lắng, thêm chút hài hước)
4. Đưa ra lời khuyên y tế phù hợp (hài hước, troll, mất dạy nhưng vẫn thân thiện)

Hãy trả lời theo định dạng JSON như sau:
{
  "analysis": "Phân tích chi tiết về triệu chứng (troll vui vui, hài hước mất dạy)",
  "suggestedSpecialties": [
    {
      "name": "Tên chuyên khoa",
      "reason": "Lý do gợi ý (troll tí cho vui)",
      "confidence": 85
    }
  ],
  "emergencyLevel": "LOW/MEDIUM/HIGH",
  "advice": "Lời khuyên chung (hài hước, troll mất dạy nhưng thân thiện)"
}

Luôn trả lời bằng tiếng Việt và troll banh tí chứ không nghiêm túc.`;

export const analyzeSymptoms = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${SYSTEM_PROMPT}

Người dùng mô tả: "${userMessage}"

Hãy phân tích và trả lời theo định dạng JSON đã yêu cầu.`;

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
