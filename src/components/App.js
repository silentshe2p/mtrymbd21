import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import store from 'store';

import Login from './Login';
import Content from './Content';

import '../css/App.css';

const PrivateRoute = ({ component: Component, loggedIn, handleLogout, ...rest }) => (
    <Route { ...rest } render={ props => (
        (loggedIn) 
            ? <Component handleLogout={ handleLogout } { ...props } />
            : <Redirect to={{
                pathname: '/login',
                state: { from: { pathname: '/' } }
            }} />
    )} />
)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: store.get('loggedIn')
        }
        this.logout = this.logout.bind(this);
        this.setLogin = this.setLogin.bind(this);
    }

    setLogin() {
        store.set('loggedIn', true);
        this.setState({ loggedIn: true });
    }

    logout() {
        store.remove('loggedIn');
        this.setState({ loggedIn: false });
    }

    render() {
        return <Router>
            <div>
                <Route path='/login' render={ props => 
                    <Login {...props} handleSetLogin={ this.setLogin } /> } />
                <PrivateRoute exact path='/' component={Content}
                    loggedIn={this.state.loggedIn}
                    handleLogout={ this.logout } />
            </div>
        </Router>;
    }
}

export default App;
