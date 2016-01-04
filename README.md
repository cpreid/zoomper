> A jQuery Plugin for zooming on images. Good for showcasing products

## Installation
```
$ git clone git@github.com:cpreid/zoomper.git
$ npm install
```

## Build Project
```
$ npm run build
```

## Usage
```html
<div class="zoom" data-small="http://i.imgur.com/RZJ6Rml.jpg" data-large="http://i.imgur.com/ZR9V0Gk.jpg" style="width:450px; height:300px;"></div>

<script src="zoomper.jquery.js"></script>
<script type="text/javascript">
// dom ready 
$(function() {
  // target your dom elements however you'd like, as long as they have data-small and data-large attr's 
  $('.zoom').zoomper();
});
</script>		
```
