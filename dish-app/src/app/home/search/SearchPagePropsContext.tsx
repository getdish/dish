import { createContext } from 'react'

import { SearchProps } from './SearchProps'

export const SearchPagePropsContext = createContext<SearchProps | null>(null)
