import React, { useState, useEffect } from 'react';
import { Mail, Shield, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  email: string;
  password: string;
  sessionToken: string | null;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  onBack: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  email,
  sessionToken,
  onVerify,
  onResendCode,
  onBack,
}) => {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    // Apenas números são permitidos
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Move para o próximo input se um número foi digitado
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Foca no próximo input vazio ou no último
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Por favor, digite o código completo de 6 dígitos.');
      return;
    }

    if (!sessionToken) {
      setError('Sessão inválida. Por favor, tente fazer login novamente.');
      return;
    }

    setIsLoading(true);
    
    try {
      await onVerify(fullCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido. Tente novamente.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      await onResendCode();
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reenviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 transition-opacity duration-300">
      <div
        className={`rounded-xl shadow-2xl w-full max-w-md p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100 ${
          isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
        }`}
      >
        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className={`absolute top-4 left-4 p-2 rounded-md transition-colors duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-slate-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Ícone de Segurança */}
        <div className="flex justify-center mb-6">
          <div
            className={`p-4 rounded-full ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}
          >
            <Shield className={`h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        {/* Título e Descrição */}
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Autenticação em Dois Fatores
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Digite o código de 6 dígitos enviado para
          </p>
          <p className={`text-sm font-semibold mt-1 flex items-center justify-center gap-2 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            <Mail className="h-4 w-4" />
            {email}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs do Código */}
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/50'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/50'
                } ${error ? (isDarkMode ? 'border-red-500' : 'border-red-500') : ''}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
            }`}>
              {error}
            </div>
          )}

          {/* Botão Verificar */}
          <button
            type="submit"
            disabled={isLoading || code.some((d) => !d)}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              isLoading || code.some((d) => !d)
                ? isDarkMode
                  ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verificando...
              </span>
            ) : (
              'Verificar Código'
            )}
          </button>

          {/* Reenviar Código */}
          <div className="text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Não recebeu o código?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading || resendCooldown > 0}
                className={`font-semibold ${
                  isLoading || resendCooldown > 0
                    ? isDarkMode
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                    : isDarkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
              </button>
            </p>
          </div>
        </form>

        {/* Informação de Segurança */}
        <div className={`mt-6 p-4 rounded-lg border ${
          isDarkMode
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <strong>Dica de segurança:</strong> O código expira em alguns minutos. 
            Se você não solicitou este código, ignore este e-mail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
