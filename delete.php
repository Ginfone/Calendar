<?php
	ini_set('display_errors','On');
	$myFile = './data.json';
	$arr_data = array();

	if($_SERVER['REQUEST_METHOD'] === 'DELETE'){
		try
		  {


			   //Get data from existing json file
			   $jsondata = file_get_contents($myFile);

			   // converts json data into array
			   $arr_data = json_decode($jsondata, true);

			   // Push user data to array
				 $unique = $_GET['uniqueId'];
				 unset($arr_data[$unique]);


				 $jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

				 if(file_put_contents($myFile, $jsondata)) {
					 		header('Content-Type: application/json');
			        echo json_encode($arr_data);
			    }
			   else{
			        echo "error";
		   		}



		   }
		   catch (Exception $e) {
		            echo 'Caught exception: ',  $e->getMessage(), "\n";
		   }
	}


 ?>
