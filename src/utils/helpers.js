export const formatCurrency = (value, locale = 'es-CL', currency = 'CLP') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(value || 0)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    hasMinLength: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password)
  }
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const generateRandomImageUrl = () => {
  const randomId = Math.floor(Math.random() * 999) + 1
  return `https://picsum.photos/id/${randomId}/800/600`
}

export const isAdmin = (userEmail) => {
  const adminEmails = ['admin@adweb.cl']
  return adminEmails.includes(userEmail?.toLowerCase())
}