import React, { Component } from 'react';
import { Row, Col, Grid, Button  } from 'react-bootstrap';
import { Offset } from './utils.js';
import {address, account, forum} from './forum.js'

class Posts extends Component {
    props = {
        switchScreen: null
    }

    state = {
        list: []
    }

    async load() {
        var list = [];
        const count = await forum.methods.getPostCount().call();
        for (let i = count - 1; i >= 0; i--) {
            let post = await forum.methods.getPost(i).call();
            list.push(this.arrToPost(post));
        }
        this.setState({list: list});
    }

    arrToPost(post) {
        return {id: post[0], userid: post[1], votes: post[2], content: post[3]};
    }

    async componentDidMount() {
        await this.load();
    }

    handleSubmit = async (e, input) => {
        e.preventDefault();
        await forum.methods.post(input).send({from: account});
        await this.load();
    }

    changePost = async (id) => {
        var arr = this.state.list.slice(0);
        var post = await forum.methods.getPost(id).call();
        arr[this.state.list.length - 1 - id] = this.arrToPost(post);
        this.setState({list: arr});
    }

    render() {
        return (
            <div>
            <Postbox onSubmit={this.handleSubmit}/>
            <Offset size={20}/>
            { this.state.list.map((post, i) => 
                <div>
                <Post key={i} switchScreen={this.props.switchScreen} changePost={this.changePost} post={post}/>
                <Offset size={20}/>
                </div>) }
            </div>
        );
    }
}

class Postbox extends Component {
    props = {
        onSubmit: null        
    }

    state = { input: '' }

    handleChange = (e) => {
        this.setState({input: e.target.value});
    }

    onSubmit = (e) => {
        this.setState({input: ''});
        this.props.onSubmit(e, this.state.input)
    }

    render() {
        return <Row bsClass="pull-left">
            <form onSubmit={this.onSubmit}>
            <h2>Make your post!</h2>
            <textarea name="textarea" value={this.state.input} style={{ height: 200, width:700 }} onChange={this.handleChange}></textarea>
            <div><Button type='submit'>Submit</Button></div>
        </form>
        </Row>
    }
}

class Post extends Component {
    props = {
        changePost: null,
        post: {},
        switchScreen: null
    }

    changePost = () => {
        this.props.changePost(this.props.post.id);
    }

    onClick = () => {
        this.props.switchScreen({post: this.props.post});
    }

    render() {
        return <Row className="post" style={{ 'background-color': 'white' }} onClick={this.onClick}>
            <Col md={1} >
                <Arrows 
                postid={this.props.post.id} 
                votes={this.props.post.votes} 
                changePost={this.changePost}/>
            </Col>
            <Col md={11}>
                <Offset size={2}/>
                <h6><i>By: {this.props.post.userid}</i></h6>
            </Col>
            <Col md={1}/>
            <Col md={11}>
                <p>{this.props.post.content}</p>
            </Col>
        </Row>
    }
}

var VoteState = {none: '0', up: '1', down: '2'}

class Arrows extends Component {
    props = {
        postid: -1,
        votes: 0,
        changePost: null
    }

    state = {
        voteState: 0
    }

    updateVoteState = async () => {
        this.setState({voteState: await forum.methods.getPostVotes(this.props.postid).call({from: account})});
    }

    componentWillMount = async () => await this.updateVoteState();

    upvote = async (e) => {
        e.stopPropagation();
        if (this.state.voteState === VoteState.up) {
            await forum.methods.unUpvote(this.props.postid).send({from: account});
        } else {
            await forum.methods.upvote(this.props.postid).send({from: account});
        }
        await this.updateVoteState();
        this.props.changePost();
    }

    downvote = async (e) => {
        e.stopPropagation();
        if (this.state.voteState === VoteState.down) {
            await forum.methods.unDownvote(this.props.postid).send({from: account});
        } else {
            await forum.methods.downvote(this.props.postid).send({from: account});
        }
        await this.updateVoteState();
        this.props.changePost();
    }

    render() {
        var upcolor = (this.state.voteState === VoteState.up) ? "success" : "secondary";
        var downcolor = (this.state.voteState === VoteState.down) ? "danger" : "secondary";
        return (
            <div class='text-center'>
            <Button bsStyle={upcolor} bsSize="xsmall" onClick={this.upvote}/>
            <div>{this.props.votes}</div>
            <Button bsStyle={downcolor} bsSize="xsmall" onClick={this.downvote}/>
            </div>
        );
    }
}

export {Posts};
