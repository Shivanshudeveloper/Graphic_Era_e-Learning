<?php

$street_address = "566/6, Bell Road, Society Area, Clement Town, Dehradun, Uttarakhand 248002";
$date = date("l jS \of F Y h:i:s A");
$phone_number = "1800 270 1280";


// $customer_id = "DSDS";
// $grandTotal = "23";
// $orderName = "PG Diploma Data Science Full Time";
// $final_invoice_no = "5de89a29eb7991575524905720";
// $txnId = "75524905720";

$customer_id = $_POST['CUSTID'];
$grandTotal = $_POST['TXNAMOUNT'];
$orderName = $_POST['ORDERNAME'];
$final_invoice_no = $_POST['INVOICEID'];
$txnId = $_POST['TXNID'];


//-----------------------------------------------
//From here the INVOICE is getting generated
//-----------------------------------------------
//call the FPDF library
require('fpdf181/fpdf.php');
//A4 width : 219mm
//default margin : 10mm each side
//writable horizontal : 219-(10*2)=189mm
//create pdf object
$pdf = new FPDF('P', 'mm', 'A4');
//add new page
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 14);
//Cell(width , height , text , border , end line , [align] )
$pdf->Cell(59, 5, 'INVOICE', 0, 1);//end of line

$pdf->Cell(130, 5, 'Graphic Era Deemed to be University', 0, 1);
//set font to arial, regular, 12pt
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(130, 5, '' . $street_address . '', 0, 0);
$pdf->Cell(30, 5, '', 0, 1);//end of line
//$pdf->Cell(130 ,5,'[City, Country, ZIP]',0,0);
$pdf->Cell(12, 5, 'Date.', 0, 0);
$pdf->Cell(30, 5, '' . $date . '', 0, 1);//end of line
$pdf->Cell(100, 5, 'Phone No: ' . $phone_number . '', 0, 1);

$pdf->Cell(10, 10, '', 0, 1);//end of line

$pdf->Cell(22, 5, 'Invoice ID: '. $final_invoice_no , 0, 1);
$pdf->Cell(22, 5, 'TXN ID: '. $txnId , 0, 1);
// $pdf->Cell(60, 5, '' . $final_invoice_no . '', 0, 1);//end of line
//$pdf->Cell(130 ,5,'Fax [+12345678]',0,0);
// $pdf->Cell(28, 5, 'Admission No.', 0, 0);


//make a dummy empty cell as a vertical spacer
$pdf->Cell(10, 10, '', 0, 1);//end of line
//billing address
$pdf->Cell(10, 5, 'Bill To: '. $customer_id, 0, 1);//end of line
//add dummy cell at beginning of each line for indentation

$pdf->Cell(10, 5, 'Customer ID: ' . $customer_id . '', 0, 1);
// $pdf->Cell(10, 5, 'Email: ' . $email . '', 0, 1);
//make a dummy empty cell as a vertical spacer
$pdf->Cell(189, 10, '', 0, 1);//end of line
//invoice contents
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(140, 5, 'Name', 1, 0);
$pdf->Cell(20, 5, 'QTY.', 1, 0);
$pdf->Cell(30, 5, 'Amount', 1, 1);//end of line
$pdf->SetFont('Arial', '', 12);

$pizzaQuantityField = "S";

$pdf->Cell(140, 5, '' . $orderName . '', 1, 0);
$pdf->Cell(20, 5, '' . '1' . '', 1, 0);
$pdf->Cell(30, 5, '' . $grandTotal . '', 1, 1, 'R');//end of line
//summary


$pdf->Cell(140, 5, '', 0, 0);
$pdf->Cell(20, 5, 'SGST', 0, 0);
$pdf->Cell(30, 5, '9.0%', 1, 1, 'R');//end of line


$pdf->Cell(140, 5, '', 0, 0);
$pdf->Cell(20, 5, 'CGST', 0, 0);
$pdf->Cell(30, 5, '9.0%', 1, 1, 'R');//end of line

$pdf->Cell(140, 5, '', 0, 0);
$pdf->Cell(20, 5, 'Total', 0, 0);
$pdf->Cell(30, 5, '' . $grandTotal . '', 1, 1, 'R');//end of line
$pdf->Output();
?>