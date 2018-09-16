import web3 from './web3';
import * as contractData from './contracts/Forum.json';

const address = '0xa180308b2252cfbfa9a10016678470111058207b';

const abi = contractData.abi;

export default new web3.eth.Contract(abi, address);

