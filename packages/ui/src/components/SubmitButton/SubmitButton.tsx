import * as React from 'react'
import { Button } from '../Button'
import type { SubmitButtonProps } from './SubmitButton.types'

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>((props, ref) => {
  return <Button ref={ref} type="submit" {...props} />
})
SubmitButton.displayName = 'SubmitButton'
