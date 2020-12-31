import React, { Component } from 'react';
import { GAME_WON, GAME_STARTED, GAME_OVER } from './game-states';
import Game from './Game';
import { 
    Button, Dimmer, Header, Icon, Tab, Popup, Segment, Input, Message, Divider
} from 'semantic-ui-react';

import { TextHint, SoundHint } from './Hints';
import '../css/Puzzle.css';
import hmdata from '../hmdata.json';

const getObjective = (data) => {
    for (let d of data) {
        if (d.que === "password") {
            return {
                ans: d.ans,
                res: d.res,
                path: d.path
            }
        }
    }
    return null;
}

const initGameState = (data) => data.filter((d) => d.que !== "password").map(
    ({ qid, que, ans, hint_1, hint_2, hint_3, res }) => ({
        id: qid,
        word: ans,
        letters: ans.split('').map(letter => ({
            value: letter,
            guessed: letter === '_',
        })),
        guesses: 5,
        gameState: GAME_STARTED,
        pastGuesses: [],
        clue: false, // show hint_3
        que, hint_1, hint_2, hint_3, res
}));

class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.objective = getObjective(hmdata);
        this.state = {
            modalActive: false,
            clueCount: 3,
            activeTab: 0,
            game: initGameState(hmdata),
            correct: true,
            showMessage: false,
            password: ""
        };
        this.onClue = this.onClue.bind(this); // display hint_3 based on cur tab
        this.onDone = this.onDone.bind(this); // input password to attempt opening 9th tab
        this.onTabChange = this.onTabChange.bind(this);
        this.onLetter = this.onLetter.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    onClue(e) {
        e.preventDefault();
        if (this.state.clueCount > 0) {
            const curIdx = this.state.activeTab;
            const clued = {
                ...this.state.game[curIdx],
                clue: true
            };
            this.setState({
                clueCount: this.state.clueCount - 1,
                game: [...this.state.game.slice(0, curIdx), clued, ...this.state.game.slice(curIdx + 1)]
            });
        }
    }

    onDone(e) {
        e.preventDefault();
        this.setState({
            modalActive: true,
            correct: this.state.password === this.objective.ans
        });
    }

    onTabChange(_, data) {
        this.setState({
            activeTab: data.activeIndex
        });
    }

    onLetter(letter, e) {
        e.preventDefault();
        const curIdx = this.state.activeTab;
        const firstIndex = this.state.game[curIdx].word.indexOf(letter)
        if (firstIndex !== -1) {
            const letters = this.state.game[curIdx].letters.map(letterObject => {
                if (letterObject.value === letter) {
                    return Object.assign({}, letterObject, {
                        guessed: true,
                    });
                }
        
                return letterObject;
            });
    
            // Check if the game has been won
            const gameWon = letters.reduce((winState, currentObject) => {
                return winState && currentObject.guessed;
            }, true);
        
            this.setState((prevState) => {
                return {
                    ...prevState,
                    game: [...prevState.game.slice(0, curIdx), {
                        ...prevState.game[curIdx],
                        letters,
                        pastGuesses: [letter].concat(prevState.game[curIdx].pastGuesses),
                        gameState: gameWon ? GAME_WON : GAME_STARTED
                    }, ...prevState.game.slice(curIdx+1)]
                };
            });
        } else {
            this.setState((prevState) => {
                // Update number of attempts left
                const guessesLeft = prevState.game[curIdx].guesses - 1;
                let stateUpdate = {
                    guesses: guessesLeft,
                };
    
                // Kill the game if needed
                if (guessesLeft === 0) {
                    stateUpdate.gameState = GAME_OVER;
                }
    
                // Update the letters already tried
                stateUpdate.pastGuesses = [letter].concat(prevState.game[curIdx].pastGuesses);
        
                return {
                    ...prevState,
                    game: [...prevState.game.slice(0, curIdx), {
                        ...prevState.game[curIdx],
                        ...stateUpdate
                    }, ...prevState.game.slice(curIdx+1)]
                };
            });
        }
    }

    // When tab is game-over-ed, move to next tab or last tab if all are game-over-ed
    onContinue(e) {
        e.preventDefault();
        const options = this.state.game.filter(({ gameState }) => gameState === GAME_STARTED);
        this.setState({
            activeTab: options.length > 0 ? (options[0].id - 1) : 8
        });
    }

    onShowMessage = () => {
        this.setState({ 
            modalActive: false,
            showMessage: true,
            activeTab: 8
        });
    }

    onRetry = () => {
        this.setState({
            modalActive: false,
            clueCount: this.state.clueCount || 0,
            activeTab: 0,
            game: initGameState(hmdata),
            correct: true,
            showMessage: false,
            password: ""
        });
    }

    render() {
        let gamePanes = this.state.game.map((g) => ({
            menuItem: '#' + g.id,
            render: () => {
                const gameProps = {
                    onLetter: this.onLetter,
                    onContinue: this.onContinue,
                    ...g
                }; 
                return <Tab.Pane>
                    <div className="game-tab">
                        <Game {...gameProps} />
                    </div>
                </Tab.Pane>;
            }
        }));

        let panes = [...gamePanes, {
            menuItem: "ゴール",
            render: () => {
                const atLeastThree = this.state.game.filter(({ gameState }) => gameState === GAME_WON).length >= 3;
                return this.state.showMessage
                    ? <SoundHint hint={this.objective.res} path={this.objective.path} />
                    : <div>
                        <TextHint hint="8ハングマンのパズルを解いてまとめたパスワードを入力してください" />
                        <Input focus placeholder='パスワード...' value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })}/>
                        <Button primary id="unlock" positive disabled={!atLeastThree}
                            onClick={ this.onDone }>アンロック</Button>
                    </div>;
            }
        }];

        return <Dimmer.Dimmable as={ Segment } dimmed={ this.state.modalActive }>           
            <div id="rule">
                <Message info>
                    <Message.Header>このパズルを解く方法</Message.Header>
                    <p>最終的な目標は、"ゴール"タブのロックを解除するためのパスワードを見つけることです。</p>
                    <p><b>パスワードは8文字</b>の単語なので、各文字を取得するには、8つのハングマンを解く必要があります。</p>
                    <p>ハングマンを解くときに<b>話題</b>と<b>ヒント</b>に注意してください。</p>
                    <p>3つのハングマンを解いた後にロックを解除しようとすることができますが、間違ったパスワードを入力するとゲームがリセットされてしまい、最初からプレイしなければならなくなるので、確実な時にパスワードを入力した方が良いでしょう。</p>
                    <br/>
                    <p>ハングマンをプレイして、一定数のミスをした場合に小ヒントが表示されます。</p>
                    <p>また、すぐに簡単に単語を推測するのに役立ちます大きなヒントを表示するには、下の<b>[大ヒント]</b>ボタンをクリックすることができます。</p>
                    <p>全体的に少しやりがいのあるパズルにしたいので、[大ヒント]ボタンは<b>3回</b>までしか使えません。</p>
                    <p>ゲームがリセットされても[大ヒント]の数はリセットされないので注意してください。</p>
                    <br/>
                    <p>時にはすぐに文字が出てこない時がありますが、その代わりにその文字に関する簡単なクイズがあります。</p>
                    <p>また、ハングマンの文字はパスワードの文字と<b>同じ順序</b>です。</p>
                    <p>例えば、ハングマン#1を解いた後にクイズ「英字の終決」が出て、パスワードは'z'で始まることを知っています。</p>
                    <p>例えば、ハングマン#8を解いた後にクイズ「ｒの後に何文字」が出て、パスワードは's'で終わることを知っています。パスワードは8文字なので、「zambians」かな。。。</p>
                    <p>ちなみに、全ての単語は<b>英字</b>で書かれているので、ラーメンはramenになります。</p>
                    <br/>
                    <p>それでもわからないことがあれば、これを作ったやつにLineで文句を言ってください!</p>
                </Message>
            </div>

            <div id="button-container">
                <Popup 
                    trigger={ <Button primary id="clue"
                        onClick={ this.onClue } 
                        disabled={ ((this.state.clueCount === 0) 
                            || this.state.activeTab > 7 
                            || (this.state.activeTab < 8 && this.state.game[this.state.activeTab].clue)
                            || (this.state.activeTab < 8 && this.state.game[this.state.activeTab].gameState === GAME_WON)) ? true : false }>大ヒント</Button> }
                    content={`単語を推測しめちゃやすくするヒントを表示する`} />
                <span style={{marginLeft: 15}}>残りの大ヒント使用回数: {this.state.clueCount}</span>
            </div>

            <Divider hidden/>
            <div id="hints-container">
                <Header as='h2'>
                    <Icon name='compass outline' />
                    <Header.Content> パズルs</Header.Content>
                </Header>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes}
                    onTabChange={ this.onTabChange }
                    activeIndex={ this.state.activeTab }
                />
            </div>

            <Dimmer active={ this.state.modalActive }>
                <Header as='h2' icon inverted>
                    <Icon name={ this.state.correct ? 'fast forward' : 'undo' } />
                    { this.state.correct
                        ? "おめでとう、正解です!"
                        : "パスワードが間違っています:( もう一度やり直してください" }
                    <br />
                    <br />
                    <Button inverted color='olive' 
                        onClick={ this.state.correct
                            ? this.onShowMessage 
                            : this.onRetry }>
                        { this.state.correct ? "やった!" : "やり直す" }
                    </Button>
                </Header>
            </Dimmer>
        </Dimmer.Dimmable>
    }
}

export default Puzzle;
