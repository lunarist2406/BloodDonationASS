
const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="relative mb-8">
      {/* Outer glow effect */}
      <div className="absolute inset-0 w-20 h-20 border-4 border-red-500/20 rounded-full blur-sm animate-pulse"></div>

      {/* Main spinning ring */}
      <div
        className="relative w-20 h-20 border-4 border-solid border-gray-200 border-t-red-500 border-r-red-400 rounded-full animate-spin shadow-lg"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(239, 68, 68, 0.1), transparent)",
        }}
        role="status"
      >
        <span className="sr-only">Đang tải...</span>
      </div>

      {/* Inner rotating dots */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 animate-ping"></div>
          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-red-400 rounded-full transform -translate-y-1/2 animate-pulse delay-150"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-red-300 rounded-full transform -translate-x-1/2 animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-red-400 rounded-full transform -translate-y-1/2 animate-pulse delay-75"></div>
        </div>
      </div>
    </div>

    {/* Loading text with animation */}
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-gray-800 animate-pulse">Đang lấy dữ liệu</h3>
      <div className="flex justify-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce delay-200"></div>
      </div>
      <p className="text-sm text-gray-500 animate-pulse delay-500">Vui lòng đợi trong giây lát...</p>
    </div>
  </div>
)

export default LoadingSpinner
