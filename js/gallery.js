// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
    if (mCurrentIndex > mImages.length - 1) {
        mCurrentIndex = 0;
    } else if (mCurrentIndex < 0) {
        mCurrentIndex = mImages.length - 1;

    }
    console.log(mCurrentIndex)

    //changes html to add image descriptions
    $('#slideShow .photoHolder img').attr('src', mImages[mCurrentIndex].imgPath);
    $('#slideShow .details .location').text("Location: " + mImages[mCurrentIndex].imgLocation);
    $('#slideShow .details .description ').text("Description: " + mImages[mCurrentIndex].description);
    $('#slideShow .details .date ').text("Date: " + mImages[mCurrentIndex].date);

    //console.log(mImages[0].imgPath);
    console.log('swap photo');
    mCurrentIndex++;
}
$(document).ready(function () {

    // This initially hides the photos' metadata information
    $('.details').eq(0).hide();

    $("img.moreIndicator").click(function () {
        if ($(this).hasClass("rot90")) {
            $(this).removeClass("rot90").addClass("rot270");
            $("div.details").fadeToggle("slow", "linear");
        } else {
            $(this).removeClass("rot270").addClass("rot90");
            $("div.details").fadeToggle("slow", "linear");
        }
    });

    $("#nextPhoto").css({"position": "absolute", "right": "0"});

    $("#nextPhoto").click(function () {
        swapPhoto()
    });

    $("#prevPhoto").click(function () {
        mCurrentIndex = mCurrentIndex - 2;
        swapPhoto()
    });

});

window.addEventListener('load', function () {

    console.log('window loaded');

}, false);
// Counter for the mImages array
var mCurrentIndex = 1;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl ='images.json';


mRequest.onreadystatechange = function() {
// Do something interesting if file is opened successfully
    if (mRequest.readyState == 4 && mRequest.status == 200) {
        try {
// Let’s try and see if we can parse JSON
            mJson = JSON.parse(mRequest.responseText);
// Let’s print out the JSON; It will likely show as "obj"
           // console.log(mJson);
            for (var i = 0 ; i < mJson.images.length; i++){
            	var myLine = mJson.images[i];
                mImages.push(new GalleryImage(myLine.imgLocation, myLine.description, myLine.date, myLine.imgPath));
            }


            //console.log(mJson.images[1].description);
            //console.log(mJson.images[1].imgLocation);
			console.log(mImages)

        } catch(err) {
            console.log(err.message)
        }
    }
};
mRequest.open("GET",mUrl, true);
mRequest.send();

if ($_GET["json"] === "extra.json") {
     mUrl = "extra.json";
} else {
     mUrl = "images.json";
}

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(location,description,date,url) {
    this.location = location;
    this.description = description;
    this.date = date;
    this.url = url;


    //implement me as an object to hold the following data about an image:
    //1. location where photo was taken
    //2. description of photo
    //3. the date when the photo was taken
    //4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}