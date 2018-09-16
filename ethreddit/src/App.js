import React, { Component } from 'react';
import { Row, Col, Grid, Button  } from 'react-bootstrap';
import { Offset } from './utils.js';

import {address, account, forum} from './forum.js'
import {Comments} from './Comments.js'
import {Posts} from './Posts.js'

class App extends Component {
    toComments = (props) => {
        props.switchScreen = this.toPosts;
        this.setState({screenProps: props, Screen: Comments});
    }

    toPosts = (props) => {
        props.switchScreen = this.toComments;
        this.setState({screenProps: props, Screen: Posts});
    }

    state = {
        Screen: Posts,
        screenProps: {}
    }

    componentWillMount = () => {
        this.toPosts({});
    }

    render() {
        return <Grid> <this.state.Screen {...this.state.screenProps}/> </Grid>;
    }
}

export default App;
