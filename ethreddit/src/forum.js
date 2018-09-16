import Web3 from 'web3'
import * as contractData from './contracts/Forum.json';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const address = '0x8c3e1af2b08df151163f4b3bcc2cbf78d97dd850';

const account = '0xf00c23192979e22c760def3fb9ccb463556e2e35';

const abi = contractData.abi;

const forum = new web3.eth.Contract(abi, address, {gas: 10000000});
export {forum, address, account}
