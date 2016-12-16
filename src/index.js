import { DiContainer } from "bubble-di";

export default function reduxBubbleDi(bubbleDiContainer = DiContainer.getContainer()) {
    if (bubbleDiContainer === undefined) {
        throw new Error("The given bubbleDiContainer is not defined and DiContainer.getContainer() is not defined either. Please call i.e. DiContainer.setContainer(new DiContainer()) before invoking reduxBubbleDi() or explicitely provide a DiContainer instance by callinf i.e. reduxBubbleDi(new DiContainer()).");
    }
    return (store) => {
        if (!bubbleDiContainer.containsDependency("dispatch")) {
            bubbleDiContainer.register("dispatch", { factoryMethod: () => store.dispatch });
        }
        return next => (action) => {
            if (!isActionBubble(action)) {
                return next(action);
            }
            const bubbledFunction = action.bubble;
            if (typeof bubbledFunction !== "function") {
                throw new Error("the given bubble property is not a function");
            }
            const resolvedArgs = resolveArgs(action, bubbleDiContainer);
            return bubbledFunction(...resolvedArgs);
        };
    };
}

function resolveArgs(action, bubbleDiContainer) {
    let dependencies = action.dependencies;
    if (dependencies === undefined) {
        dependencies = [];
    }
    const resolvedArgs = bubbleDiContainer.resolveMany(["dispatch", ...dependencies]);
    return resolvedArgs;
}

function isActionBubble(action) {
    return action.bubble !== undefined;
}
