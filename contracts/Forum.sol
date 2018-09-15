pragma solidity ^0.4.24;

contract Forum {
    struct Post {
        uint id;
        address userid;
        int votes;
        string content;
        Comment[] comments;
    }

    struct Comment {
        uint id;
        address userid;
        string content;
    }

    enum VoteStatus {NONE, UP, DOWN}

    struct User {
        address addr;
        mapping(uint => VoteStatus) postVotes;
    }

    mapping(address => User) private users;
    uint private userCount;
    Post[] private posts;

    constructor() public {

    }

    modifier userExists() {
        require(users[msg.sender].addr != 0); _;
    }

    modifier userNotExist() {
        require(users[msg.sender].addr == 0); _;
    }

    modifier postExists(uint postid) {
        require(posts.length > postid); _;
    }

    modifier commentExists(uint postid, uint cmtid) {
        require(posts[postid].comments.length > cmtid); _;
    }

    modifier notUpvoted(uint postid) {
        require(users[msg.sender].postVotes[postid] != VoteStatus.UP); _;
    }

    modifier isUpvoted(uint postid) {
        require(users[msg.sender].postVotes[postid] == VoteStatus.UP); _;
    }

    modifier notDownvoted(uint postid) {
        require(users[msg.sender].postVotes[postid] != VoteStatus.DOWN); _;
    }

    modifier isDownvoted(uint postid) {
        require(users[msg.sender].postVotes[postid] == VoteStatus.DOWN); _;
    }

    function register() userNotExist public {
        address addr = msg.sender;
        users[addr] = User({addr: addr});
        userCount++;
    }

    function voteDiff(uint postid) internal view returns(int) {
        if (users[msg.sender].postVotes[postid] == VoteStatus.NONE) {
            return 1;
        } else {
            return 2;
        }
    }

    function upvote(uint postid) userExists postExists(postid) notUpvoted(postid) public {
        posts[postid].votes += voteDiff(postid);
        users[msg.sender].postVotes[postid] = VoteStatus.UP;
    }

    function unUpvote(uint postid) userExists postExists(postid) isUpvoted(postid) public {
        posts[postid].votes--;
        users[msg.sender].postVotes[postid] = VoteStatus.NONE;
    }

    function downvote(uint postid) userExists postExists(postid) notDownvoted(postid) public {
        posts[postid].votes -= voteDiff(postid);
        users[msg.sender].postVotes[postid] = VoteStatus.DOWN;
    }

    function unDownvote(uint postid) userExists postExists(postid) isDownvoted(postid) public {
        posts[postid].votes++;
        users[msg.sender].postVotes[postid] = VoteStatus.NONE;
    }

    function post(string content) userExists public {
        posts.length++;
        Post storage newPost = posts[posts.length - 1];
        newPost.userid = msg.sender;
        newPost.content = content;
        newPost.id = posts.length - 1;
        upvote(posts.length - 1);
    }

    function comment(uint postid, string content) userExists postExists(postid) public {
        Comment[] storage comments = posts[postid].comments;
        comments.push(Comment({id: comments.length, userid: msg.sender, content: content}));
    }

    function getPostCount() public view returns(uint) {
        return posts.length;
    }

    function getPost(uint i) postExists(i) public view returns(uint, address, int, string) {
        Post storage p = posts[i];
        return (p.id, p.userid, p.votes, p.content);
    }

    function getCommentCount(uint postid) postExists(postid) public view returns(uint) {
        return posts[postid].comments.length;
    }

    function getComments(uint postid, uint cmtid) postExists(postid) commentExists(postid, cmtid)
    public view returns(uint, address, string) {
        Comment storage cmt = posts[postid].comments[cmtid];
        return (cmt.id, cmt.userid, cmt.content);
    }
}
