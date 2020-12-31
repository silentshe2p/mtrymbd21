import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Puzzle from './Puzzle';
import DisplayText from './DisplayText';
import intro from '../intro.json';
import avatar from '../images/act-avatar.jpg';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: "intro"
            // showing: "puzzle"
        };
        this.setNextPart = this.setNextPart.bind(this);
    }

    setNextPart(part) {
        this.setState({ showing: part })
    }

    render() {
        return <div>
            <Menu stackable>
                <Menu.Item>
                    <img src={ avatar } alt="pokemon"/>                    
                </Menu.Item>
                <Menu.Item>
                    <Icon name='caret right' />
                    { this.state.showing.toUpperCase() }
                    <Icon name='caret left' />
                </Menu.Item>
                <Menu.Item name="logout" onClick={ this.props.handleLogout }>
                    Logout
                </Menu.Item>
            </Menu>
            { (this.state.showing === "intro") && 
                <DisplayText nextPart="puzzle" 
                    setNextPart={ this.setNextPart } 
                    toPlay={intro} /> }
            { (this.state.showing === "puzzle") && <Puzzle /> }
        </div>;
    }
}

export default Content;
