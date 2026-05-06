import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Feed from "./pages/feed";
import PostPage from "./pages/post";
import Chat from "./pages/chat";
import Pricing from "./pages/pricing";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/feed" component={Feed} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/chat" component={Chat} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </Switch>
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
