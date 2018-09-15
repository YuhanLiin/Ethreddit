import React, { Component } from 'react';
import web3 from './web3';
import forum from './forum';

class App extends Component {
    render() {
        return <div>LOL <Posts/> </div>;
    }
}

class Posts extends Component {
    list = [];

    async componentDidMount() {
        const count = await forum.methods.getPostCount().call();
        for (let i = count - 1; i >= 0; i--) {
            let post = await forum.methods.getPost().call();
            this.list.push({id: post[0], userid: post[1], votes: post[2], content: post[3]});
        }
    }

    render() {
        return this.list.map((post) => <div>post.stringify()</div>);
    }
}

export default App;
