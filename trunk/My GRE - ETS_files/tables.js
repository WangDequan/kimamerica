
	if(!Array.indexOf){
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    }
	}


	// fyi: http://stackoverflow.com/questions/306583/jquery-this-selector-and-children

	$(document).ready(function(){

		$('table.line-h').each(function(){
			$('tr:last', this).addClass('lastrow');
		}); // end : line-h


		$('table.line-v').each(function(){
			$('tr', this).each(function(){
				$('th:last', this).addClass('lastColumn');
				$('td:last', this).addClass('lastColumn');
			});
		}); // end: line-v

		// subhead have different colors and border
		$('table.data-table > thead > tr:nth-child(2)').each(function(){
			$(this).addClass('subhead').addClass('subhead-first');
		});
		// subhead have different colors and border
		$('table.data-table > thead > tr:nth-child(n+3)').each(function(){
			$(this).addClass('subhead').addClass('subhead-nth');
		});


		$('table.columnborder').each(function(){
			$('thead tr', this).each(function(){
				$('th:last', this).css('border-right', '0');
			});

			var spans = new Array();                   // list of column span attributes

			$('thead tr:first th', this).each(function(){             // for each header in the table
				spans.push( parseInt($(this).attr('colspan')) ); // get the number of columns each one of them spans
			});

			var borders = new Array();
			var tmp_sum = 0;
			$.each( spans, function(){
				tmp_sum += this;
				borders.push( tmp_sum-1 );
			});
			// alert( borders );

			$('tr th, tr td', this).each(function(){
				var cell = $(this);
				var row = $(cell).parent("tr");
				var cellIndex = cell[0].cellIndex
				var rowIndex = row[0].sectionRowIndex;
				var lastCell = borders[borders.length-1];

				var cumulativeIndex = 0; // how many cell are we 'into' the current row
				cell.prevUntil('tr').each(function(){
					cumulativeIndex += $(this).attr('colspan'); // all the colspans before 'this'
				});
				cumulativeIndex = cumulativeIndex + $(this).attr('colspan') - 1; // plus 'this' colspans ... -1 for the zero index

				// cell.append('('+cumulativeIndex+')');

				if( borders.indexOf( cumulativeIndex ) > -1 ) {
					// cell.append('('+cumulativeIndex+')');
					$(this).addClass('primaryborder');
				} else {
					$(this).addClass('secondaryborder');
				}

			}); // end: ('thead tr th').each


/*
	For some reason it may or may not be necessary to have the cell
	borders with columnborders. if you need to separate header/body
	border rules, use the rules below.

	that hasn't happened... yet...


			// add the primary border to the thead cells
			$('thead tr th', this).each(function(){
				var cell = $(this);
				var row = $(cell).parent("tr");
				var cellIndex = cell[0].cellIndex
				var rowIndex = row[0].sectionRowIndex;
				var lastCell = borders[borders.length-1];

				var cumulativeIndex = 0; // how many cell are we 'into' the current row
				cell.prevUntil('tr').each(function(){
					cumulativeIndex += $(this).attr('colspan'); // all the colspans before 'this'
				});
				cumulativeIndex = cumulativeIndex + $(this).attr('colspan') - 1; // plus 'this' colspans ... -1 for the zero index

				// cell.append('('+cumulativeIndex+')');

				if( rowIndex != 0 ) {
					if( cumulativeIndex != lastCell ) {
						if( borders.indexOf( cumulativeIndex ) > -1 ) {
							// cell.append('('+cumulativeIndex+')');
							$(this).addClass('primaryborder');
						}
					}
				}
			}); // end: ('thead tr th').each

			// add the primary border to the body cells
			$('tbody tr td', this).each(function(){
				var cell = $(this);
				// var row = $(cell).parent("tr");
				var cellIndex = cell[0].cellIndex
				// var rowIndex = row[0].sectionRowIndex;
				var lastCell = borders[borders.length-1];

				var cumulativeIndex = 0; // how many cell are we 'into' the current row
				cell.prevUntil('tr').each(function(){
					cumulativeIndex += $(this).attr('colspan'); // all the colspans before 'this'
				});
				cumulativeIndex = cumulativeIndex + $(this).attr('colspan') - 1; // plus 'this' colspans ... -1 for the zero index

				// cell.append('('+cumulativeIndex+')');

				if( cumulativeIndex != lastCell ) {
					if( borders.indexOf( cumulativeIndex ) > -1 ) {
						// cell.append('('+cumulativeIndex+')');
						$(this).addClass('primaryborder');
					} else {
						$(this).addClass('secondaryborder');
					}
				}
			}); // end: ('tbody tr th').each
*/
		}); // end: columnborder









		$('table.subsections').each(function(){
			$('tbody tr.section:first td').css('border-top','0');
			$('tbody tr.section').prev('tr').addClass('lastbeforesection');
			$('tbody tr th').removeClass('lastColumn').addClass('normal');
		}); // end : sections





		$('table.rowheadings').each(function(){
			$('tbody tr', this).each(function(){
				$('td:first', this).addClass('heading');
			});
			$('tbody tr:last', this).each(function(){
				$('td:first', this).css('border-bottom', '0');
			});
		}); // end: rowheadings


		// add in the stipes



		$('table.stripe-h tbody tr').each(function(){
			var tr = $(this);
			// var rowIndex = tr[0].sectionRowIndex;
			var hasRowSpan = $('td:first-child', this).attr('rowspan');

			// alert( rowIndex + " - " + hasRowSpan + " - " + $('td:first-child', this).text() );
			if( hasRowSpan > 1 ) {
				// make a note of how many row
				spanCount = hasRowSpan;

				// is this the first row?
				if( tr.prev().attr('class') == undefined ) {
					// if this is the 1st row, it will be undefined and should not be shaded
					tr.addClass('noshade');

					// and now loop through all the spanned rows and mark them as well
					for( var ii = 0; ii < hasRowSpan-1; ii++ ) {
						tr.nextAll().eq(ii).addClass('noshade');
					}

				} else {
					// but if it is not the 1st row, look at the previous row and see if it has shading.
					var nextShading = "shade"

					if( tr.prev().hasClass('shade') ) {
						nextShading = "noshade";
					}

					tr.addClass(nextShading);
					// and now loop through all the spanned rows and mark them as well
					for( var ii = 0; ii < hasRowSpan-1; ii++ ) {
						tr.nextAll().eq(ii).addClass(nextShading);
					}

				}

			} else {

				// otherwise, we are not spanning rows
				// is this the first row?
				if( tr.prev().attr('class') == undefined ) {
					// if this is the 1st row, it will be undefined and should not be shaded
					tr.addClass('noshade');

				} else {
					// but if it is not the 1st row, look at the previous row and see if it has shading.

					// has the shading already been determined because it is part of a rowspan?
					if( !tr.hasClass('shade') && !tr.hasClass('noshade') ) {
						var nextShading = "shade"
						if( tr.prev().hasClass('shade') ) {
							nextShading = "noshade";
						}
						tr.addClass(nextShading);
					}
				}
			}


		});




		$('table.stripe-v td').each(function(){
			var cell = $(this);
			// var row = $(cell).parent("tr");
			// var rowIndex = row[0].sectionRowIndex;
			var cellIndex = cell[0].cellIndex

			if( cellIndex % 2 ) {
				$(this).addClass('shade');
			}

		}); // end: stripe-v



	}); // end: document.ready

