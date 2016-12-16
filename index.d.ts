// Type definitions for redux-bubble-di
// Project: redux-bubble-di
// Definitions by: Kobold Group http://kobold.com.au
import { Middleware, Dispatch } from "redux";
import { DiContainer } from "bubble-di";

export type BubbleAction<S> = {
    bubble: (dispatch: Dispatch<S>, ...injectedDependencies: any[]) => any,
    dependencies?: string[]
};

declare module "redux" {
    export interface Dispatch<S> {
        (bubbleAction: BubbleAction<S>);
    }
}

declare const reduxBubbleDi: (diContainer?: DiContainer) => Middleware;

export default reduxBubbleDi;
