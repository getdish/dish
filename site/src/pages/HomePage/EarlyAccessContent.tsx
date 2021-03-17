import { Paragraph, Scale } from '@o/ui'
import React from 'react'

import { Link } from '../../views/Link'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SignupForm } from './SignupForm'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export const EarlyAccessContent = () => {
  return (
    <SpacedPageContent
      alignItems="center"
      header={
        <>
          <PillButton>Beta</PillButton>
          <TitleText size="xl">Early Access</TitleText>
          <TitleTextSub>Join orbit insiders for early access & updates.</TitleTextSub>
        </>
      }
    >
      <Scale size={1.2}>
        <SignupForm />
      </Scale>
      <Paragraph margin={[0, 'auto']}>
        Have a unique use case? <Link href="mailto:hi@tryorbit.com">Contact us</Link>.
      </Paragraph>
    </SpacedPageContent>
  )
}
