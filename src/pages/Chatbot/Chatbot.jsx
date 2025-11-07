import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { analyzeSymptoms } from "../../services/analyzeSymptoms";
import "./Chatbot.css";
import { isDoctor, isAuthenticated } from "../../util/jwtdecoder";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý y tế AI của TechNova. Hãy mô tả triệu chứng của bạn để tôi có thể tư vấn chuyên khoa phù hợp 😊. Ví dụ: **Tôi bị ngu.**",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isAuth = isAuthenticated();
  const isDoctorUser = isDoctor();
  const isOpenChatbot = isAuth && !isDoctorUser;

  // reload khi isAuth hoac isDoctor thay doi
  // wont work :((( stupid auth context :((
  useEffect(() => {
    if (!isOpenChatbot) {
      setIsOpen(false);
    }
  }, [isOpenChatbot]);

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
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    addMessage("user", userMessage);
    setInputMessage("");

    try {
      setLoading(true);
      addMessage("bot", "Đang phân tích triệu chứng của bạn...");

      const response = await analyzeSymptoms(userMessage);

      setMessages((prev) => prev.slice(0, -1));

      addMessage("bot", `📋 **Phân tích:**\n\n${response.analysis}`);

      if (response.emergencyLevel === "HIGH") {
        addMessage(
          "bot",
          "⚠️ **CẢNH BÁO KHẨN CẤP**: Triệu chứng của bạn có thể nghiêm trọng. Vui lòng đến cơ sở y tế ngay lập tức hoặc gọi cấp cứu 115!"
        );
      } else if (response.emergencyLevel === "MEDIUM") {
        addMessage(
          "bot",
          "⚡ **Lưu ý**: Bạn nên sắp xếp khám bác sĩ trong thời gian sớm nhất."
        );
      }

      // gợi ý chuyên khoa
      if (response.suggestedSpecialties?.length > 0) {
        let specialtiesText = "🏥 **Chuyên khoa được đề xuất:**\n\n";
        response.suggestedSpecialties.forEach((specialty, index) => {
          specialtiesText += `${index + 1}. **${specialty.name}** (${
            specialty.confidence
          }% phù hợp)\n`;
          specialtiesText += `   📌 ${specialty.reason}\n\n`;
        });
        addMessage("bot", specialtiesText);
      }

      // lời khuyên
      if (response.advice) {
        addMessage("bot", `💡 **Lời khuyên:**\n\n${response.advice}`);
      }

      // kết thúc
      addMessage(
        "bot",
        "Bạn có thể tìm và đặt lịch với bác sĩ tại trang **Tìm bác sĩ** của chúng tôi.\n\nCó triệu chứng khác cần tư vấn không? 😊"
      );
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setMessages((prev) => prev.slice(0, -1));
      addMessage(
        "bot",
        "Xin lỗi, đã có lỗi xảy ra khi phân tích. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ trực tiếp. 🙏"
      );
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
      {isOpenChatbot && (
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
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                      <div className="message-text">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
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
                  placeholder="Mô tả triệu chứng của bạn..."
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
      )}
      {!isOpenChatbot && (
        <div className="chatbot-disabled-message">
          <button className="disabled-info-btn" aria-label="Thông báo">
            ×
            <span className="disabled-info-tooltip">
              Chatbot trợ lý y tế AI chỉ dành cho bệnh nhân đã đăng nhập
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default Chatbot;
