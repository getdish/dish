/// <reference types="react" />
import { StackProps } from '@tamagui/core';
export declare type BlurViewProps = StackProps & {
    blurAmount?: number;
    fallbackBackgroundColor?: string;
    blurType?: 'xlight' | 'light' | 'dark' | 'chromeMaterial' | 'material' | 'thickMaterial' | 'thinMaterial' | 'ultraThinMaterial' | 'chromeMaterialDark' | 'materialDark' | 'thickMaterialDark' | 'thinMaterialDark' | 'ultraThinMaterialDark' | 'chromeMaterialLight' | 'materialLight' | 'thickMaterialLight' | 'thinMaterialLight' | 'ultraThinMaterialLight' | 'regular' | 'prominent' | 'extraDark';
    downsampleFactor?: number;
};
export declare function BlurView({ children, borderRadius, fallbackBackgroundColor, blurType, blurAmount, downsampleFactor, ...props }: BlurViewProps): JSX.Element;
