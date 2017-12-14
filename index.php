
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" href="css/main.css">
	<title>Calendar</title>
</head>
<body>
	<form id='submitForm' >
		<span id='close'>X</span>
		<input id='event' class='input' placeholder="Event"/>
		<input id='location' class='input' placeholder="Location"/>
		<input id='dateStart' class='input date' type="time"  value=""/>
		<input id='dateEnd' class='input date' type="time" value=""/>
		<span id="delete" >Del</span>
		<button id="submit" >Submit</button>
	</form>
	<div id="hourly">
		<ul>
			<?php
				for($x = 0 ; $x<24 ; $x++){
					echo'
					<li>'.$x.':00</li>
					';
				}
			 ?>
		</ul>
	</div>
	<table class="calendar" cellspacing='0'>
		<tbody>
			<tr>
				<th>Mon</th>
				<th>Tue</th>
				<th>Wed</th>
				<th>Thu</th>
				<th>Fri</th>
				<th>Sat</th>
				<th>Sun</th>
			</tr>
			<?php
				for($x=0;$x<24;$x++){
					echo'
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>';
				}
			?>
		</tbody>
	</table>
	<script src='js/jquery-3.2.1.min.js'></script>
	<script src='js/script.js'></script>
</body>
</html>
