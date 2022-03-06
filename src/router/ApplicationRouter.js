import React, { Suspense, useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from '../components/ui/loading/Loading';
import { AuthContext } from '../context/auth-context';

const Landing = React.lazy(() => import('../pages/landing/Landing'));
const SignUp = React.lazy(() => import('../pages/signup/SignUp'));
const Login = React.lazy(() => import('../pages/login/Login'));
const Home = React.lazy(() => import('../pages/home/Home'));
const Search = React.lazy(() => import('../pages/search/Search'));
const Library = React.lazy(() => import('../pages/library/Library'));
const Playlist = React.lazy(() => import('../pages/playlist/Playlist'));
const Artist = React.lazy(() => import('../pages/artist/Artist'));
const Album = React.lazy(() => import('../pages/album/Album'));

const AuthenticatedRoute = (props) => {
    return (
        <Route path={props.path} render={() => props.state ? <props.component key={window.location.pathname} /> : <Redirect to="/" />} exact={props.exact} />
    )
}

const ApplicationRouter = React.memo(() => {
    const { token } = useContext(AuthContext);

    return (
        <Switch>
            <Suspense fallback={token ? <div className="bg-292929" /> : <Loading />}>
                <AuthenticatedRoute path="/" exact component={token ? Home : Landing} state={true} />

                {/* Token !== null */}
                <AuthenticatedRoute path="/search" component={Search} state={token} />
                <AuthenticatedRoute path="/library" component={Library} state={token} />
                <AuthenticatedRoute path="/playlist/:id" component={Playlist} state={token} />
                <AuthenticatedRoute path="/artist/:id" component={Artist} state={token} />
                <AuthenticatedRoute path="/album/:id" component={Album} state={token} />

                {/* Token === null */}
                <AuthenticatedRoute path="/signup" component={SignUp} state={!token} />
                <AuthenticatedRoute path="/login" component={Login} state={!token} />
            </Suspense>
        </Switch>
    )
});

export default ApplicationRouter;