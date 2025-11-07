import { useState, useRef, useEffect } from "react";
import { chatbotAPI } from "../../services/api";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý y tế AI. Hãy mô tả triệu chứng của bạn để tôi gợi ý chuyên khoa phù hợp.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
  });
  const [step, setStep] = useState("initial"); // initial, collecting-info, analyzing
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, content) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage("user", userMessage);
    setInputMessage("");

    if (step === "initial") {
      // Lưu triệu chứng và hỏi thêm thông tin
      setUserInfo((prev) => ({ ...prev, symptoms: userMessage }));
      addMessage(
        "bot",
        "Cảm ơn bạn! Để tôi có thể tư vấn chính xác hơn, vui lòng cho biết thêm một số thông tin:"
      );
      addMessage("bot", "Tuổi của bạn là bao nhiêu?");
      setStep("collecting-age");
    } else if (step === "collecting-age") {
      setUserInfo((prev) => ({ ...prev, age: userMessage }));
      addMessage("bot", "Giới tính của bạn? (Nam/Nữ/Khác)");
      setStep("collecting-gender");
    } else if (step === "collecting-gender") {
      const gender = userMessage.toLowerCase().includes("nam")
        ? "MALE"
        : userMessage.toLowerCase().includes("nữ")
        ? "FEMALE"
        : "OTHER";
      setUserInfo((prev) => ({ ...prev, gender }));
      addMessage(
        "bot",
        "Bạn có tiền sử bệnh lý gì không? (Nếu không, gõ 'Không')"
      );
      setStep("collecting-history");
    } else if (step === "collecting-history") {
      setUserInfo((prev) => ({ ...prev, medicalHistory: userMessage }));
      await analyzeSymptomsAndSuggest({
        ...userInfo,
        medicalHistory: userMessage,
      });
    }
  };

  const analyzeSymptomsAndSuggest = async (info) => {
    try {
      setLoading(true);
      addMessage("bot", "Đang phân tích triệu chứng của bạn...");

      const response = await chatbotAPI.suggestSpecialty({
        symptoms: info.symptoms,
        age: info.age,
        gender: info.gender,
        medicalHistory: info.medicalHistory,
      });

      // Hiển thị phân tích
      addMessage("bot", "📋 Phân tích:");
      addMessage("bot", response.analysis);

      // Cảnh báo khẩn cấp nếu có
      if (response.emergencyWarning) {
        addMessage(
          "bot",
          "⚠️ CẢNH BÁO: Triệu chứng của bạn có thể nghiêm trọng. Vui lòng đến cơ sở y tế ngay lập tức hoặc gọi cấp cứu 115!"
        );
      }

      // Gợi ý chuyên khoa
      if (response.suggestedSpecialties?.length > 0) {
        addMessage("bot", "\n🏥 Chuyên khoa được đề xuất:");
        response.suggestedSpecialties.forEach((specialty, index) => {
          addMessage(
            "bot",
            `${index + 1}. ${specialty.specialtyName} (${
              specialty.confidenceScore
            }% phù hợp)\n   Lý do: ${specialty.reason}`
          );
        });
      }

      // Gợi ý bác sĩ
      if (response.suggestedDoctors?.length > 0) {
        addMessage("bot", "\n👨‍⚕️ Bác sĩ được đề xuất:");
        response.suggestedDoctors.forEach((doctor, index) => {
          addMessage(
            "bot",
            `${index + 1}. ${doctor.fullName} - ${doctor.specialtyName}\n   ${
              doctor.bio || ""
            }`
          );
        });

        addMessage(
          "bot",
          "\nBạn có thể đặt lịch khám với các bác sĩ trên tại trang 'Tìm bác sĩ'."
        );
      }

      // Reset
      addMessage(
        "bot",
        "\nBạn có triệu chứng khác cần tư vấn không? Hãy mô tả cho tôi biết!"
      );
      setStep("initial");
      setUserInfo({});
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      addMessage(
        "bot",
        "Xin lỗi, đã có lỗi xảy ra khi phân tích. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ."
      );
      setStep("initial");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C10.4649 21 9.03071 20.5875 7.8 19.8649L3 21L4.13506 16.2C3.41248 14.9693 3 13.5351 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7 9C5.89543 9 5 9.89543 5 11V13C5 14.1046 5.89543 15 7 15H9V22H15V15H17C18.1046 15 19 14.1046 19 13V11C19 9.89543 18.1046 9 17 9H7Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3>Trợ lý Y tế AI</h3>
                <p className="chatbot-status">
                  <span className="status-dot"></span>
                  Trực tuyến
                </p>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === "user" ? "user" : "bot"
                }`}
              >
                {message.type === "bot" && (
                  <div className="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7 9C5.89543 9 5 9.89543 5 11V13C5 14.1046 5.89543 15 7 15H9V22H15V15H17C18.1046 15 19 14.1046 19 13V11C19 9.89543 18.1046 9 17 9H7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7 9C5.89543 9 5 9.89543 5 11V13C5 14.1046 5.89543 15 7 15H9V22H15V15H17C18.1046 15 19 14.1046 19 13V11C19 9.89543 18.1046 9 17 9H7Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows="1"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
