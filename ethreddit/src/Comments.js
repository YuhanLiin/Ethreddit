import React, { Component } from 'react';
import { Row, Col, Grid, Button  } from 'react-bootstrap';
import { Offset } from './utils.js';
import {address, account, forum} from './forum.js'

class Comments extends Component {
    props = {
        post: {},
        switchScreen: null
    }

    render() {
        return <Row style={{ 'background-color': 'white' }}>
            <h4>post.userid</h4>
            <p>post.content</p>
        </Row>
    }
}

export { Comments };
