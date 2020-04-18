<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>GEU Courses Transaction</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
	<!-- Font Awesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
</head>
<body>
	
<div class="container text-center mt-4">
<?php
header("Access-Control-Allow-Origin: *");
header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");

// following files need to be included
require_once("./lib/config_paytm.php");
require_once("./lib/encdec_paytm.php");

$paytmChecksum = "";
$paramList = array();
$isValidChecksum = "FALSE";

$paramList = $_POST;
$paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg

//Verify all parameters received from Paytm pg to your application. Like MID received from paytm pg is same as your application�s MID, TXN_AMOUNT and ORDER_ID are same as what was sent by you to Paytm PG for initiating transaction etc.
$isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.




if($isValidChecksum == "TRUE") {
	// echo "<b>Checksum matched and following are the transaction details:</b>" . "<br/>";
	if ($_POST["STATUS"] == "TXN_SUCCESS") {
		echo "<h1>Transaction status is success</h1>" . "<br/>";
		//Process your transaction here as success transaction.
		//Verify amount & order id received from Payment gateway with your application's order id and amount.
	}
	else {
		echo "<b>Transaction status is FAILURE </b>" . "<br/>";
	}

	if (isset($_POST) && count($_POST)>0 )
	{ 
		session_start();
		$CUST_ID = $_SESSION['CUSTID'];
		$ORDER_NAME = $_SESSION['ORDERNAME'];
		$PRODUCT_ID = $_SESSION['PRODUCT_ID'];


		$date = date_create();
		$timestamp = date_timestamp_get($date);
		$randomNo = rand(10,1000);

		$INVOICE_NO = uniqid().$timestamp.$randomNo;

		echo '
			<form action="generateInvoice.php" method="POST" target="_blank">
			<input type="hidden" name="CUSTID" id="CUSTID" value="'.$CUST_ID.'" />
			<input type="hidden" name="INVOICEID" id="INVOICEID" value="'.$INVOICE_NO.'" />
			<input type="hidden" name="ORDERNAME" id="ORDERNAME" value="'.$ORDER_NAME.'" />
			<input type="hidden" name="PRODUCTID" id="PRODUCTID" value="'.$PRODUCT_ID.'" />
			'; 	
		foreach($_POST as $paramName => $paramValue) {
				echo '
				<input type="hidden" name="'.$paramName.'" id="'.$paramName.'" value="'.$paramValue.'" />
				'; 
				if ($paramName == "ORDERID" || $paramName == "TXNID" || $paramName == "TXNAMOUNT" || $paramName == "BANKNAME" || $paramName == "BANKTXNID" || $paramName == "CUST_ID") {
					echo "<h2>" . $paramName . " = " . $paramValue."</h2>";
				}
		}

		if ($_POST["STATUS"] == "TXN_SUCCESS") {
			echo "<button type='submit' class='btn btn-primary w-50 mt-2'>
			<i class='fas fa-file-alt mr-1'></i>
			Download Invoice
			</button> </br>"; 
			echo "<a class='btn btn-outline-info w-50 mt-2' href='http://geu-learning.herokuapp.com/courses'>
			<i class='fas fa-long-arrow-alt-left mr-1'></i>
			Back
			</a>";
		} else {
			echo "<a class='btn btn-outline-info w-50 mt-2' href='http://geu-learning.herokuapp.com/courses'>
			<i class='fas fa-long-arrow-alt-left mr-1'></i>
			Back
			</a>";
		}
		
		echo '</form>';
	}
	

}
else {
	echo "<b>Checksum mismatched.</b>";
	//Process transaction as suspicious.
}
?>
</div>

</body>
<script>
	$(document).ready(() => {
		const order_id = $("#ORDERID").val();
		const txn_id = $("#TXNID").val();
		const txn_amount = $("#TXNAMOUNT").val();
		const currency = $("#CURRENCY").val();
		const status = $("#STATUS").val();
		const resp_code = $("#RESPCODE").val();
		const resp_msg = $("#RESPMSG").val();
		const cust_id = $("#CUSTID").val();
		const invoice_id = $("#INVOICEID").val();
		const order_name = $("#ORDERNAME").val();
		const product_id = $("#PRODUCTID").val();

		var data = {
			order_id: order_id,
			txn_id: txn_id,
			txn_amount: txn_amount,
			currency: currency,
			status: status,
			resp_code: resp_code,
			resp_msg: resp_msg,
			cust_id: cust_id,
			invoice_id: invoice_id,
			order_name: order_name,
			product_id: product_id
		}
		$.ajax({
        type:"POST",
        cache:false,
        url:"http://geu-learning.herokuapp.com/transactionrequest",
        data:data,    
        success: function (html) {
          window.location.href = "http://localhost:5000/courses";
        }
      });
	});
</script>
</html>



