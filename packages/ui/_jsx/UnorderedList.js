var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Text, XStack, YStack } from "tamagui";
const UnorderedList = /* @__PURE__ */ __name((props) => {
  return <YStack paddingLeft="$4" {...props} />;
}, "UnorderedList");
const UnorderedListItem = /* @__PURE__ */ __name(({ children, size, ...props }) => {
  return <XStack marginVertical="$1">
    <Text {...props} size={size}>{`\u2022`}</Text>
    <Text flex={1} paddingLeft="$4" size={size} {...props}>{children}</Text>
  </XStack>;
}, "UnorderedListItem");
export {
  UnorderedList,
  UnorderedListItem
};
