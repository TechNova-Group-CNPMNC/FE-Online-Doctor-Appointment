import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { analyzeSymptoms } from "../../services/analyzeSymptoms";
import "./Chatbot.css";
import { isDoctor, isAuthenticated } from "../../util/jwtdecoder";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  AlertTriangle,
  Zap,
  Hospital,
  Lightbulb,
  ClipboardList,
  Activity,
} from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý y tế AI của TechNova. Hãy mô tả triệu chứng của bạn để tôi có thể tư vấn chuyên khoa phù hợp 😊. Ví dụ: **Tôi bị cảm sốt và đau họng.**",
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

      // Loading message với component riêng
      addMessage("bot", {
        type: "loading",
        content: "Đang phân tích triệu chứng của bạn...",
      });

      const response = await analyzeSymptoms(userMessage);

      // Xóa message loading
      setMessages((prev) => prev.slice(0, -1));

      // Tạo structured response thay vì plain text
      const structuredResponse = {
        type: "analysis",
        data: {
          analysis: response.analysis,
          emergencyLevel: response.emergencyLevel,
          suggestedSpecialties:
            response.suggestedSpecialties?.slice(0, 2) || [],
          advice: response.advice,
        },
      };

      addMessage("bot", structuredResponse);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setMessages((prev) => prev.slice(0, -1));
      addMessage("bot", {
        type: "error",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  };
  const MessageContent = ({ message }) => {
    if (typeof message.content === "string") {
      return (
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      );
    }

    // Loading state
    if (message.content.type === "loading") {
      return (
        <div className="analysis-loading">
          <Loader2 className="loading-icon" size={20} />
          <span>{message.content.content}</span>
        </div>
      );
    }

    // Error state
    if (message.content.type === "error") {
      return (
        <div className="analysis-error">
          <AlertTriangle className="error-icon" size={18} />
          <span>{message.content.content}</span>
        </div>
      );
    }

    // Analysis result
    if (message.content.type === "analysis") {
      const { analysis, emergencyLevel, suggestedSpecialties, advice } =
        message.content.data;

      return (
        <div className="analysis-result">
          {/* Analysis */}
          <div className="analysis-section">
            <div className="section-header">
              <ClipboardList size={18} className="section-icon" />
              <strong>Phân tích</strong>
            </div>
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                ),
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>

          {/* Suggested Specialties */}
          {suggestedSpecialties.length > 0 && (
            <div className="analysis-section specialties-section">
              <div className="section-header">
                <Hospital size={18} className="section-icon" />
                <strong>Chuyên khoa đề xuất</strong>
              </div>
              <div className="specialties-list">
                {suggestedSpecialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="specialty-card fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="specialty-header">
                      <span className="specialty-number">{index + 1}</span>
                      <strong className="specialty-name">
                        {specialty.name}
                      </strong>
                      <span className="specialty-confidence">
                        {specialty.confidence}%
                      </span>
                    </div>
                    <div className="specialty-reason">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                              {children}
                            </p>
                          ),
                        }}
                      >
                        {specialty.reason}
                      </ReactMarkdown>
                    </div>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{ width: `${specialty.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice */}
          {advice && (
            <div className="analysis-section advice-section">
              <div className="section-header">
                <Lightbulb size={18} className="section-icon" />
                <strong>Lời khuyên</strong>
              </div>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                  ),
                }}
              >
                {advice}
              </ReactMarkdown>
            </div>
          )}

          {/* Footer */}
          <div className="analysis-footer">
            <p>Nếu bạn có các triệu chứng gì khác, cứ mô tả thêm nhé! 😊</p>
          </div>
        </div>
      );
    }

    return null;
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
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </button>

          {/* Chatbot Window */}
          {isOpen && (
            <div className="chatbot-window">
              <div className="chatbot-header">
                <div className="chatbot-header-info">
                  <div className="chatbot-avatar">
                    <Bot size={24} />
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
                  <X size={20} />
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
                        <Bot size={20} />
                      </div>
                    )}
                    {message.type === "user" && (
                      <div className="message-avatar user-avatar">
                        <User size={20} />
                      </div>
                    )}
                    <div className="message-content">
                      <div className="message-text">
                        <MessageContent message={message} />
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
                      <Bot size={20} />
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
                  {loading ? (
                    <Loader2 size={20} className="button-loading" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {!isOpenChatbot && (
        <div className="chatbot-disabled-message">
          <button className="disabled-info-btn" aria-label="Thông báo">
            <X size={20} />
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
