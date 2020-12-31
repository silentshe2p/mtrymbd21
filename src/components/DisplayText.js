import React, { Component } from 'react';
import { Container, Comment, Divider, Icon, Message, Segment, Image } from 'semantic-ui-react';

import mainAvatar from '../images/cvs/mat-avatar.jpg';
import oakAvatar from '../images/cvs/oak-avatar.jpg';

class DisplayText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            sectionIdx: 0,
            contentIdx: 0
        }
        this.text = props.toPlay;
        this.lastIdx = this.text.length - 1;
        this.transition = this.transition.bind(this);
        this.renderText = this.renderText.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this.transition);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.transition);
    }

    transition() {
        // At the last section -> transite to the next part
        if (this.state.sectionIdx >= this.lastIdx && 
            this.state.contentIdx >= this.text[this.state.sectionIdx].content.length - 1) {
            this.props.setNextPart(this.props.nextPart);
        }

        // At the end of current content -> move on to the next section
        else if (this.state.sectionIdx <= this.lastIdx && 
                this.state.contentIdx >= this.text[this.state.sectionIdx].content.length - 1) {
            this.setState({ 
                sectionIdx: this.state.sectionIdx + 1,
                contentIdx: 0
            });
        }

        // Continue along the current content
        else if (this.state.sectionIdx <= this.lastIdx && 
                this.state.contentIdx < this.text[this.state.sectionIdx].content.length - 1) {
            this.setState({
                contentIdx: this.state.contentIdx + 1
            });
        }
    }

    renderText(textObj) {
        switch(textObj.type) {
            case "nar": // Narration
                return <Container fluid>
                    <Divider hidden />
                    <Divider hidden />
                    <Message icon floating size='massive' color='green'>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            { textObj.content[this.state.contentIdx] }
                        </Message.Content>
                    </Message>
                </Container>;

            case "cvs": // Conversation
                let scene = textObj.content[this.state.contentIdx];
                let whom = Object.keys(scene)[0];
                let said = scene[whom];
                if (said.includes('#')) { // need to insert pokedex pic
                    const parts = said.split('#');
                    const pokedex = window.location.href + "images/pokedex/" + parts[1].slice(0, 4) + '.png';
                    const pokedex2 = parts.length > 2 
                        ? window.location.href + "images/pokedex/" + parts[2].slice(0, 4) + '.png'
                        : null;
                    said = <p>
                        <span>{ parts[0] }</span>
                        <Image size="small" src={ pokedex } />
                        <span>{ parts[1].slice(4) }</span>
                        { pokedex2 && <Image size="small" src={ pokedex2 } /> }
                        { pokedex2 && <span>{ parts[2].slice(4) }</span> }
                    </p>
                }
                return <Comment.Group size='massive'>
                    <Divider hidden />
                    <Comment>
                        <Comment.Avatar as='a' src={ oakAvatar } />
                        <Comment.Content>
                            <Comment.Author>オーキド博士</Comment.Author>
                            <Comment.Text>
                                <Segment color='red' size="big">
                                    { whom === "オーキド博士" ? said : "..." }
                                </Segment>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                    <Divider hidden />
                    <Divider hidden />
                    <Comment>
                        <Comment.Avatar as='a' src={ mainAvatar } />
                        <Comment.Content>
                            <Comment.Author>まつり</Comment.Author>
                            <Comment.Text>
                                <Segment color='teal' size="big">
                                    { whom === "まつり" ? said : "..." }
                                </Segment>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>

            default:
                return <div/>;
        }
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        return this.renderText(this.text[this.state.sectionIdx]);
    }
}

export default DisplayText;
