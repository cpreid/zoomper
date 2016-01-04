(function() {

// shim for browsers that don't support dataset
var getData = function(elt, key) {
    if('dataset' in elt) {
        return elt.dataset[key];
    }
    else {
        return elt.getAttribute(['data', key].join('-'));
    }
}

var Zoomper = function(elt, small, large) {         
    this.elt = elt;
    this.smallImg = small;
    this.largeImg = large;
    this.frameSize = {'width': parseInt(elt.style.width), 'height': parseInt(elt.style.height)};
    this.mode = 'out';
    this.cursorStates = {'in': 'zoom-out', 'out': 'zoom-in'};
    this.largeLoaded = false;
}
Zoomper.prototype = {
    positionZoom: function(evt) {
        var diff = {'x': evt.offsetX / this.frameSize.width, 'y': evt.offsetY / this.frameSize.height};
        this.elt.style.backgroundPosition = [diff.x * 100, '%', ' ', diff.y * 100, '%'].join('');
    },
    listenHover: function() {
        var _this = this;
        this.elt.addEventListener('mousemove', function(evt) {
            if(_this.mode === 'out') return;
            _this.positionZoom(evt);
        });
    },
    unlistenHover: function() {
        this.elt.style.backgroundPosition = 'center center';
        // this.elt.removeEventListener('mousemove'); line 28 instead
    },
    zoomState: function(mode) { // 'in' || 'out'
        if(mode === 'in') {
            this.elt.style.backgroundImage = 'url(' + this.largeImg + ')';
            this.listenHover();
            this.elt.style.cursor = this.cursorStates.in;
        }
        else {
            this.elt.style.backgroundImage = 'url(' + this.smallImg + ')';
            this.unlistenHover();
            this.elt.style.cursor = this.cursorStates.out;
        }
    },
    zoomStateToggle: function() {
        this.mode = this.mode === 'in' ? 'out' : 'in';
        this.zoomState(this.mode);              
    },
    loadImagesCB: function(toLoad, cb) {
        var loaded = 0,
            checkComplete = function() {
                loaded++;
                if(toLoad.length === loaded) cb();
            }
        for(var i = 0; i < toLoad.length; i++) {
            var img = new Image;
            img.onload = checkComplete;
            img.src = toLoad[i];
        }
    },
    loadState: function(loading) {
        if(loading) this.loadElt.style.display = 'block';
        else this.loadElt.style.display = 'none';
    },
    clickHandler: function(evt) {
        var _this = this;
        // show zoom immediately
        if(_this.largeLoaded) {
            _this.zoomStateToggle(); 
            _this.positionZoom(evt);
        }
        // show loading state while zoom image loads
        else {
            _this.loadState(true);
            _this.loadImagesCB([_this.largeImg], function() {
                _this.largeLoaded = true;
                _this.clickHandler(evt);
                _this.loadState(false);
            });
        }        
    },
    init: function() {
        var _this = this;
        _this.elt.style.backgroundRepeat = 'no-repeat';
        _this.elt.style.position = 'relative';
        _this.zoomState('out');
        _this.elt.addEventListener('click', function(evt) { _this.clickHandler(evt); });
        _this.loadElt = document.createElement('div');
        _this.loadElt.style.cssText = 'display:none;height:100%;width:100%;top:0;left:0;position:absolute;background:rgba(255,255,255,.6);';
        _this.loadElt.innerHTML = '<div style="height:100%;width:100%;top:0;left:0;position:absolute;background: url(\'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\') center center no-repeat;"></div>';
        _this.elt.appendChild(_this.loadElt);
        return _this;
    }
}

var zoomper = function(elt) {
    return new Zoomper(elt, getData(elt, 'small'), getData(elt, 'large')).init();
}

})();
