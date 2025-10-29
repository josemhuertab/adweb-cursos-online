export const ADMIN_EMAILS = ['admin@adweb.cl']

export const COURSE_STATUS = {
  AVAILABLE: 'disponible',
  UNDER_REVIEW: 'en_revision',
  CLOSED: 'cerrado'
}

export const COURSE_STATUS_LABELS = {
  [COURSE_STATUS.AVAILABLE]: 'Disponible',
  [COURSE_STATUS.UNDER_REVIEW]: 'En Revisión',
  [COURSE_STATUS.CLOSED]: 'Cerrado'
}

export const COURSE_STATUS_COLORS = {
  [COURSE_STATUS.AVAILABLE]: 'success',
  [COURSE_STATUS.UNDER_REVIEW]: 'warning',
  [COURSE_STATUS.CLOSED]: 'error'
}

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/registro',
  ADMIN: '/admin',
  EDIT_COURSE: '/editar-curso'
}

export const BREAKPOINTS = {
  MOBILE: 600,
  TABLET: 960,
  DESKTOP: 1264
}