import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
          padding: '20px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          <AlertTriangle size={64} color="var(--danger)" style={{ marginBottom: '24px', opacity: 0.8 }} />
          <h1 style={{ marginBottom: '16px', fontSize: '24px' }}>糟糕，出錯了</h1>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            應用程式遇到了一些預期之外的問題。別擔心，這通常可以透過重整頁面來解決。
          </p>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '32px',
            fontFamily: 'monospace',
            fontSize: '13px',
            textAlign: 'left',
            maxWidth: '600px',
            overflow: 'auto',
            color: 'var(--danger)'
          }}>
            {this.state.error?.message}
          </div>

          <button
            className="btn btn-primary"
            onClick={this.handleReset}
            style={{ padding: '12px 24px' }}
          >
            <RotateCcw size={18} /> 重新整理並重試
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
