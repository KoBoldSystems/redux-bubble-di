// eslint disable no-unused-vars
import { expect } from "chai";
import { DiContainer } from "bubble-di";
import { createStore, applyMiddleware } from "redux";
import reduxBubbleDi from "../src/index";

class FakesStore {
    dispatch(action) {
        return action;
    }
    getState() { return {}; }
}

const fakeStore = new FakesStore();

function nextDummy(action) { return action; }

class MyDependency { }

describe("BubbleDiMiddleWare", () => {
    let diContainer;
    let middleWare;

    beforeEach(() => {
        diContainer = new DiContainer();
        middleWare = reduxBubbleDi(diContainer);
    });

    it("it should inject dependencies into actions that are bubble-actions", () => {
        diContainer.register("MyDependency", { dependencies: [], factoryMethod: () => new MyDependency() });
        let injectionMethodCalled = false;
        const testBubble = {
            bubble: (dispatch, myDependency) => {
                injectionMethodCalled = true;
                expect(dispatch).to.not.be.undefined;
                expect(myDependency).to.not.be.undefined;
            },
            dependencies: ["myDependency"],
        };
        middleWare(fakeStore)(nextDummy)(testBubble);
        expect(injectionMethodCalled).to.be.true;
    });

    it("it should pass actions to next() that are functions or plain actions", () => {
        let nextCalled = false;
        let nextAction = () => { };
        const nextMiddleWare = () => { nextCalled = true; };

        middleWare(fakeStore)(nextMiddleWare)(nextAction);
        expect(nextCalled).to.be.true;

        nextCalled = false;
        nextAction = { type: "bla", payload: {} };
        middleWare(fakeStore)(nextMiddleWare)(nextAction);
        expect(nextCalled).to.be.true;

        nextCalled = false;
        nextAction = { bubble: () => { } };
        middleWare(fakeStore)(nextMiddleWare)(nextAction);
        expect(nextCalled).to.be.false;
    });

    it("it should work with redux-store", () => {
        let nextCalled = false;
        const nextMiddleWare = () => () => () => { nextCalled = true; };
        const bubbleAction = { bubble: () => { } };

        const newStore = createStoreForTest(nextMiddleWare, diContainer);

        newStore.dispatch(bubbleAction);
        expect(nextCalled).to.be.false;

        newStore.dispatch({ type: "foo" });
        expect(nextCalled).to.be.true;
    });
});

function createStoreForTest(additionalMiddleWare, diContainer) {
    const middleWares = [reduxBubbleDi(diContainer)];
    if (additionalMiddleWare !== undefined) {
        middleWares.push(additionalMiddleWare);
    }
    const reduxStore = createStore(
        state => state,
        undefined,
        applyMiddleware(...middleWares),
    );
    return reduxStore;
}
