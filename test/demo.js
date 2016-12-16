import { DiContainer } from "bubble-di";
import { createStore, applyMiddleware } from "redux";
import reduxBubbleDi from "../src/index";

class MyServiceDependency {
    backendCall() {
        console.log("calling backend..."); // eslint-disable-line
    }
}

describe("Working Example", () => {
    it("injecting a dependency into a bubble action", () => {
        DiContainer.setContainer(new DiContainer());
        DiContainer.getContainer().registerInstance("MyServiceDependency", new MyServiceDependency());

        const store = createStore(
            state => state,
            undefined,
            applyMiddleware(reduxBubbleDi(DiContainer.getContainer())),
        );

        const bubbleAction = {
            bubble: (dispatch, myService) => {
                myService.backendCall();
                // ...
                dispatch({ type: "someReduxAction" });
                // ...
            },
            dependencies: ["MyServiceDependency"],
        };

        store.dispatch(bubbleAction);
    });
});
