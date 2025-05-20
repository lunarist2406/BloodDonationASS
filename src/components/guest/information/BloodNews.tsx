import { IconNews } from "@tabler/icons-react";
import { newsList } from '../../../hooks/newsData';

export default function BloodNews() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconNews size={32} className="text-red-700" />
            Tin tức về hiến máu
          </h1>
          <p className="text-gray-700 text-lg">
            Cập nhật các sự kiện, hoạt động và câu chuyện ý nghĩa về hiến máu trên toàn quốc.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {newsList.map(news => (
            <a
              key={news.id}
              href={news.link}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer block"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2
                  className="text-xl font-bold text-red-800 mb-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {news.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">{news.date}</p>
                <p
                  className="text-gray-600 mb-4"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {news.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
