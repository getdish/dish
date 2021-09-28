import { Title as SnackTitle, TitleProps } from 'snackui'

export const TitleStyled = (
  props: TitleProps & {
    fontTheme?: 'slab' | 'sans'
  }
) => {
  return (
    <SnackTitle
      {...props}
      fontFamily={props.fontTheme === 'sans' ? 'Magnat' : 'WhyteHeavy'}
      // fontFamily="Magnat"
      className={`font-title ${props.className || ''}`}
    />
  )
}
