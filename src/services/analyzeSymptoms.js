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
 * Kiểm tra xem message có phải là lời chào không
 * @param {string} message - Message từ người dùng
 * @returns {boolean} - true nếu là lời chào
 */
const isGreeting = (message) => {
  const normalizedMessage = message.toLowerCase().trim();

  const greetings = [
    "hi",
    "hello",
    "xin chào",
    "chào",
    "chào bạn",
    "hey",
    "hế lô",
    "bạn khỏe không",
    "bạn ổn không",
    "bạn sao rồi",
  ];

  // Kiểm tra nếu message quá ngắn (dưới 10 ký tự) và chỉ chứa lời chào
  if (normalizedMessage.length < 10) {
    return greetings.some((greeting) => normalizedMessage.includes(greeting));
  }

  // Kiểm tra nếu message bắt đầu bằng lời chào
  return greetings.some((greeting) => normalizedMessage.startsWith(greeting));
};

/**
 * Kiểm tra xem message có phải là lời tạm biệt không
 * @param {string} message - Message từ người dùng
 * @returns {boolean} - true nếu là lời tạm biệt
 */
const isGoodbye = (message) => {
  const normalizedMessage = message.toLowerCase().trim();

  const goodbyes = [
    "tạm biệt",
    "bye",
    "goodbye",
    "see you",
    "hẹn gặp lại",
    "chào nhé",
    "chào bạn",
  ];

  return goodbyes.some((goodbye) => normalizedMessage.includes(goodbye));
};

/**
 * Kiểm tra xem message có phải là lời cảm ơn không
 * @param {string} message - Message từ người dùng
 * @returns {boolean} - true nếu là lời cảm ơn
 */
const isThankYou = (message) => {
  const normalizedMessage = message.toLowerCase().trim();

  const thanks = [
    "cảm ơn",
    "thanks",
    "thank you",
    "cám ơn",
    "cảm ơn bạn",
    "thank",
  ];

  return thanks.some((thank) => normalizedMessage.includes(thank));
};

/**
 * Kiểm tra xem message có phải là câu hỏi thông thường không
 * @param {string} message - Message từ người dùng
 * @returns {boolean} - true nếu là câu hỏi thông thường
 */
const isGeneralQuestion = (message) => {
  const normalizedMessage = message.toLowerCase().trim();

  const questions = [
    "làm gì",
    "làm sao",
    "như thế nào",
    "thế nào",
    "bạn là ai",
    "bạn làm gì",
  ];

  return questions.some((question) => normalizedMessage.includes(question));
};

/**
 * @param {string} userMessage - Triệu chứng của người dùng
 * @returns {Promise<Object>} - Kết quả phân tích dạng JSON, chứa analysis, suggestedSpecialties, emergencyLevel, advice
 */
export const analyzeSymptoms = async (userMessage) => {
  try {
    // Kiểm tra nếu là lời chào
    if (isGreeting(userMessage)) {
      return {
        analysis:
          "Xin chào! Tôi là trợ lý y tế AI của TechNova. Tôi có thể giúp bạn phân tích triệu chứng và đề xuất chuyên khoa phù hợp. Hãy mô tả các triệu chứng bạn đang gặp phải nhé! 😊",
        suggestedSpecialties: [],
        emergencyLevel: "LOW",
        advice:
          "Vui lòng mô tả chi tiết các triệu chứng bạn đang gặp phải để tôi có thể tư vấn tốt hơn.",
      };
    }

    // Kiểm tra nếu là lời tạm biệt
    if (isGoodbye(userMessage)) {
      return {
        analysis:
          "Tạm biệt bạn! Chúc bạn sức khỏe tốt. Nếu bạn có bất kỳ triệu chứng nào cần tư vấn, đừng ngần ngại quay lại nhé! 👋",
        suggestedSpecialties: [],
        emergencyLevel: "LOW",
        advice:
          "Hãy chăm sóc sức khỏe của mình và đừng quên đặt lịch khám nếu cần thiết.",
      };
    }

    // Kiểm tra nếu là lời cảm ơn
    if (isThankYou(userMessage)) {
      return {
        analysis:
          "Không có gì! Tôi rất vui được giúp đỡ bạn. Nếu bạn còn bất kỳ câu hỏi nào về sức khỏe, cứ hỏi tôi nhé! 😊",
        suggestedSpecialties: [],
        emergencyLevel: "LOW",
        advice: "Chúc bạn luôn khỏe mạnh!",
      };
    }

    // Kiểm tra nếu là câu hỏi thông thường
    if (isGeneralQuestion(userMessage)) {
      return {
        analysis:
          "Tôi là trợ lý y tế AI của TechNova Clinic. Tôi có thể giúp bạn phân tích triệu chứng và đề xuất chuyên khoa phù hợp. Hãy mô tả các triệu chứng bạn đang gặp phải để tôi có thể hỗ trợ bạn tốt nhất!",
        suggestedSpecialties: [],
        emergencyLevel: "LOW",
        advice:
          "Vui lòng mô tả chi tiết các triệu chứng bạn đang gặp phải (ví dụ: đau đầu, sốt, ho, đau bụng...) để tôi có thể tư vấn chính xác hơn.",
      };
    }

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

LƯU Ý: Nếu đây chỉ là lời chào hoặc câu hỏi thông thường (không phải triệu chứng), hãy trả lời thân thiện và hướng dẫn người dùng mô tả triệu chứng.

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
