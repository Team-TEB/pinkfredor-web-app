import { Route } from "react-router-dom";
import * as App from "./App";
function MainApp() {
    return (
        <div>
            <Route path="/app" exact component={App.App} />
            <Route path="/app/user" component={App.UserAccount} />
            <Route path="/app/test" component={App.TestPage} />
            <Route path="/app/linkdrive" component={App.LinkGDrive} />
        </div>
    );
}

export default MainApp;
