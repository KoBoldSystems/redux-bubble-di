redux-bubble-di

A Dependecy-Injecting Middleware for redux using bubble-di.

**Installation**

```
npm install --save redux-bubble-di
```

**What is redux-bubble-di?**
redux-bubble-di library is a [redux-compatible middleware](http://redux.js.org/docs/advanced/Middleware.html) similar to [redux-thunk](https://github.com/gaearon/redux-thunk).
redux-bubble-di supports the execution of (asynch) actions containing a function (bubble-function) with the ability to inject an arbitrary number of dependencies into the bubble-function actions.

**Why do I need this?**
A dependency injection container centralises the instantiation of dependencies and (more importantly) avoids instantiations of dependencies being scattered accross the code making it hard to change, manage and test. Redux-bubble-di enables writing actionCreators that express their dependencies and utilise them without having to worry about their instantiation. 

**How does it work?**

##### Simple example
```js

//import { DiContainer } from "bubble-di";
const { DiContainer } = require("bubble-di");
//import { createStore, applyMiddleware } from "redux";
const { createStore, applyMiddleware } = require("redux");
//import reduxBubbleDi from "redux-bubble-di";
const reduxBubbleDi = require("redux-bubble-di").default;

class MyServiceDependency { backendCall() { console.log("calling backend..."); } } // eslint-disable-line

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
        dispatch({ type: "someReduxAction" });
    },
    dependencies: ["MyServiceDependency"],
};

store.dispatch(bubbleAction);

```
## License

MIT
