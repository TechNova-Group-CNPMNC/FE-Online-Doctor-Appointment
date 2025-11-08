import { GoogleGenerativeAI } from "@google/generative-ai";
import api from "./api";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * @param {Array} specialties - Danh sách chuyên khoa từ API
 * @returns {string} - Prompt đã được format
 */
const createProfessionalPrompt = (specialties = []) => {
  const specialtiesList =
    specialties.length > 0
      ? specialties
          .map(
            (s, index) =>
              `${index + 1}. ${s.name}${
                s.description ? ` - ${s.description}` : ""
              }`
          )
          .join("\n")
      : "Tim mạch, Da liễu, Nhi khoa, Thần kinh, Chỉnh hình, Ung bướu, Tâm thần, Y khoa tổng quát";

  return `Bạn là trợ lý y tế AI chuyên nghiệp của TechNova Clinic - Hệ thống đặt lịch khám bệnh trực tuyến uy tín.

═══════════════════════════════════════════════════════════════
VAI TRÒ VÀ TRÁCH NHIỆM:
═══════════════════════════════════════════════════════════════
- Bạn là một bác sĩ AI có kiến thức y khoa sâu rộng, nghiêm túc và đáng tin cậy
- Luôn đặt sức khỏe và an toàn của bệnh nhân lên hàng đầu
- Thể hiện sự đồng cảm, thân thiện nhưng vẫn giữ tính chuyên nghiệp
- Cung cấp thông tin chính xác, dễ hiểu và hữu ích

═══════════════════════════════════════════════════════════════
DANH SÁCH CHUYÊN KHOA HIỆN CÓ TẠI PHÒNG KHÁM:
═══════════════════════════════════════════════════════════════
${specialtiesList}

LƯU Ý: Chỉ đề xuất các chuyên khoa có trong danh sách trên. Nếu triệu chứng không khớp chính xác, hãy chọn chuyên khoa gần nhất hoặc "Y khoa tổng quát".

═══════════════════════════════════════════════════════════════
QUY TẮC PHÂN TÍCH:
═══════════════════════════════════════════════════════════════
1. Phân tích triệu chứng một cách chi tiết và khoa học, ngắn gọn và dễ hiểu
2. Đánh giá mức độ khẩn cấp dựa trên:
   - LOW: Triệu chứng nhẹ, không nguy hiểm, có thể chờ đợi
   - MEDIUM: Cần được khám trong thời gian ngắn (1-3 ngày)
   - HIGH: Cần được khám ngay lập tức hoặc cấp cứu
3. Đề xuất 1-3 chuyên khoa phù hợp nhất với lý do rõ ràng
4. Đưa ra lời khuyên thực tế, cụ thể và an toàn
5. Luôn nhắc nhở bệnh nhân tham khảo ý kiến bác sĩ thực tế

═══════════════════════════════════════════════════════════════
ĐỊNH DẠNG PHẢN HỒI (JSON BẮT BUỘC):
═══════════════════════════════════════════════════════════════
{
  "analysis": "Phân tích chi tiết về triệu chứng, nguyên nhân có thể và tầm quan trọng",
  "suggestedSpecialties": [
    {
      "name": "Tên chuyên khoa (phải khớp với danh sách trên)",
      "reason": "Lý do ngắn gọn, rõ ràng tại sao nên chọn chuyên khoa này",
      "confidence": 85
    }
  ],
  "emergencyLevel": "LOW|MEDIUM|HIGH",
  "advice": "Lời khuyên cụ thể, thực tế về cách xử lý và chăm sóc"
}

═══════════════════════════════════════════════════════════════
YÊU CẦU:
═══════════════════════════════════════════════════════════════
- Trả lời bằng tiếng Việt, dễ hiểu, không dùng thuật ngữ y khoa phức tạp
- Giữ thái độ chuyên nghiệp, đồng cảm và đáng tin cậy
- Không đưa ra chẩn đoán chính xác, chỉ gợi ý và tư vấn
- Luôn khuyến khích bệnh nhân đến gặp bác sĩ để được khám trực tiếp`;
};

/**
 * Lấy danh sách chuyên khoa từ API
 * @returns {Promise<Array>} - Danh sách chuyên khoa
 */
const fetchSpecialties = async () => {
  try {
    const response = await api.get("/specialties");
    const specialtiesData = response.data?.data || response.data || [];
    return Array.isArray(specialtiesData) ? specialtiesData : [];
  } catch (error) {
    console.error("Error fetching specialties:", error);
    // Trả về danh sách mặc định nếu API lỗi
    return [
      { id: 1, name: "Tim mạch" },
      { id: 2, name: "Da liễu" },
      { id: 3, name: "Nhi khoa" },
      { id: 4, name: "Thần kinh" },
      { id: 5, name: "Chỉnh hình" },
      { id: 6, name: "Ung bướu" },
      { id: 7, name: "Tâm thần" },
      { id: 192, name: "Y khoa tổng quát" },
    ];
  }
};

/**
 * @param {string} userMessage - Triệu chứng của người dùng
 * @returns {Promise<Object>} - Kết quả phân tích dạng JSON, chứa analysis, suggestedSpecialties, emergencyLevel, advice
 */
export const analyzeSymptoms = async (userMessage) => {
  try {
    // Lấy danh sách chuyên khoa từ API
    const specialties = await fetchSpecialties();

    // Tạo prompt chuyên nghiệp với danh sách chuyên khoa
    const systemPrompt = createProfessionalPrompt(specialties);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    const prompt = `${systemPrompt}

═══════════════════════════════════════════════════════════════
TRIỆU CHỨNG CỦA BỆNH NHÂN:
═══════════════════════════════════════════════════════════════
"${userMessage}"

Hãy phân tích và trả lời theo đúng định dạng JSON đã yêu cầu.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Trích xuất JSON từ response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Validate và đảm bảo tên chuyên khoa khớp với danh sách từ API
      if (
        parsedResponse.suggestedSpecialties &&
        Array.isArray(parsedResponse.suggestedSpecialties)
      ) {
        parsedResponse.suggestedSpecialties =
          parsedResponse.suggestedSpecialties.map((spec) => {
            // Kiểm tra xem tên chuyên khoa có trong danh sách không
            const matchedSpecialty = specialties.find(
              (s) => s.name.toLowerCase() === spec.name.toLowerCase()
            );
            if (matchedSpecialty) {
              return {
                ...spec,
                name: matchedSpecialty.name, // Sử dụng tên chính xác từ API
                id: matchedSpecialty.id,
              };
            }
            return spec;
          });
      }

      return parsedResponse;
    }

    return {
      analysis:
        "Triệu chứng của bạn cần được bác sĩ kiểm tra kỹ hơn. Vui lòng đặt lịch khám để được tư vấn chính xác.",
      suggestedSpecialties: [],
      emergencyLevel: "LOW",
      advice: "Đặt lịch khám với bác sĩ để được chẩn đoán và điều trị phù hợp.",
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
