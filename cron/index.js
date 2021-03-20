const cron = require('node-cron');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "caarim",
  password: "YXX@yf)O.c4xex8b",
  database: "caarim"
});

con.connect(function(err) {
		  if (err) throw err;
});

cron.schedule('3 5 * * *', function() {
  console.log('Running task every second');
  sendToken();
});



async function sendToken() {


	con.query("SELECT * FROM staking_earns WHERE status=1", function (err, result, fields) {
		if (err) throw err;
		console.log(result);


		result.forEach(function(row) {
			// console.log(row.address);

			if (row.last_staking == null) {
				var n = new Date; 
				var x = new Date(row.created_at);
			}else{
				var n = new Date; 
				var x = new Date(row.last_staking);
			}

				var diffTime = Math.abs(x - n);
				var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

				// console.log(Date.now())

				console.log(diffDays);

				var dd = n.getDate();

				var mm = n.getMonth()+1; 
				var yyyy = n.getFullYear();
				var today =  yyyy+'-'+mm+'-'+dd;


				if (diffDays > 10) {
					console.log(today)
					con.query("UPDATE staking_earns SET last_staking='"+today+"' where id="+row.id+"", function (err, result, fields) {
						if (err) throw err;
   						console.log(result.affectedRows + " record(s) updated");
					});

					var count_staking = row.count_staking + 1;
					console.log(count_staking)
					con.query("UPDATE staking_earns SET count_staking='"+count_staking+"' where id="+row.id+"", function (err, result, fields) {
						if (err) throw err;
   						console.log(result.affectedRows + " record(s) updated");
					});

					const contractAddress = "TE7VPZSSy7cdHX7q9w8GWfUAUnsrQFAcBM"
				    // "TDTD48fHfHPeS58EjGa5XNgsnGTGEfJW53"; //shasta

				    const TokenAddress = "TJ6CjSftX7ifUoBtK2VcvAKzcut9cnfrhq"

					const TronWeb = require('tronweb')

					const HttpProvider = TronWeb.providers.HttpProvider;
					const fullNode = new HttpProvider("https://api.trongrid.io");
					const solidityNode = new HttpProvider("https://api.trongrid.io");
					const eventServer = new HttpProvider("https://api.trongrid.io");
					const privateKey = "49199ab3ebdd0f6a5984625e0cffc29b5c3e6c3585c25aae70d0f20cfb671f87";
					const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
					console.log(privateKey);
					async function triggerSmartContract() {
					    const trc20ContractAddress = "TJ6CjSftX7ifUoBtK2VcvAKzcut9cnfrhq";//contract address
					    var address = "TQkFFxaAor8Aft4SgdoFGbARLEtp5NT5fB";
					    console.log(address);
					    var amount = 10 * (10*18);
					    try {
					        let contract = await tronWeb.contract().at(trc20ContractAddress);
					        //Use send to execute a non-pure or modify smart contract method on a given smart contract that modify or change values on the blockchain.
					        // These methods consume resources(bandwidth and energy) to perform as the changes need to be broadcasted out to the network.
					        console.log("contr", contract)
					        const trf = await contract.transfer(
					            row.address, //address _to
					            amount   //amount
					        ).send().then(output => {console.log('- Output:', output, '\n');});
					        console.log('result: ', trf);
					    } catch(error) {
					        console.error("trigger smart contract error",error)
					    }
					}



				}

		});
	});


}