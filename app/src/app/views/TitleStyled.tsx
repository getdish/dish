import { Title as SnackTitle, TitleProps } from 'snackui'

export const TitleStyled = (props: TitleProps) => {
  return <SnackTitle {...props} className={`font-title ${props.className || ''}`} />
}
