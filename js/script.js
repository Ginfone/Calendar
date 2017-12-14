$(function(){
	//global
	var self;
	var uniqueId;
	var db = {};
	var tdPosition=[];
	var week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	var returnThisEventId;
	var record =[];
	var delData ={};
	//init get
	function getInit(){
		$.get('../calendar/data.json',function(data, status){
			uniqueName = Object.keys(data)[Object.keys(data).length-1];
			//initial uniqueId
			if(!data[uniqueName]){
				uniqueId = 0;
			}else{
				uniqueId = data[uniqueName].uniqueId - 0 + 1;
			}
			//iterate data from data.json
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
				//render element
				$('tbody tr:eq('+y+') td:eq('+x+')').html(registerEvent);
				$('#'+uniqueId).css({
					height: elapse/100 * 70+'px',
					backgroundColor: color() //+Math.floor(Math.random()*1000000)
				})
			});
			db = data;
		});
	}
	getInit();

	//color random pickup
	function color(){
		var color = ['#E6553F','#F8EBC2','#66A8A6','#79896E','#0F222F'];
		return color[Math.floor(Math.random()*5)];
	}

	//form popup trigger
	$('.calendar td').on('click',function (){
		self = $(this);
		//get info from element
		var formPosition = self.position();
		var popX = formPosition.left + self.width();
		var popY = formPosition.top + self.height();
		var what = $(this).children('ul').children('li:first-child').html();
		var location = $(this).children('ul').children('li:last-child').html();
		var dateEnd = $(this).children('ul').attr('date-end');
		var getThisEventId =  $(this).children('ul').attr('id');
		tdPosition =[$(this).index(),$(this).parent().index() -1]; //refet X and Y
		returnThisEventId = $(this).children('ul').attr('id');
		delData ={
			what:what,
			location:location,
			whatday:week[tdPosition[0]],
			startDate:tdPosition[1]+':00',
			endDate:dateEnd
		};

		$('#submitForm #event').val(what);
		$('#submitForm #location').val(location);
		if(dateEnd !== undefined){
			$('#dateEnd').val(dateEnd);
			var endTime = tdPosition[1]+1;
			var defaultStartTime = tdPosition[1]<10 ? '0'+tdPosition[1]+':00':tdPosition[1]+':00';
			$('#dateStart').attr('value',defaultStartTime);
		}else{
			var endTime = tdPosition[1]+1;
			var defaultStartTime = tdPosition[1]<10 ? '0'+tdPosition[1]+':00':tdPosition[1]+':00';
			var defaultEndTime = endTime<10 ? '0'+endTime+':00':endTime+':00';
			$('#dateStart').attr('value',defaultStartTime);
			$('#dateEnd').val(defaultEndTime);
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
		var data = "<ul class='eventRegister' date-end="+endDate+" id="+eventOrder+"><li>"+what+"</li><li>"+location+"</li></ul>";
		console.log(endDate);
		if(elapse>0){

			self.html(data);

			$('#'+eventOrder).css({
				height: elapse/100 * 70+'px',
				backgroundColor: color()
			})
			$('#submitForm').css({
				display:'none',
			});
			$('#dateEnd').css({
				borderBottom:'2px solid black',
			});


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
		if(elapse > 0){
			//put method
			if(returnThisEventId){
				$.ajax({
					url: './put.php',
					type: 'POST',
					data: toPut,
					success: function() {
							record.push('修改记录:</br>'+what+',</br>'+location+',</br>'+week[tdPosition[0]]+',</br>'+startDate+'-'+endDate);
							$('#record ul').append('<li>'+record[record.length-1]+'</li>');
							$('#close').click();// Do something with the result
					}
				});
			}else if(typeof(returnThisEventId)=='undefined'){
				//post method
				$.post('../calendar/method.php',toPost).done(function(){
						record.push('新增记录:</br>'+what+',</br>'+location+',</br>'+week[tdPosition[0]]+',</br>'+startDate+'-'+endDate);
						$('#record ul').append('<li>'+record[record.length-1]+'</li>');
						uniqueId++;
					$.get('../calendar/data.json',function(data, status){
						db = data;
						});
				});
			}
		}
	})

	//delete method
	$('#delete').on('click',function(e){
			e.preventDefault();
			$.ajax({
	    url: './delete.php?uniqueId='+returnThisEventId,
	    type: 'DELETE',
	    success: function(result) {
					// Do something with the result
					record.push('删除记录:</br>'+delData.what+',</br>'+delData.location+',</br>'+delData.whatday+',</br>'+delData.startDate+'-'+delData.endDate);
					$('#record ul').append('<li>'+record[record.length-1]+'</li>');
	        $('#close').click();
					$('#'+returnThisEventId).parent().html('');
					db = result;
					uniqueId = Object.keys(db)[Object.keys(db).length-1]-0 + 1;
					if(isNaN(uniqueId)){
						uniqueId = 0;
					}else{
						uniqueId = uniqueId;
					}
    	}
		});
	})

	//close form
	$('#close').on('click',function(){
		$('#submitForm').hide(300);
	})

})
