import { createContext } from 'react'

import { Props } from './SearchPage'

export const SearchPagePropsContext = createContext<Props | null>(null)
