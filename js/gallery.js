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

//Allows the clickity clackity of the arrow buttons
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}
var $_GET = getQueryParams(document.location.search);

function swapPhoto() {
    //Add code here to access the #slideShow element.
    //Access the img element and replace its source
    //with a new image from your images array which is loaded
    //from the JSON string

    //Makes sure it loops the images
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


//sets to images.json by default
if ($_GET["json"] === "extra.json") {
    var mUrl = "extra.json";
} else {
    var mUrl = "images.json";
}

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
    return function (e) {
        galleryImage.img = e.target;
        mImages.push(galleryImage);
        console.log(mImages);
    }
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

//Galley Image Object Constructor
function GalleryImage(imgPath, imgLocation, description, date) {
    this.imgPath = imgPath;
    this.imgLocation = imgLocation;
    this.description = description;
    this.date = date;

}

//Creates Galley Image Objects from JSON file, pushes objects into mImages array
function reqListener() {
    console.log(JSON.parse(this.responseText));
    var mJson = JSON.parse(this.responseText);
    for (var i = 0; i < mJson.images.length; i++) {
        var current = mJson.images[i];
        var imageDetails = new GalleryImage(current.imgPath, current.imgLocation, current.description, current.date);
        mImages.push(imageDetails);

    }
}

mRequest.addEventListener("load", reqListener);
mRequest.open("GET", mUrl);
mRequest.send();