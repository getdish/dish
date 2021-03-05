declare module "IconProps" {
    import { SvgProps } from 'react-native-svg';
    export type IconProps = Omit<SvgProps, 'onPress' | 'onPressIn' | 'onPressOut'> & {
        size?: number;
        color?: string;
        style?: any;
    };
}
declare module "icons/activity" {
    import { IconProps } from "IconProps";
    export const Activity: (props: IconProps) => JSX.Element;
}
declare module "icons/airplay" {
    import { IconProps } from "IconProps";
    export const Airplay: (props: IconProps) => JSX.Element;
}
declare module "icons/alert-circle" {
    import { IconProps } from "IconProps";
    export const AlertCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/alert-octagon" {
    import { IconProps } from "IconProps";
    export const AlertOctagon: (props: IconProps) => JSX.Element;
}
declare module "icons/alert-triangle" {
    import { IconProps } from "IconProps";
    export const AlertTriangle: (props: IconProps) => JSX.Element;
}
declare module "icons/align-center" {
    import { IconProps } from "IconProps";
    export const AlignCenter: (props: IconProps) => JSX.Element;
}
declare module "icons/align-justify" {
    import { IconProps } from "IconProps";
    export const AlignJustify: (props: IconProps) => JSX.Element;
}
declare module "icons/align-left" {
    import { IconProps } from "IconProps";
    export const AlignLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/align-right" {
    import { IconProps } from "IconProps";
    export const AlignRight: (props: IconProps) => JSX.Element;
}
declare module "icons/anchor" {
    import { IconProps } from "IconProps";
    export const Anchor: (props: IconProps) => JSX.Element;
}
declare module "icons/aperture" {
    import { IconProps } from "IconProps";
    export const Aperture: (props: IconProps) => JSX.Element;
}
declare module "icons/archive" {
    import { IconProps } from "IconProps";
    export const Archive: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-down-circle" {
    import { IconProps } from "IconProps";
    export const ArrowDownCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-down-left" {
    import { IconProps } from "IconProps";
    export const ArrowDownLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-down-right" {
    import { IconProps } from "IconProps";
    export const ArrowDownRight: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-down" {
    import { IconProps } from "IconProps";
    export const ArrowDown: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-left-circle" {
    import { IconProps } from "IconProps";
    export const ArrowLeftCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-left" {
    import { IconProps } from "IconProps";
    export const ArrowLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-right-circle" {
    import { IconProps } from "IconProps";
    export const ArrowRightCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-right" {
    import { IconProps } from "IconProps";
    export const ArrowRight: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-up-circle" {
    import { IconProps } from "IconProps";
    export const ArrowUpCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-up-left" {
    import { IconProps } from "IconProps";
    export const ArrowUpLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-up-right" {
    import { IconProps } from "IconProps";
    export const ArrowUpRight: (props: IconProps) => JSX.Element;
}
declare module "icons/arrow-up" {
    import { IconProps } from "IconProps";
    export const ArrowUp: (props: IconProps) => JSX.Element;
}
declare module "icons/at-sign" {
    import { IconProps } from "IconProps";
    export const AtSign: (props: IconProps) => JSX.Element;
}
declare module "icons/award" {
    import { IconProps } from "IconProps";
    export const Award: (props: IconProps) => JSX.Element;
}
declare module "icons/bar-chart-2" {
    import { IconProps } from "IconProps";
    export const BarChart2: (props: IconProps) => JSX.Element;
}
declare module "icons/bar-chart" {
    import { IconProps } from "IconProps";
    export const BarChart: (props: IconProps) => JSX.Element;
}
declare module "icons/battery-charging" {
    import { IconProps } from "IconProps";
    export const BatteryCharging: (props: IconProps) => JSX.Element;
}
declare module "icons/battery" {
    import { IconProps } from "IconProps";
    export const Battery: (props: IconProps) => JSX.Element;
}
declare module "icons/bell-off" {
    import { IconProps } from "IconProps";
    export const BellOff: (props: IconProps) => JSX.Element;
}
declare module "icons/bell" {
    import { IconProps } from "IconProps";
    export const Bell: (props: IconProps) => JSX.Element;
}
declare module "icons/bluetooth" {
    import { IconProps } from "IconProps";
    export const Bluetooth: (props: IconProps) => JSX.Element;
}
declare module "icons/bold" {
    import { IconProps } from "IconProps";
    export const Bold: (props: IconProps) => JSX.Element;
}
declare module "icons/book-open" {
    import { IconProps } from "IconProps";
    export const BookOpen: (props: IconProps) => JSX.Element;
}
declare module "icons/book" {
    import { IconProps } from "IconProps";
    export const Book: (props: IconProps) => JSX.Element;
}
declare module "icons/bookmark" {
    import { IconProps } from "IconProps";
    export const Bookmark: (props: IconProps) => JSX.Element;
}
declare module "icons/box" {
    import { IconProps } from "IconProps";
    export const Box: (props: IconProps) => JSX.Element;
}
declare module "icons/briefcase" {
    import { IconProps } from "IconProps";
    export const Briefcase: (props: IconProps) => JSX.Element;
}
declare module "icons/calendar" {
    import { IconProps } from "IconProps";
    export const Calendar: (props: IconProps) => JSX.Element;
}
declare module "icons/camera-off" {
    import { IconProps } from "IconProps";
    export const CameraOff: (props: IconProps) => JSX.Element;
}
declare module "icons/camera" {
    import { IconProps } from "IconProps";
    export const Camera: (props: IconProps) => JSX.Element;
}
declare module "icons/cast" {
    import { IconProps } from "IconProps";
    export const Cast: (props: IconProps) => JSX.Element;
}
declare module "icons/check-circle" {
    import { IconProps } from "IconProps";
    export const CheckCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/check-square" {
    import { IconProps } from "IconProps";
    export const CheckSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/check" {
    import { IconProps } from "IconProps";
    export const Check: (props: IconProps) => JSX.Element;
}
declare module "icons/chevron-down" {
    import { IconProps } from "IconProps";
    export const ChevronDown: (props: IconProps) => JSX.Element;
}
declare module "icons/chevron-left" {
    import { IconProps } from "IconProps";
    export const ChevronLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/chevron-right" {
    import { IconProps } from "IconProps";
    export const ChevronRight: (props: IconProps) => JSX.Element;
}
declare module "icons/chevron-up" {
    import { IconProps } from "IconProps";
    export const ChevronUp: (props: IconProps) => JSX.Element;
}
declare module "icons/chevrons-down" {
    import { IconProps } from "IconProps";
    export const ChevronsDown: (props: IconProps) => JSX.Element;
}
declare module "icons/chevrons-left" {
    import { IconProps } from "IconProps";
    export const ChevronsLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/chevrons-right" {
    import { IconProps } from "IconProps";
    export const ChevronsRight: (props: IconProps) => JSX.Element;
}
declare module "icons/chevrons-up" {
    import { IconProps } from "IconProps";
    export const ChevronsUp: (props: IconProps) => JSX.Element;
}
declare module "icons/chrome" {
    import { IconProps } from "IconProps";
    export const Chrome: (props: IconProps) => JSX.Element;
}
declare module "icons/circle" {
    import { IconProps } from "IconProps";
    export const Circle: (props: IconProps) => JSX.Element;
}
declare module "icons/clipboard" {
    import { IconProps } from "IconProps";
    export const Clipboard: (props: IconProps) => JSX.Element;
}
declare module "icons/clock" {
    import { IconProps } from "IconProps";
    export const Clock: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud-drizzle" {
    import { IconProps } from "IconProps";
    export const CloudDrizzle: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud-lightning" {
    import { IconProps } from "IconProps";
    export const CloudLightning: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud-off" {
    import { IconProps } from "IconProps";
    export const CloudOff: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud-rain" {
    import { IconProps } from "IconProps";
    export const CloudRain: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud-snow" {
    import { IconProps } from "IconProps";
    export const CloudSnow: (props: IconProps) => JSX.Element;
}
declare module "icons/cloud" {
    import { IconProps } from "IconProps";
    export const Cloud: (props: IconProps) => JSX.Element;
}
declare module "icons/code" {
    import { IconProps } from "IconProps";
    export const Code: (props: IconProps) => JSX.Element;
}
declare module "icons/codepen" {
    import { IconProps } from "IconProps";
    export const Codepen: (props: IconProps) => JSX.Element;
}
declare module "icons/codesandbox" {
    import { IconProps } from "IconProps";
    export const Codesandbox: (props: IconProps) => JSX.Element;
}
declare module "icons/coffee" {
    import { IconProps } from "IconProps";
    export const Coffee: (props: IconProps) => JSX.Element;
}
declare module "icons/columns" {
    import { IconProps } from "IconProps";
    export const Columns: (props: IconProps) => JSX.Element;
}
declare module "icons/command" {
    import { IconProps } from "IconProps";
    export const Command: (props: IconProps) => JSX.Element;
}
declare module "icons/compass" {
    import { IconProps } from "IconProps";
    export const Compass: (props: IconProps) => JSX.Element;
}
declare module "icons/copy" {
    import { IconProps } from "IconProps";
    export const Copy: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-down-left" {
    import { IconProps } from "IconProps";
    export const CornerDownLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-down-right" {
    import { IconProps } from "IconProps";
    export const CornerDownRight: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-left-down" {
    import { IconProps } from "IconProps";
    export const CornerLeftDown: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-left-up" {
    import { IconProps } from "IconProps";
    export const CornerLeftUp: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-right-down" {
    import { IconProps } from "IconProps";
    export const CornerRightDown: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-right-up" {
    import { IconProps } from "IconProps";
    export const CornerRightUp: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-up-left" {
    import { IconProps } from "IconProps";
    export const CornerUpLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/corner-up-right" {
    import { IconProps } from "IconProps";
    export const CornerUpRight: (props: IconProps) => JSX.Element;
}
declare module "icons/cpu" {
    import { IconProps } from "IconProps";
    export const Cpu: (props: IconProps) => JSX.Element;
}
declare module "icons/credit-card" {
    import { IconProps } from "IconProps";
    export const CreditCard: (props: IconProps) => JSX.Element;
}
declare module "icons/crop" {
    import { IconProps } from "IconProps";
    export const Crop: (props: IconProps) => JSX.Element;
}
declare module "icons/crosshair" {
    import { IconProps } from "IconProps";
    export const Crosshair: (props: IconProps) => JSX.Element;
}
declare module "icons/database" {
    import { IconProps } from "IconProps";
    export const Database: (props: IconProps) => JSX.Element;
}
declare module "icons/delete" {
    import { IconProps } from "IconProps";
    export const Delete: (props: IconProps) => JSX.Element;
}
declare module "icons/disc" {
    import { IconProps } from "IconProps";
    export const Disc: (props: IconProps) => JSX.Element;
}
declare module "icons/divide-circle" {
    import { IconProps } from "IconProps";
    export const DivideCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/divide-square" {
    import { IconProps } from "IconProps";
    export const DivideSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/divide" {
    import { IconProps } from "IconProps";
    export const Divide: (props: IconProps) => JSX.Element;
}
declare module "icons/dollar-sign" {
    import { IconProps } from "IconProps";
    export const DollarSign: (props: IconProps) => JSX.Element;
}
declare module "icons/download-cloud" {
    import { IconProps } from "IconProps";
    export const DownloadCloud: (props: IconProps) => JSX.Element;
}
declare module "icons/download" {
    import { IconProps } from "IconProps";
    export const Download: (props: IconProps) => JSX.Element;
}
declare module "icons/dribbble" {
    import { IconProps } from "IconProps";
    export const Dribbble: (props: IconProps) => JSX.Element;
}
declare module "icons/droplet" {
    import { IconProps } from "IconProps";
    export const Droplet: (props: IconProps) => JSX.Element;
}
declare module "icons/edit-2" {
    import { IconProps } from "IconProps";
    export const Edit2: (props: IconProps) => JSX.Element;
}
declare module "icons/edit-3" {
    import { IconProps } from "IconProps";
    export const Edit3: (props: IconProps) => JSX.Element;
}
declare module "icons/edit" {
    import { IconProps } from "IconProps";
    export const Edit: (props: IconProps) => JSX.Element;
}
declare module "icons/external-link" {
    import { IconProps } from "IconProps";
    export const ExternalLink: (props: IconProps) => JSX.Element;
}
declare module "icons/eye-off" {
    import { IconProps } from "IconProps";
    export const EyeOff: (props: IconProps) => JSX.Element;
}
declare module "icons/eye" {
    import { IconProps } from "IconProps";
    export const Eye: (props: IconProps) => JSX.Element;
}
declare module "icons/facebook" {
    import { IconProps } from "IconProps";
    export const Facebook: (props: IconProps) => JSX.Element;
}
declare module "icons/fast-forward" {
    import { IconProps } from "IconProps";
    export const FastForward: (props: IconProps) => JSX.Element;
}
declare module "icons/feather" {
    import { IconProps } from "IconProps";
    export const Feather: (props: IconProps) => JSX.Element;
}
declare module "icons/figma" {
    import { IconProps } from "IconProps";
    export const Figma: (props: IconProps) => JSX.Element;
}
declare module "icons/file-minus" {
    import { IconProps } from "IconProps";
    export const FileMinus: (props: IconProps) => JSX.Element;
}
declare module "icons/file-plus" {
    import { IconProps } from "IconProps";
    export const FilePlus: (props: IconProps) => JSX.Element;
}
declare module "icons/file-text" {
    import { IconProps } from "IconProps";
    export const FileText: (props: IconProps) => JSX.Element;
}
declare module "icons/file" {
    import { IconProps } from "IconProps";
    export const File: (props: IconProps) => JSX.Element;
}
declare module "icons/film" {
    import { IconProps } from "IconProps";
    export const Film: (props: IconProps) => JSX.Element;
}
declare module "icons/filter" {
    import { IconProps } from "IconProps";
    export const Filter: (props: IconProps) => JSX.Element;
}
declare module "icons/flag" {
    import { IconProps } from "IconProps";
    export const Flag: (props: IconProps) => JSX.Element;
}
declare module "icons/folder-minus" {
    import { IconProps } from "IconProps";
    export const FolderMinus: (props: IconProps) => JSX.Element;
}
declare module "icons/folder-plus" {
    import { IconProps } from "IconProps";
    export const FolderPlus: (props: IconProps) => JSX.Element;
}
declare module "icons/folder" {
    import { IconProps } from "IconProps";
    export const Folder: (props: IconProps) => JSX.Element;
}
declare module "icons/framer" {
    import { IconProps } from "IconProps";
    export const Framer: (props: IconProps) => JSX.Element;
}
declare module "icons/frown" {
    import { IconProps } from "IconProps";
    export const Frown: (props: IconProps) => JSX.Element;
}
declare module "icons/gift" {
    import { IconProps } from "IconProps";
    export const Gift: (props: IconProps) => JSX.Element;
}
declare module "icons/git-branch" {
    import { IconProps } from "IconProps";
    export const GitBranch: (props: IconProps) => JSX.Element;
}
declare module "icons/git-commit" {
    import { IconProps } from "IconProps";
    export const GitCommit: (props: IconProps) => JSX.Element;
}
declare module "icons/git-merge" {
    import { IconProps } from "IconProps";
    export const GitMerge: (props: IconProps) => JSX.Element;
}
declare module "icons/git-pull-request" {
    import { IconProps } from "IconProps";
    export const GitPullRequest: (props: IconProps) => JSX.Element;
}
declare module "icons/github" {
    import { IconProps } from "IconProps";
    export const Github: (props: IconProps) => JSX.Element;
}
declare module "icons/gitlab" {
    import { IconProps } from "IconProps";
    export const Gitlab: (props: IconProps) => JSX.Element;
}
declare module "icons/globe" {
    import { IconProps } from "IconProps";
    export const Globe: (props: IconProps) => JSX.Element;
}
declare module "icons/grid" {
    import { IconProps } from "IconProps";
    export const Grid: (props: IconProps) => JSX.Element;
}
declare module "icons/hard-drive" {
    import { IconProps } from "IconProps";
    export const HardDrive: (props: IconProps) => JSX.Element;
}
declare module "icons/hash" {
    import { IconProps } from "IconProps";
    export const Hash: (props: IconProps) => JSX.Element;
}
declare module "icons/headphones" {
    import { IconProps } from "IconProps";
    export const Headphones: (props: IconProps) => JSX.Element;
}
declare module "icons/heart" {
    import { IconProps } from "IconProps";
    export const Heart: (props: IconProps) => JSX.Element;
}
declare module "icons/help-circle" {
    import { IconProps } from "IconProps";
    export const HelpCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/hexagon" {
    import { IconProps } from "IconProps";
    export const Hexagon: (props: IconProps) => JSX.Element;
}
declare module "icons/home" {
    import { IconProps } from "IconProps";
    export const Home: (props: IconProps) => JSX.Element;
}
declare module "icons/image" {
    import { IconProps } from "IconProps";
    export const Image: (props: IconProps) => JSX.Element;
}
declare module "icons/inbox" {
    import { IconProps } from "IconProps";
    export const Inbox: (props: IconProps) => JSX.Element;
}
declare module "icons/info" {
    import { IconProps } from "IconProps";
    export const Info: (props: IconProps) => JSX.Element;
}
declare module "icons/instagram" {
    import { IconProps } from "IconProps";
    export const Instagram: (props: IconProps) => JSX.Element;
}
declare module "icons/italic" {
    import { IconProps } from "IconProps";
    export const Italic: (props: IconProps) => JSX.Element;
}
declare module "icons/key" {
    import { IconProps } from "IconProps";
    export const Key: (props: IconProps) => JSX.Element;
}
declare module "icons/layers" {
    import { IconProps } from "IconProps";
    export const Layers: (props: IconProps) => JSX.Element;
}
declare module "icons/layout" {
    import { IconProps } from "IconProps";
    export const Layout: (props: IconProps) => JSX.Element;
}
declare module "icons/life-buoy" {
    import { IconProps } from "IconProps";
    export const LifeBuoy: (props: IconProps) => JSX.Element;
}
declare module "icons/link-2" {
    import { IconProps } from "IconProps";
    export const Link2: (props: IconProps) => JSX.Element;
}
declare module "icons/link" {
    import { IconProps } from "IconProps";
    export const Link: (props: IconProps) => JSX.Element;
}
declare module "icons/linkedin" {
    import { IconProps } from "IconProps";
    export const Linkedin: (props: IconProps) => JSX.Element;
}
declare module "icons/list" {
    import { IconProps } from "IconProps";
    export const List: (props: IconProps) => JSX.Element;
}
declare module "icons/loader" {
    import { IconProps } from "IconProps";
    export const Loader: (props: IconProps) => JSX.Element;
}
declare module "icons/lock" {
    import { IconProps } from "IconProps";
    export const Lock: (props: IconProps) => JSX.Element;
}
declare module "icons/log-in" {
    import { IconProps } from "IconProps";
    export const LogIn: (props: IconProps) => JSX.Element;
}
declare module "icons/log-out" {
    import { IconProps } from "IconProps";
    export const LogOut: (props: IconProps) => JSX.Element;
}
declare module "icons/mail" {
    import { IconProps } from "IconProps";
    export const Mail: (props: IconProps) => JSX.Element;
}
declare module "icons/map-pin" {
    import { IconProps } from "IconProps";
    export const MapPin: (props: IconProps) => JSX.Element;
}
declare module "icons/map" {
    import { IconProps } from "IconProps";
    export const Map: (props: IconProps) => JSX.Element;
}
declare module "icons/maximize-2" {
    import { IconProps } from "IconProps";
    export const Maximize2: (props: IconProps) => JSX.Element;
}
declare module "icons/maximize" {
    import { IconProps } from "IconProps";
    export const Maximize: (props: IconProps) => JSX.Element;
}
declare module "icons/meh" {
    import { IconProps } from "IconProps";
    export const Meh: (props: IconProps) => JSX.Element;
}
declare module "icons/menu" {
    import { IconProps } from "IconProps";
    export const Menu: (props: IconProps) => JSX.Element;
}
declare module "icons/message-circle" {
    import { IconProps } from "IconProps";
    export const MessageCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/message-square" {
    import { IconProps } from "IconProps";
    export const MessageSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/mic-off" {
    import { IconProps } from "IconProps";
    export const MicOff: (props: IconProps) => JSX.Element;
}
declare module "icons/mic" {
    import { IconProps } from "IconProps";
    export const Mic: (props: IconProps) => JSX.Element;
}
declare module "icons/minimize-2" {
    import { IconProps } from "IconProps";
    export const Minimize2: (props: IconProps) => JSX.Element;
}
declare module "icons/minimize" {
    import { IconProps } from "IconProps";
    export const Minimize: (props: IconProps) => JSX.Element;
}
declare module "icons/minus-circle" {
    import { IconProps } from "IconProps";
    export const MinusCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/minus-square" {
    import { IconProps } from "IconProps";
    export const MinusSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/minus" {
    import { IconProps } from "IconProps";
    export const Minus: (props: IconProps) => JSX.Element;
}
declare module "icons/monitor" {
    import { IconProps } from "IconProps";
    export const Monitor: (props: IconProps) => JSX.Element;
}
declare module "icons/moon" {
    import { IconProps } from "IconProps";
    export const Moon: (props: IconProps) => JSX.Element;
}
declare module "icons/more-horizontal" {
    import { IconProps } from "IconProps";
    export const MoreHorizontal: (props: IconProps) => JSX.Element;
}
declare module "icons/more-vertical" {
    import { IconProps } from "IconProps";
    export const MoreVertical: (props: IconProps) => JSX.Element;
}
declare module "icons/mouse-pointer" {
    import { IconProps } from "IconProps";
    export const MousePointer: (props: IconProps) => JSX.Element;
}
declare module "icons/move" {
    import { IconProps } from "IconProps";
    export const Move: (props: IconProps) => JSX.Element;
}
declare module "icons/music" {
    import { IconProps } from "IconProps";
    export const Music: (props: IconProps) => JSX.Element;
}
declare module "icons/navigation-2" {
    import { IconProps } from "IconProps";
    export const Navigation2: (props: IconProps) => JSX.Element;
}
declare module "icons/navigation" {
    import { IconProps } from "IconProps";
    export const Navigation: (props: IconProps) => JSX.Element;
}
declare module "icons/octagon" {
    import { IconProps } from "IconProps";
    export const Octagon: (props: IconProps) => JSX.Element;
}
declare module "icons/package" {
    import { IconProps } from "IconProps";
    export const Package: (props: IconProps) => JSX.Element;
}
declare module "icons/paperclip" {
    import { IconProps } from "IconProps";
    export const Paperclip: (props: IconProps) => JSX.Element;
}
declare module "icons/pause-circle" {
    import { IconProps } from "IconProps";
    export const PauseCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/pause" {
    import { IconProps } from "IconProps";
    export const Pause: (props: IconProps) => JSX.Element;
}
declare module "icons/pen-tool" {
    import { IconProps } from "IconProps";
    export const PenTool: (props: IconProps) => JSX.Element;
}
declare module "icons/percent" {
    import { IconProps } from "IconProps";
    export const Percent: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-call" {
    import { IconProps } from "IconProps";
    export const PhoneCall: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-forwarded" {
    import { IconProps } from "IconProps";
    export const PhoneForwarded: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-incoming" {
    import { IconProps } from "IconProps";
    export const PhoneIncoming: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-missed" {
    import { IconProps } from "IconProps";
    export const PhoneMissed: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-off" {
    import { IconProps } from "IconProps";
    export const PhoneOff: (props: IconProps) => JSX.Element;
}
declare module "icons/phone-outgoing" {
    import { IconProps } from "IconProps";
    export const PhoneOutgoing: (props: IconProps) => JSX.Element;
}
declare module "icons/phone" {
    import { IconProps } from "IconProps";
    export const Phone: (props: IconProps) => JSX.Element;
}
declare module "icons/pie-chart" {
    import { IconProps } from "IconProps";
    export const PieChart: (props: IconProps) => JSX.Element;
}
declare module "icons/play-circle" {
    import { IconProps } from "IconProps";
    export const PlayCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/play" {
    import { IconProps } from "IconProps";
    export const Play: (props: IconProps) => JSX.Element;
}
declare module "icons/plus-circle" {
    import { IconProps } from "IconProps";
    export const PlusCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/plus-square" {
    import { IconProps } from "IconProps";
    export const PlusSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/plus" {
    import { IconProps } from "IconProps";
    export const Plus: (props: IconProps) => JSX.Element;
}
declare module "icons/pocket" {
    import { IconProps } from "IconProps";
    export const Pocket: (props: IconProps) => JSX.Element;
}
declare module "icons/power" {
    import { IconProps } from "IconProps";
    export const Power: (props: IconProps) => JSX.Element;
}
declare module "icons/printer" {
    import { IconProps } from "IconProps";
    export const Printer: (props: IconProps) => JSX.Element;
}
declare module "icons/radio" {
    import { IconProps } from "IconProps";
    export const Radio: (props: IconProps) => JSX.Element;
}
declare module "icons/refresh-ccw" {
    import { IconProps } from "IconProps";
    export const RefreshCcw: (props: IconProps) => JSX.Element;
}
declare module "icons/refresh-cw" {
    import { IconProps } from "IconProps";
    export const RefreshCw: (props: IconProps) => JSX.Element;
}
declare module "icons/repeat" {
    import { IconProps } from "IconProps";
    export const Repeat: (props: IconProps) => JSX.Element;
}
declare module "icons/rewind" {
    import { IconProps } from "IconProps";
    export const Rewind: (props: IconProps) => JSX.Element;
}
declare module "icons/rotate-ccw" {
    import { IconProps } from "IconProps";
    export const RotateCcw: (props: IconProps) => JSX.Element;
}
declare module "icons/rotate-cw" {
    import { IconProps } from "IconProps";
    export const RotateCw: (props: IconProps) => JSX.Element;
}
declare module "icons/rss" {
    import { IconProps } from "IconProps";
    export const Rss: (props: IconProps) => JSX.Element;
}
declare module "icons/save" {
    import { IconProps } from "IconProps";
    export const Save: (props: IconProps) => JSX.Element;
}
declare module "icons/scissors" {
    import { IconProps } from "IconProps";
    export const Scissors: (props: IconProps) => JSX.Element;
}
declare module "icons/search" {
    import { IconProps } from "IconProps";
    export const Search: (props: IconProps) => JSX.Element;
}
declare module "icons/send" {
    import { IconProps } from "IconProps";
    export const Send: (props: IconProps) => JSX.Element;
}
declare module "icons/server" {
    import { IconProps } from "IconProps";
    export const Server: (props: IconProps) => JSX.Element;
}
declare module "icons/settings" {
    import { IconProps } from "IconProps";
    export const Settings: (props: IconProps) => JSX.Element;
}
declare module "icons/share-2" {
    import { IconProps } from "IconProps";
    export const Share2: (props: IconProps) => JSX.Element;
}
declare module "icons/share" {
    import { IconProps } from "IconProps";
    export const Share: (props: IconProps) => JSX.Element;
}
declare module "icons/shield-off" {
    import { IconProps } from "IconProps";
    export const ShieldOff: (props: IconProps) => JSX.Element;
}
declare module "icons/shield" {
    import { IconProps } from "IconProps";
    export const Shield: (props: IconProps) => JSX.Element;
}
declare module "icons/shopping-bag" {
    import { IconProps } from "IconProps";
    export const ShoppingBag: (props: IconProps) => JSX.Element;
}
declare module "icons/shopping-cart" {
    import { IconProps } from "IconProps";
    export const ShoppingCart: (props: IconProps) => JSX.Element;
}
declare module "icons/shuffle" {
    import { IconProps } from "IconProps";
    export const Shuffle: (props: IconProps) => JSX.Element;
}
declare module "icons/sidebar" {
    import { IconProps } from "IconProps";
    export const Sidebar: (props: IconProps) => JSX.Element;
}
declare module "icons/skip-back" {
    import { IconProps } from "IconProps";
    export const SkipBack: (props: IconProps) => JSX.Element;
}
declare module "icons/skip-forward" {
    import { IconProps } from "IconProps";
    export const SkipForward: (props: IconProps) => JSX.Element;
}
declare module "icons/slack" {
    import { IconProps } from "IconProps";
    export const Slack: (props: IconProps) => JSX.Element;
}
declare module "icons/slash" {
    import { IconProps } from "IconProps";
    export const Slash: (props: IconProps) => JSX.Element;
}
declare module "icons/sliders" {
    import { IconProps } from "IconProps";
    export const Sliders: (props: IconProps) => JSX.Element;
}
declare module "icons/smartphone" {
    import { IconProps } from "IconProps";
    export const Smartphone: (props: IconProps) => JSX.Element;
}
declare module "icons/smile" {
    import { IconProps } from "IconProps";
    export const Smile: (props: IconProps) => JSX.Element;
}
declare module "icons/speaker" {
    import { IconProps } from "IconProps";
    export const Speaker: (props: IconProps) => JSX.Element;
}
declare module "icons/square" {
    import { IconProps } from "IconProps";
    export const Square: (props: IconProps) => JSX.Element;
}
declare module "icons/star" {
    import { IconProps } from "IconProps";
    export const Star: (props: IconProps) => JSX.Element;
}
declare module "icons/stop-circle" {
    import { IconProps } from "IconProps";
    export const StopCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/sun" {
    import { IconProps } from "IconProps";
    export const Sun: (props: IconProps) => JSX.Element;
}
declare module "icons/sunrise" {
    import { IconProps } from "IconProps";
    export const Sunrise: (props: IconProps) => JSX.Element;
}
declare module "icons/sunset" {
    import { IconProps } from "IconProps";
    export const Sunset: (props: IconProps) => JSX.Element;
}
declare module "icons/tablet" {
    import { IconProps } from "IconProps";
    export const Tablet: (props: IconProps) => JSX.Element;
}
declare module "icons/tag" {
    import { IconProps } from "IconProps";
    export const Tag: (props: IconProps) => JSX.Element;
}
declare module "icons/target" {
    import { IconProps } from "IconProps";
    export const Target: (props: IconProps) => JSX.Element;
}
declare module "icons/terminal" {
    import { IconProps } from "IconProps";
    export const Terminal: (props: IconProps) => JSX.Element;
}
declare module "icons/thermometer" {
    import { IconProps } from "IconProps";
    export const Thermometer: (props: IconProps) => JSX.Element;
}
declare module "icons/thumbs-down" {
    import { IconProps } from "IconProps";
    export const ThumbsDown: (props: IconProps) => JSX.Element;
}
declare module "icons/thumbs-up" {
    import { IconProps } from "IconProps";
    export const ThumbsUp: (props: IconProps) => JSX.Element;
}
declare module "icons/toggle-left" {
    import { IconProps } from "IconProps";
    export const ToggleLeft: (props: IconProps) => JSX.Element;
}
declare module "icons/toggle-right" {
    import { IconProps } from "IconProps";
    export const ToggleRight: (props: IconProps) => JSX.Element;
}
declare module "icons/tool" {
    import { IconProps } from "IconProps";
    export const Tool: (props: IconProps) => JSX.Element;
}
declare module "icons/trash-2" {
    import { IconProps } from "IconProps";
    export const Trash2: (props: IconProps) => JSX.Element;
}
declare module "icons/trash" {
    import { IconProps } from "IconProps";
    export const Trash: (props: IconProps) => JSX.Element;
}
declare module "icons/trello" {
    import { IconProps } from "IconProps";
    export const Trello: (props: IconProps) => JSX.Element;
}
declare module "icons/trending-down" {
    import { IconProps } from "IconProps";
    export const TrendingDown: (props: IconProps) => JSX.Element;
}
declare module "icons/trending-up" {
    import { IconProps } from "IconProps";
    export const TrendingUp: (props: IconProps) => JSX.Element;
}
declare module "icons/triangle" {
    import { IconProps } from "IconProps";
    export const Triangle: (props: IconProps) => JSX.Element;
}
declare module "icons/truck" {
    import { IconProps } from "IconProps";
    export const Truck: (props: IconProps) => JSX.Element;
}
declare module "icons/tv" {
    import { IconProps } from "IconProps";
    export const Tv: (props: IconProps) => JSX.Element;
}
declare module "icons/twitch" {
    import { IconProps } from "IconProps";
    export const Twitch: (props: IconProps) => JSX.Element;
}
declare module "icons/twitter" {
    import { IconProps } from "IconProps";
    export const Twitter: (props: IconProps) => JSX.Element;
}
declare module "icons/type" {
    import { IconProps } from "IconProps";
    export const Type: (props: IconProps) => JSX.Element;
}
declare module "icons/umbrella" {
    import { IconProps } from "IconProps";
    export const Umbrella: (props: IconProps) => JSX.Element;
}
declare module "icons/underline" {
    import { IconProps } from "IconProps";
    export const Underline: (props: IconProps) => JSX.Element;
}
declare module "icons/unlock" {
    import { IconProps } from "IconProps";
    export const Unlock: (props: IconProps) => JSX.Element;
}
declare module "icons/upload-cloud" {
    import { IconProps } from "IconProps";
    export const UploadCloud: (props: IconProps) => JSX.Element;
}
declare module "icons/upload" {
    import { IconProps } from "IconProps";
    export const Upload: (props: IconProps) => JSX.Element;
}
declare module "icons/user-check" {
    import { IconProps } from "IconProps";
    export const UserCheck: (props: IconProps) => JSX.Element;
}
declare module "icons/user-minus" {
    import { IconProps } from "IconProps";
    export const UserMinus: (props: IconProps) => JSX.Element;
}
declare module "icons/user-plus" {
    import { IconProps } from "IconProps";
    export const UserPlus: (props: IconProps) => JSX.Element;
}
declare module "icons/user-x" {
    import { IconProps } from "IconProps";
    export const UserX: (props: IconProps) => JSX.Element;
}
declare module "icons/user" {
    import { IconProps } from "IconProps";
    export const User: (props: IconProps) => JSX.Element;
}
declare module "icons/users" {
    import { IconProps } from "IconProps";
    export const Users: (props: IconProps) => JSX.Element;
}
declare module "icons/video-off" {
    import { IconProps } from "IconProps";
    export const VideoOff: (props: IconProps) => JSX.Element;
}
declare module "icons/video" {
    import { IconProps } from "IconProps";
    export const Video: (props: IconProps) => JSX.Element;
}
declare module "icons/voicemail" {
    import { IconProps } from "IconProps";
    export const Voicemail: (props: IconProps) => JSX.Element;
}
declare module "icons/volume-1" {
    import { IconProps } from "IconProps";
    export const Volume1: (props: IconProps) => JSX.Element;
}
declare module "icons/volume-2" {
    import { IconProps } from "IconProps";
    export const Volume2: (props: IconProps) => JSX.Element;
}
declare module "icons/volume-x" {
    import { IconProps } from "IconProps";
    export const VolumeX: (props: IconProps) => JSX.Element;
}
declare module "icons/volume" {
    import { IconProps } from "IconProps";
    export const Volume: (props: IconProps) => JSX.Element;
}
declare module "icons/watch" {
    import { IconProps } from "IconProps";
    export const Watch: (props: IconProps) => JSX.Element;
}
declare module "icons/wifi-off" {
    import { IconProps } from "IconProps";
    export const WifiOff: (props: IconProps) => JSX.Element;
}
declare module "icons/wifi" {
    import { IconProps } from "IconProps";
    export const Wifi: (props: IconProps) => JSX.Element;
}
declare module "icons/wind" {
    import { IconProps } from "IconProps";
    export const Wind: (props: IconProps) => JSX.Element;
}
declare module "icons/x-circle" {
    import { IconProps } from "IconProps";
    export const XCircle: (props: IconProps) => JSX.Element;
}
declare module "icons/x-octagon" {
    import { IconProps } from "IconProps";
    export const XOctagon: (props: IconProps) => JSX.Element;
}
declare module "icons/x-square" {
    import { IconProps } from "IconProps";
    export const XSquare: (props: IconProps) => JSX.Element;
}
declare module "icons/x" {
    import { IconProps } from "IconProps";
    export const X: (props: IconProps) => JSX.Element;
}
declare module "icons/youtube" {
    import { IconProps } from "IconProps";
    export const Youtube: (props: IconProps) => JSX.Element;
}
declare module "icons/zap-off" {
    import { IconProps } from "IconProps";
    export const ZapOff: (props: IconProps) => JSX.Element;
}
declare module "icons/zap" {
    import { IconProps } from "IconProps";
    export const Zap: (props: IconProps) => JSX.Element;
}
declare module "icons/zoom-in" {
    import { IconProps } from "IconProps";
    export const ZoomIn: (props: IconProps) => JSX.Element;
}
declare module "icons/zoom-out" {
    import { IconProps } from "IconProps";
    export const ZoomOut: (props: IconProps) => JSX.Element;
}
declare module "@dish/react-feather" {
    export { Activity } from "icons/activity";
    export { Airplay } from "icons/airplay";
    export { AlertCircle } from "icons/alert-circle";
    export { AlertOctagon } from "icons/alert-octagon";
    export { AlertTriangle } from "icons/alert-triangle";
    export { AlignCenter } from "icons/align-center";
    export { AlignJustify } from "icons/align-justify";
    export { AlignLeft } from "icons/align-left";
    export { AlignRight } from "icons/align-right";
    export { Anchor } from "icons/anchor";
    export { Aperture } from "icons/aperture";
    export { Archive } from "icons/archive";
    export { ArrowDownCircle } from "icons/arrow-down-circle";
    export { ArrowDownLeft } from "icons/arrow-down-left";
    export { ArrowDownRight } from "icons/arrow-down-right";
    export { ArrowDown } from "icons/arrow-down";
    export { ArrowLeftCircle } from "icons/arrow-left-circle";
    export { ArrowLeft } from "icons/arrow-left";
    export { ArrowRightCircle } from "icons/arrow-right-circle";
    export { ArrowRight } from "icons/arrow-right";
    export { ArrowUpCircle } from "icons/arrow-up-circle";
    export { ArrowUpLeft } from "icons/arrow-up-left";
    export { ArrowUpRight } from "icons/arrow-up-right";
    export { ArrowUp } from "icons/arrow-up";
    export { AtSign } from "icons/at-sign";
    export { Award } from "icons/award";
    export { BarChart2 } from "icons/bar-chart-2";
    export { BarChart } from "icons/bar-chart";
    export { BatteryCharging } from "icons/battery-charging";
    export { Battery } from "icons/battery";
    export { BellOff } from "icons/bell-off";
    export { Bell } from "icons/bell";
    export { Bluetooth } from "icons/bluetooth";
    export { Bold } from "icons/bold";
    export { BookOpen } from "icons/book-open";
    export { Book } from "icons/book";
    export { Bookmark } from "icons/bookmark";
    export { Box } from "icons/box";
    export { Briefcase } from "icons/briefcase";
    export { Calendar } from "icons/calendar";
    export { CameraOff } from "icons/camera-off";
    export { Camera } from "icons/camera";
    export { Cast } from "icons/cast";
    export { CheckCircle } from "icons/check-circle";
    export { CheckSquare } from "icons/check-square";
    export { Check } from "icons/check";
    export { ChevronDown } from "icons/chevron-down";
    export { ChevronLeft } from "icons/chevron-left";
    export { ChevronRight } from "icons/chevron-right";
    export { ChevronUp } from "icons/chevron-up";
    export { ChevronsDown } from "icons/chevrons-down";
    export { ChevronsLeft } from "icons/chevrons-left";
    export { ChevronsRight } from "icons/chevrons-right";
    export { ChevronsUp } from "icons/chevrons-up";
    export { Chrome } from "icons/chrome";
    export { Circle } from "icons/circle";
    export { Clipboard } from "icons/clipboard";
    export { Clock } from "icons/clock";
    export { CloudDrizzle } from "icons/cloud-drizzle";
    export { CloudLightning } from "icons/cloud-lightning";
    export { CloudOff } from "icons/cloud-off";
    export { CloudRain } from "icons/cloud-rain";
    export { CloudSnow } from "icons/cloud-snow";
    export { Cloud } from "icons/cloud";
    export { Code } from "icons/code";
    export { Codepen } from "icons/codepen";
    export { Codesandbox } from "icons/codesandbox";
    export { Coffee } from "icons/coffee";
    export { Columns } from "icons/columns";
    export { Command } from "icons/command";
    export { Compass } from "icons/compass";
    export { Copy } from "icons/copy";
    export { CornerDownLeft } from "icons/corner-down-left";
    export { CornerDownRight } from "icons/corner-down-right";
    export { CornerLeftDown } from "icons/corner-left-down";
    export { CornerLeftUp } from "icons/corner-left-up";
    export { CornerRightDown } from "icons/corner-right-down";
    export { CornerRightUp } from "icons/corner-right-up";
    export { CornerUpLeft } from "icons/corner-up-left";
    export { CornerUpRight } from "icons/corner-up-right";
    export { Cpu } from "icons/cpu";
    export { CreditCard } from "icons/credit-card";
    export { Crop } from "icons/crop";
    export { Crosshair } from "icons/crosshair";
    export { Database } from "icons/database";
    export { Delete } from "icons/delete";
    export { Disc } from "icons/disc";
    export { DivideCircle } from "icons/divide-circle";
    export { DivideSquare } from "icons/divide-square";
    export { Divide } from "icons/divide";
    export { DollarSign } from "icons/dollar-sign";
    export { DownloadCloud } from "icons/download-cloud";
    export { Download } from "icons/download";
    export { Dribbble } from "icons/dribbble";
    export { Droplet } from "icons/droplet";
    export { Edit2 } from "icons/edit-2";
    export { Edit3 } from "icons/edit-3";
    export { Edit } from "icons/edit";
    export { ExternalLink } from "icons/external-link";
    export { EyeOff } from "icons/eye-off";
    export { Eye } from "icons/eye";
    export { Facebook } from "icons/facebook";
    export { FastForward } from "icons/fast-forward";
    export { Feather } from "icons/feather";
    export { Figma } from "icons/figma";
    export { FileMinus } from "icons/file-minus";
    export { FilePlus } from "icons/file-plus";
    export { FileText } from "icons/file-text";
    export { File } from "icons/file";
    export { Film } from "icons/film";
    export { Filter } from "icons/filter";
    export { Flag } from "icons/flag";
    export { FolderMinus } from "icons/folder-minus";
    export { FolderPlus } from "icons/folder-plus";
    export { Folder } from "icons/folder";
    export { Framer } from "icons/framer";
    export { Frown } from "icons/frown";
    export { Gift } from "icons/gift";
    export { GitBranch } from "icons/git-branch";
    export { GitCommit } from "icons/git-commit";
    export { GitMerge } from "icons/git-merge";
    export { GitPullRequest } from "icons/git-pull-request";
    export { Github } from "icons/github";
    export { Gitlab } from "icons/gitlab";
    export { Globe } from "icons/globe";
    export { Grid } from "icons/grid";
    export { HardDrive } from "icons/hard-drive";
    export { Hash } from "icons/hash";
    export { Headphones } from "icons/headphones";
    export { Heart } from "icons/heart";
    export { HelpCircle } from "icons/help-circle";
    export { Hexagon } from "icons/hexagon";
    export { Home } from "icons/home";
    export { Image } from "icons/image";
    export { Inbox } from "icons/inbox";
    export { Info } from "icons/info";
    export { Instagram } from "icons/instagram";
    export { Italic } from "icons/italic";
    export { Key } from "icons/key";
    export { Layers } from "icons/layers";
    export { Layout } from "icons/layout";
    export { LifeBuoy } from "icons/life-buoy";
    export { Link2 } from "icons/link-2";
    export { Link } from "icons/link";
    export { Linkedin } from "icons/linkedin";
    export { List } from "icons/list";
    export { Loader } from "icons/loader";
    export { Lock } from "icons/lock";
    export { LogIn } from "icons/log-in";
    export { LogOut } from "icons/log-out";
    export { Mail } from "icons/mail";
    export { MapPin } from "icons/map-pin";
    export { Map } from "icons/map";
    export { Maximize2 } from "icons/maximize-2";
    export { Maximize } from "icons/maximize";
    export { Meh } from "icons/meh";
    export { Menu } from "icons/menu";
    export { MessageCircle } from "icons/message-circle";
    export { MessageSquare } from "icons/message-square";
    export { MicOff } from "icons/mic-off";
    export { Mic } from "icons/mic";
    export { Minimize2 } from "icons/minimize-2";
    export { Minimize } from "icons/minimize";
    export { MinusCircle } from "icons/minus-circle";
    export { MinusSquare } from "icons/minus-square";
    export { Minus } from "icons/minus";
    export { Monitor } from "icons/monitor";
    export { Moon } from "icons/moon";
    export { MoreHorizontal } from "icons/more-horizontal";
    export { MoreVertical } from "icons/more-vertical";
    export { MousePointer } from "icons/mouse-pointer";
    export { Move } from "icons/move";
    export { Music } from "icons/music";
    export { Navigation2 } from "icons/navigation-2";
    export { Navigation } from "icons/navigation";
    export { Octagon } from "icons/octagon";
    export { Package } from "icons/package";
    export { Paperclip } from "icons/paperclip";
    export { PauseCircle } from "icons/pause-circle";
    export { Pause } from "icons/pause";
    export { PenTool } from "icons/pen-tool";
    export { Percent } from "icons/percent";
    export { PhoneCall } from "icons/phone-call";
    export { PhoneForwarded } from "icons/phone-forwarded";
    export { PhoneIncoming } from "icons/phone-incoming";
    export { PhoneMissed } from "icons/phone-missed";
    export { PhoneOff } from "icons/phone-off";
    export { PhoneOutgoing } from "icons/phone-outgoing";
    export { Phone } from "icons/phone";
    export { PieChart } from "icons/pie-chart";
    export { PlayCircle } from "icons/play-circle";
    export { Play } from "icons/play";
    export { PlusCircle } from "icons/plus-circle";
    export { PlusSquare } from "icons/plus-square";
    export { Plus } from "icons/plus";
    export { Pocket } from "icons/pocket";
    export { Power } from "icons/power";
    export { Printer } from "icons/printer";
    export { Radio } from "icons/radio";
    export { RefreshCcw } from "icons/refresh-ccw";
    export { RefreshCw } from "icons/refresh-cw";
    export { Repeat } from "icons/repeat";
    export { Rewind } from "icons/rewind";
    export { RotateCcw } from "icons/rotate-ccw";
    export { RotateCw } from "icons/rotate-cw";
    export { Rss } from "icons/rss";
    export { Save } from "icons/save";
    export { Scissors } from "icons/scissors";
    export { Search } from "icons/search";
    export { Send } from "icons/send";
    export { Server } from "icons/server";
    export { Settings } from "icons/settings";
    export { Share2 } from "icons/share-2";
    export { Share } from "icons/share";
    export { ShieldOff } from "icons/shield-off";
    export { Shield } from "icons/shield";
    export { ShoppingBag } from "icons/shopping-bag";
    export { ShoppingCart } from "icons/shopping-cart";
    export { Shuffle } from "icons/shuffle";
    export { Sidebar } from "icons/sidebar";
    export { SkipBack } from "icons/skip-back";
    export { SkipForward } from "icons/skip-forward";
    export { Slack } from "icons/slack";
    export { Slash } from "icons/slash";
    export { Sliders } from "icons/sliders";
    export { Smartphone } from "icons/smartphone";
    export { Smile } from "icons/smile";
    export { Speaker } from "icons/speaker";
    export { Square } from "icons/square";
    export { Star } from "icons/star";
    export { StopCircle } from "icons/stop-circle";
    export { Sun } from "icons/sun";
    export { Sunrise } from "icons/sunrise";
    export { Sunset } from "icons/sunset";
    export { Tablet } from "icons/tablet";
    export { Tag } from "icons/tag";
    export { Target } from "icons/target";
    export { Terminal } from "icons/terminal";
    export { Thermometer } from "icons/thermometer";
    export { ThumbsDown } from "icons/thumbs-down";
    export { ThumbsUp } from "icons/thumbs-up";
    export { ToggleLeft } from "icons/toggle-left";
    export { ToggleRight } from "icons/toggle-right";
    export { Tool } from "icons/tool";
    export { Trash2 } from "icons/trash-2";
    export { Trash } from "icons/trash";
    export { Trello } from "icons/trello";
    export { TrendingDown } from "icons/trending-down";
    export { TrendingUp } from "icons/trending-up";
    export { Triangle } from "icons/triangle";
    export { Truck } from "icons/truck";
    export { Tv } from "icons/tv";
    export { Twitch } from "icons/twitch";
    export { Twitter } from "icons/twitter";
    export { Type } from "icons/type";
    export { Umbrella } from "icons/umbrella";
    export { Underline } from "icons/underline";
    export { Unlock } from "icons/unlock";
    export { UploadCloud } from "icons/upload-cloud";
    export { Upload } from "icons/upload";
    export { UserCheck } from "icons/user-check";
    export { UserMinus } from "icons/user-minus";
    export { UserPlus } from "icons/user-plus";
    export { UserX } from "icons/user-x";
    export { User } from "icons/user";
    export { Users } from "icons/users";
    export { VideoOff } from "icons/video-off";
    export { Video } from "icons/video";
    export { Voicemail } from "icons/voicemail";
    export { Volume1 } from "icons/volume-1";
    export { Volume2 } from "icons/volume-2";
    export { VolumeX } from "icons/volume-x";
    export { Volume } from "icons/volume";
    export { Watch } from "icons/watch";
    export { WifiOff } from "icons/wifi-off";
    export { Wifi } from "icons/wifi";
    export { Wind } from "icons/wind";
    export { XCircle } from "icons/x-circle";
    export { XOctagon } from "icons/x-octagon";
    export { XSquare } from "icons/x-square";
    export { X } from "icons/x";
    export { Youtube } from "icons/youtube";
    export { ZapOff } from "icons/zap-off";
    export { Zap } from "icons/zap";
    export { ZoomIn } from "icons/zoom-in";
    export { ZoomOut } from "icons/zoom-out";
}
