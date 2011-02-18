(function($){
	var imageBeingRotated = true;  // The knob image currently being rotated
	var mouseStartAngle = false;    // The angle of the mouse relative to the knob center at the start of the rotation
	var imageStartAngle = false;    // The rotation angle of the knob at the start of the rotation
	var currLvl = 0; // current level starts at 0 
	
	/*jqKnob 
	 * knbImgSrc - the source of the image to use as the knob
	 * knbValID - the id of the element to return the value of the knob.
	 */
	
	$.fn.jqKnob = function(options){
		
		var knobMethods = {
				
			    startRotate : function (e) {
			    	//console.log(imageBeingRotated);
				  imageBeingRotated = this;
				
				  // Store the angle of the mouse at the start of the rotation, relative to the image centre
				  var imageCenter = knobMethods.getImageCenter( imageBeingRotated );
				  var mouseStartXFromCenter = e.pageX - imageCenter[0];
				  var mouseStartYFromCenter = e.pageY - imageCenter[1];
				  mouseStartAngle = Math.atan2( mouseStartYFromCenter, mouseStartXFromCenter );
				// Store the current rotation angle of the image at the start of the rotation
				  imageStartAngle = $(imageBeingRotated).data('currentRotation');
				
				  // Set up an event handler to rotate the image as the mouse is moved
				  $(document).mousemove( knobMethods.rotateImage );
					return false;
				},
			    stopRotate : function ( e ) {
					if ( !imageBeingRotated ) return;
					// Remove the event handler that tracked mouse movements during the rotation
				  	$(document).unbind( 'mousemove' );
				  	//  setTimeout( function() { imageBeingRotated = false; }, 10 );
				  	return false;
				},
			    rotateImage : function ( e ) {
			    	  if ( !imageBeingRotated ) return;
			    	 // Calculate the new mouse angle relative to the image centre
			    	 var imageCenter = knobMethods.getImageCenter( imageBeingRotated );
				   	  var mouseXFromCenter = e.pageX - imageCenter[0];
					  var mouseYFromCenter = e.pageY - imageCenter[1];
					  var mouseAngle = Math.atan2( mouseYFromCenter, mouseXFromCenter );
					 // console.log(imageBeingRotated);
					  // Calculate the new rotation angle for the image
					  var rotateAngle = mouseAngle - mouseStartAngle + imageStartAngle;
					  //var imgID =  imageBeingRotated.attr('id');
					  // Rotate the image to the new angle, and store the new angle
					 // $('#'+imgID).css('transform','rotate(' + rotateAngle + 'rad)');
					 // $('#'+imgID).css('-moz-transform','rotate(' + rotateAngle + 'rad)');
					  $(imageBeingRotated).css('-moz-transform','rotate(' + rotateAngle + 'rad)');
					  $(imageBeingRotated).css('-webkit-transform','rotate(' + rotateAngle + 'rad)');
					  $(imageBeingRotated).css('-o-transform','rotate(' + rotateAngle + 'rad)');
					  $(imageBeingRotated).data('currentRotation', rotateAngle );
					  
					  //calculate the value from the angles
					  //knob values should be from  
					  var ram = rotateAngle * Math.PI / 180 ;
					  var ax = parseInt(10 + (190*ram/(Math.PI)));
					  if (ax > 9 ){ax = 0;}
					  //var newag = parseInt(10 + ax);
					  if (ax == 9 ){
					  	if (currLvl == 0){
					  		ax = 0;
					  	}
					  //freeze image from turning clockwise
					  	knobMethods.stopRotate(); // sort of works if the 0 rolls back to 9 
					  //$('#stopMessg').show();
					  }
					  currLvl = ax;
					  $('#'+opts.knbValID).val(currLvl);
					  
					  return false;
					},
			    // Calculate the centre point of a given image

				getImageCenter : function ( image ) {
					
					  // Rotate the image to 0 radians
					  $(image).css('transform','rotate(0rad)');
					  $(image).css('-moz-transform','rotate(0rad)');
					  $(image).css('-webkit-transform','rotate(0rad)');
					  $(image).css('-o-transform','rotate(0rad)');
					
					  // Measure the image centre
					  var imageOffset = $(image).offset();
					  var imageCenterX = imageOffset.left + $(image).width() / 2;
					  var imageCenterY = imageOffset.top + $(image).height() / 2;
					
					  // Rotate the image back to its previous angle
					  var currentRotation = $(image).data('currentRotation');
					  $(imageBeingRotated).css('transform','rotate(' + currentRotation + 'rad)');
					  $(imageBeingRotated).css('-moz-transform','rotate(' + currentRotation + 'rad)');
					  $(imageBeingRotated).css('-webkit-transform','rotate(' + currentRotation + 'rad)');
					  $(imageBeingRotated).css('-o-transform','rotate(' + currentRotation + 'rad)');
					
					  // Return the calculated centre coordinates
					  return Array( imageCenterX, imageCenterY );
					},
				
			    dragStart : function ( e, ui ) {
					  if ( imageBeingRotated ) return false;
					}
		};
		/*the options for this are the image to use for the knob, image to use for the background, height and width*/
		$(document).mouseup( knobMethods.stopRotate );
		var opts =  {knbImgSrc:'images/newKnob60.png', knbValID:'kv1'};
		if (options){
			$.extend( opts, options );
		}
		this.html('<img src="' + opts.knbImgSrc + '" class="knobIMG" />');
		var angle = Math.floor(30);
	    //these were for some prerotation of the image but decided its not needed.
	    //$(this).children('img').css( 'left', left+'px' );
	   // $(this).children('img').css( 'top', top+'px' );
	   // $(this).children('img').css( 'transform', 'rotate(' + angle + 'deg)' );   
	   // $(this).children('img').css( '-moz-transform', 'rotate(' + angle + 'deg)' );   
	   // $(this).children('img').css( '-webkit-transform', 'rotate(' + angle + 'deg)' );
	   // $(this).children('img').css( '-o-transform', 'rotate(' + angle + 'deg)' );
	    $(this).children('img').data('currentRotation', angle * Math.PI / 180 );
		$(this).children('img').draggable( { containment: 'parent', stack: this, cursor: 'pointer', start: knobMethods.dragStart, distance: 1 } );
	    $(this).children('img').mousedown( knobMethods.startRotate );
		  
		return ;
	};
})(jQuery);