import React, { Component } from 'react';
import Web3 from 'web3'
import * as contractData from './contracts/Forum.json';
import { FormGroup, FormControl, ControlLabel, Button  } from 'react-bootstrap';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const address = '0x028a8b5dcb2ab89ef14cf594a7f8401af68ab26d';

const account = '0xe994010444c5f37dccf67ec5a2e47c2e75068403';

const abi = contractData.abi;

const forum = new web3.eth.Contract(abi, address);

class App extends Component {
    render() {
        return <div> <Posts/> </div>;
    }
}

class Posts extends Component {
    textInput = '';

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

    handleSubmit = async (e) => {
        e.preventDefault();
        var txt = this.textInput.value
        await forum.methods.post(txt).send({from: account});
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
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="postText">
                    <ControlLabel>Make your post!</ControlLabel>
                    <FormControl componentClass='textarea' inputRef={input => this.textInput = input} placeholder='Enter text here.'/>
                    <div><Button type='submit'>Submit</Button> </div>
                </FormGroup>
            </form>
            { this.state.list.map((post, i) => <Post key={i} changePost={this.changePost} post={post}/> ) }
            </div>
        );
    }
}

class Post extends Component {
    props = {
        changePost: null,
        post: {}
    }

    changePost = () => {
        this.props.changePost(this.props.post.id);
    }

    render() {
        return (
            <div>
                <Arrows postid={this.props.post.id} votes={this.props.post.votes} changePost={this.changePost}/>
                <div>{this.props.post.userid}</div>
                <div>{this.props.post.content}</div>
            </div>
        )
    }
}

class Arrows extends Component {
    props = {
        postid: -1,
        votes: 0,
        changePost: null
    }

    upvote = async () => {
        await forum.methods.upvote(this.props.postid).send({from: account});
        this.props.changePost();
    }

    downvote = async () => {
        await forum.methods.downvote(this.props.postid).send({from: account});
        this.props.changePost();
    }

    render() {
        return (
            <div>
            <Button bsStyle="success" bsSize="xsmall" onClick={this.upvote}/>
            <div>{this.props.votes}</div>
            <Button bsStyle="danger" bsSize="xsmall" onClick={this.downvote}/>
            </div>
        );
    }
}
export default App;
