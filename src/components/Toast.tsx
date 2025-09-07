import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (!isVisible) return
    const timerId = setTimeout(() => onClose(), 4000)
    return () => clearTimeout(timerId)
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getStyles = () => {
    const stylesMap: Record<string, { bg: string; border: string; text: string }> = {
      success: { bg: '#065F46', border: '#A9E851', text: '#A9E851' },
      error: { bg: '#7F1D1D', border: '#F87171', text: '#F87171' },
      info: { bg: '#1E3A8A', border: '#60A5FA', text: '#60A5FA' }
    }
    return stylesMap[type]
  }

  const { bg, border, text } = getStyles()

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 transform translate-x-0"
      style={{ backgroundColor: bg, borderColor: border, color: text, minWidth: '300px' }}
    >
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="text-lg">×</span>
      </button>
    </div>
  )
}
