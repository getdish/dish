import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { PhotoBase, PhotoXref } from '../types'

export const PhotoQueryHelpers = createQueryHelpersFor<PhotoBase>('photo')
export const PhotoXrefQueryHelpers = createQueryHelpersFor<PhotoXref>('photo_xref')
