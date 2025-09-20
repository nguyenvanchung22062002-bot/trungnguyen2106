import React from 'react';
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to logging service
    if (process.env.NODE_ENV === 'production') {
      // Here you could send error to logging service like Sentry
      // reportError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-strong p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Có lỗi xảy ra
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Đã xảy ra lỗi không mong muốn. Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất có thể.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Tải lại trang</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <FiHome className="w-5 h-5" />
                <span>Về trang chủ</span>
              </button>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 mb-2">
                  Chi tiết lỗi (Development)
                </summary>
                <div className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-40">
                  <p className="text-red-600 font-semibold mb-2">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre className="text-gray-700 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Nếu lỗi vẫn tiếp tục xảy ra, vui lòng liên hệ:
              </p>
              <a 
                href="mailto:support@newborngifts.vn"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                support@newborngifts.vn
              </a>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;