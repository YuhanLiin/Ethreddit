import web3 from './web3';
import * as contractData from './contracts/Forum.json';

const address = '0x28e508bb059ebd2529d8844b5ce0b7b9493875fa';

const abi = contractData.abi;

export default new web3.eth.Contract(abi, address);

