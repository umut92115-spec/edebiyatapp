import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-content glass">
            <AlertTriangle size={48} color="var(--rose)" />
            <h1>Bir Şeyler Ters Gitti</h1>
            <p>Uygulama yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.</p>
            {import.meta.env.DEV && (
              <pre className="error-details">{this.state.error?.toString()}</pre>
            )}
            <button onClick={this.handleReset} className="btn-error-reset">
              <RefreshCw size={16} /> Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
