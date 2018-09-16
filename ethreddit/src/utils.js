import React, { Component } from 'react';
import { Row, Col, Grid, Button  } from 'react-bootstrap';

class Offset extends Component {
    props = { size: 0 }

    render() {
        var style = {'margin-top': this.props.size}
        return <div style={style}></div>
    }
}

export {Offset }
