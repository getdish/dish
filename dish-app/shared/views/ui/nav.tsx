import { router } from '../../state/router.1'

export function nav(navItem: any, linkProps: any, props: any, e: any) {
  if (linkProps.onPress || props.onClick) {
    e.navigate = () => router.navigate(navItem)
    props.onClick?.(e!)
    linkProps.onPress?.(e)
  } else {
    if (!props.preventNavigate && !!navItem.name) {
      router.navigate(navItem)
    }
  }
}
