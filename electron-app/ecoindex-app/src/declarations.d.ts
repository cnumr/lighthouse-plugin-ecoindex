declare module '*.svg' {
    const content: string
    export default content
}
declare module 'src/shared/tailwind-helper' {
    export function cn(...classes: string[]): string
}
// declare module '*.css';
// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
