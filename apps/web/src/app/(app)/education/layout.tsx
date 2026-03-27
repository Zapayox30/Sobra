import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Educación financiera',
  description:
    'Tips y consejos personalizados para mejorar tus finanzas personales. Aprende a ahorrar, invertir y manejar deudas.',
}

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children
}
