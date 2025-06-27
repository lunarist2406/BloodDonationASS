import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from './ChatBot.module.css';
import io, { Socket } from 'socket.io-client';

const cx = classNames.bind(styles);

const hoverMessages = [
  'Bạn cần tư vấn gì về hiến máu?',
  'Hôm nay bạn thế nào?',
];

const suggestions = [
  'Làm sao để đăng ký hiến máu?',
  'Hiến máu xong bao lâu thì được hiến lại?',
  'Nhóm máu A có thể cho nhóm nào?',
  'Tôi muốn tìm nơi hiến máu gần nhất.',
];

const user = JSON.parse(localStorage.getItem('user') || '{}');
const socket: Socket = io('http://localhost:3000/chatbot', {
  transports: ['websocket'],
  auth: {
    userID: user?.user_id || 'anonymous'
  },
});

// Danh sách các trang không hiển thị chatbot
const hiddenPages = ['/', '/register', '/verify-code', '/forgot-password'];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverMessage, setHoverMessage] = useState('');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Kiểm tra xem có nên ẩn chatbot không
  const shouldHideChatBot = hiddenPages.includes(location.pathname);

  const toggleChat = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    socket.on('aiReply', (data: { message: string }) => {
      setLoading(false);
      setChat((prev) => [...prev, { sender: 'bot', text: data.message }]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err);
    });

    return () => {
      socket.off('aiReply');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const message = input.trim();
    setChat((prev) => [...prev, { sender: 'user', text: message }]);
    setInput('');
    setLoading(true);
    socket.emit('askAI', { message });
  };

  // Không render chatbot nếu đang ở trang cần ẩn
  if (shouldHideChatBot) {
    return null;
  }

  return (
    <div className={cx('chatbot')}>
      {!isOpen && (
        <div
          className={cx('chat-icon')}
          onMouseEnter={() =>
            setHoverMessage(hoverMessages[Math.floor(Math.random() * hoverMessages.length)])
          }
          onMouseLeave={() => setHoverMessage('')}
          onClick={toggleChat}
        >
          <img src="src\assets\bot_icon.png" alt="Chat Icon" className={cx('bot-img')} />
          {hoverMessage && <div className={cx('hover-message')}>{hoverMessage}</div>}
        </div>
      )}

      <div className={cx('chat-popup', isOpen && 'open')}>
        <div className={cx('chat-header')}>
          <span>Trợ lý hiến máu</span>
          <FaTimes className={cx('close-btn')} onClick={toggleChat} />
        </div>

        <div className={cx('chat-content')}>
          {chat.map((msg, idx) => (
            <div key={idx} className={cx(msg.sender === 'user' ? 'user-msg' : 'bot-msg')}>
              {msg.text}
            </div>
          ))}
          {loading && <div className={cx('bot-msg')}>Đang soạn câu trả lời...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className={cx('chat-footer')}>
          <div className={cx('suggestions')}>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInput(s)}
                className={cx('suggestion-btn')}
              >
                {s}
              </button>
            ))}
          </div>

          <div className={cx('input-area')}>
            <textarea
              className={cx('text-input')}
              value={input}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} className={cx('send-btn')}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;