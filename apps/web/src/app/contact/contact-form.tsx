'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')

    const subject = encodeURIComponent(`[Contacto SOBRA] ${formData.topic || 'Nueva consulta'}`)
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
    )

    window.location.href = `mailto:soporte@sobra.app?subject=${subject}&body=${body}`
    setTimeout(() => setStatus('sent'), 400)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Nombre completo</label>
          <Input
            name="name"
            placeholder="María López"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Correo electrónico</label>
          <Input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Asunto</label>
        <Input
          name="topic"
          placeholder="Ej. Problema al registrar un gasto"
          value={formData.topic}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Mensaje</label>
        <Textarea
          name="message"
          rows={5}
          placeholder="Cuéntanos en qué podemos ayudarte..."
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Abriendo tu correo...' : 'Enviar mensaje'}
      </Button>
      {status === 'sent' && (
        <p className="text-center text-sm text-muted-foreground">
          Hemos abierto tu cliente de correo con la información que escribiste.
        </p>
      )}
    </form>
  )
}
