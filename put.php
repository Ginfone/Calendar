<?php
	ini_set('display_errors','On');
	$myFile = './data.json';
	$arr_data = array();

	if($_SERVER['REQUEST_METHOD'] === 'POST'){
		try
			{
				$unique = $_POST['uniqueId'];
				$formdata = array(
					 'uniqueId'=> $_POST['uniqueId'],
					 'event'=> $_POST['event'],
					 'location'=> $_POST['location'],
					 'whatday'=> $_POST['whatday'],
					 'dateStart'=> $_POST['dateStart'],
					 'dateEnd'=> $_POST['dateEnd']

				);

				 //Get data from existing json file
				 $jsondata = file_get_contents($myFile);

				 // converts json data into array
				 $arr_data = json_decode($jsondata, true);


			   // Push user data to array
				 $replacement = array($unique => $formdata);
			   $new_arr = array_replace($arr_data,$replacement);



				 $jsondata = json_encode($new_arr, JSON_PRETTY_PRINT);


				 if(file_put_contents($myFile, $jsondata)) {
							echo 'Data successfully saved';
							var_dump($arr_data);
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
