import { Paragraph, ParagraphProps, Theme, useTheme } from 'snackui'

export const HighlightedText = (props: ParagraphProps) => {
  const theme = useTheme()
  return (
    <Theme name="orange">
      <Paragraph
        borderWidth={1}
        backgroundColor={theme.backgroundColor}
        borderColor={theme.borderColor}
        borderRadius={10}
        paddingVertical="2%"
        paddingHorizontal="3%"
        sizeLineHeight={0.95}
        {...props}
      />
    </Theme>
  )
}
