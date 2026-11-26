import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { TextField } from './Field'
import { Notice } from './Notice'

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('TextField', () => {
  it('links the label and the error message to the input', () => {
    render(<TextField label="Policy number" error="Required" />)
    const input = screen.getByLabelText('Policy number')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Required')
  })
})

describe('Notice', () => {
  it('announces danger notices as alerts', () => {
    render(<Notice tone="danger" title="Could not load" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load')
  })
})
