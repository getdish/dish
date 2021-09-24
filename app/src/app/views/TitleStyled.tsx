import { Title as SnackTitle, TitleProps } from 'snackui'

export const TitleStyled = (props: TitleProps) => {
  return (
    <SnackTitle
      {...props}
      fontFamily="WhyteHeavy"
      className={`font-title ${props.className || ''}`}
    />
  )
}
