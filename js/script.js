$(function(){
	//global
	var self;
	var uniqueId;
	var db = {};
	var tdPosition=[];
	var week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	var returnThisEventId;
	var record =[];
	//get method
	$.get('../calendar/data.json',function(data, status){
		uniqueName = Object.keys(data)[Object.keys(data).length-1];
		if(!data[uniqueName]){
			uniqueId = 0;
		}else{
			uniqueId = data[uniqueName].uniqueId - 0 + 1;
		}
		console.log(uniqueId);

		Object.keys(data).forEach(function(i){
			var what = data[i].event;
			var location = data[i].location;
			var whatday = data[i].whatday;
			var uniqueId = data[i].uniqueId;
			var start  = data[i].dateStart.replace(':','') - 0;
			var end  = data[i].dateEnd.replace(':','') - 0;
			var dateEnd = end <1000? '0'+ data[i].dateEnd : data[i].dateEnd;
			var elapse = end - start;
			var registerEvent = "<ul class='eventRegister' date-end="+dateEnd+" id="+uniqueId+"><li>"+what+"</li><li>"+location+"</li></ul>";
			var x = week.indexOf(whatday);
			var y = Math.floor(start/100+1);

			$('tbody tr:eq('+y+') td:eq('+x+')').html(registerEvent);
			$('#'+uniqueId).css({
				height: elapse/100 * 70+'px',
				backgroundColor: '#0F222F' //+Math.floor(Math.random()*1000000)
			})
		});
		db = data;
	});


	//form popup trigger
	$('.calendar td').on('click',function(){


		self = $(this);
		//form position
		var formPosition = self.position();
		var popX = formPosition.left + self.width();
		var popY = formPosition.top + self.height();
		tdPosition =[$(this).index(),$(this).parent().index() -1]; //refet X and Y
		var what = $(this).children('ul').children('li:first-child').html();
		var location = $(this).children('ul').children('li:last-child').html();
		var dateEnd = $(this).children('ul').attr('date-end');
		var getThisEventId =  $(this).children('ul').attr('id');
		returnThisEventId = $(this).children('ul').attr('id');

		// if(getThisEventId){
		// 	var endTimeRegisted = db[getThisEventId].dateEnd.replace(':','') - 0 < 1000? '0'+ db[getThisEventId].dateEnd : db[getThisEventId].dateEnd;
		// 	console.log(endTimeRegisted);
		// 	$('#submitForm #dateEnd').val(endTimeRegisted);
		// }

		// console.log(db);
		$('#submitForm #event').val(what);
		$('#submitForm #location').val(location);
		if(dateEnd){
			$('#dateEnd').val(dateEnd);
			var endTime = tdPosition[1]+1;
			var defaultStartTime = tdPosition[1]<10 ? '0'+tdPosition[1]+':00':tdPosition[1]+':00';
			$('#dateStart').attr('value',defaultStartTime);
		}else{
			var endTime = tdPosition[1]+1;
			var defaultStartTime = tdPosition[1]<10 ? '0'+tdPosition[1]+':00':tdPosition[1]+':00';
			var defaultEndTime = tdPosition[1]<9 ? '0'+endTime+':00':endTime+':00';
			$('#dateStart').attr('value',defaultStartTime);
			$('#dateEnd').attr('value',defaultEndTime);
		}

		$('#submitForm').css({
			display:'block',
			top:popY,
			left:popX,
		});


	})

	//submit form
	$('#submit').on('click',function(e){
		e.preventDefault();

		var what = $('#event').val();
		var location = $('#location').val();
		var startDate =$('#dateStart').val();
		var endDate =$('#dateEnd').val();
		var start = startDate.replace(':','') - 0;
		var end  = endDate.replace(':','') - 0;
		var elapse = end - start;
		var eventOrder = typeof(returnThisEventId)== 'undefined'? uniqueId:returnThisEventId;
		var data = "<ul class='eventRegister' id="+eventOrder+"><li>"+what+"</li><li>"+location+"</li></ul>";

		if(elapse>0){

			self.html(data);

			$('#'+eventOrder).css({
				height: elapse/100 * 70+'px',
				backgroundColor: '#0F222F'
			})
			$('#submitForm').css({
				display:'none',
			});
			$('#dateEnd').css({
				borderBottom:'2px solid black',
			})
		}else{
			$('#dateEnd').css({
				borderBottom:'2px solid red',
			})
		}
		var startDate = start < 1000? startDate.slice(1): startDate;
		var endDate = end < 1000? endDate.slice(1): endDate;
		var toPost ={
			uniqueId: uniqueId,
			event:what,
			location:location,
			whatday:week[tdPosition[0]],
			dateStart: startDate,
			dateEnd: endDate,
		};
		var toPut ={
			uniqueId: returnThisEventId,
			event:what,
			location:location,
			whatday:week[tdPosition[0]],
			dateStart: startDate,
			dateEnd: endDate,
		};
		console.log(toPut.uniqueId)
		if(elapse > 0){
			if(returnThisEventId){
				$.ajax({
					url: './put.php',
					type: 'POST',
					data: toPut,
					success: function() {
							record.push('修改记录'+':'+what+','+location+','+week[tdPosition[0]]+','+startDate+'-'+endDate);
							console.log(record);
							$('#close').click();// Do something with the result
					}
				});
			}else if(typeof(returnThisEventId)=='undefined'){
				$.post('../calendar/method.php',toPost).done(function(){
						record.push('新增记录'+':'+what+','+location+','+week[tdPosition[0]]+','+startDate+'-'+endDate);
						console.log(record);
						uniqueId++;
					$.get('../calendar/data.json',function(data, status){
						db = data;
						});
				});
			}
		}


	})
	//close form
	$('#close').on('click',function(){
		$('#submitForm').hide(300);
	})
	//put method

	//delete method
	$('#delete').on('click',function(e){
			e.preventDefault();
			$.ajax({
	    url: './delete.php?uniqueId='+returnThisEventId,
	    type: 'DELETE',
	    success: function(result) {
	        $('#close').click();// Do something with the result
					window.location.reload();
    	}
		});
	})

})
