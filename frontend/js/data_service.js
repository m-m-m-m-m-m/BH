app.service('data_service', ['$http', function ($http) {

    var data = {};

    data.getProjects = loadProjects;

    function loadProjects() {
        return $http({
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            method: 'GET',
            url: 'http://localhost/BH/public/php/get_projects.php'
            //url: 'data.json'
        });
    }

    data.visualisation = (function(){
        var canvas = null,
          started = false,
          paused = false,
          vis_obj;

        vis_obj = (function(){
            var distance = 4000,
                container, camera,  scene,  renderer, controls, loaderJSON, id, light, with_roof;

            function init(){
                container = document.getElementById("vis_container");

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0xffffff, 14500, 17000);


                camera = new THREE.PerspectiveCamera(30, container.clientWidth / window.innerHeight, 1, 15000);

                camera.position.x = 0;
                camera.position.y = 300;
                camera.position.z = 10000;
                scene.add(camera);

                scene.add(new THREE.AmbientLight(0x666666));
                light = new THREE.DirectionalLight(0xdfebff, 1.75);
                light.position.set(50, 200, 100);
                light.position.multiplyScalar(1.3);
                scene.add(light);


                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(container.clientWidth, window.innerHeight);
                renderer.setClearColor(scene.fog.color);
                container.appendChild(renderer.domElement);

                renderer.gammaInput = true;
                renderer.gammaOutput = true;
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;

                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.maxPolarAngle = Math.PI * 0.6;
                controls.minDistance = 400;
                controls.maxDistance = 13000;

                startVisualisation();
            }

            function resetView(){
                camera.position.x = 0;
                camera.position.y = 750;
                camera.position.z = 10000;
            }


            function load_obj(url, name){

                var scale = 300;

                loaderJSON = new THREE.JSONLoader();

                loaderJSON.load(url, function (geometry, materials) {
                        geometry.center();
                        geometry.computeBoundingBox ();
                        var bBox = geometry.boundingBox;
                        var y_offset=(bBox.min.y*100>=0)?bBox.min.y*scale:bBox.min.y*-scale;
                        zmesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
                        zmesh.position.set(0, y_offset-scale-200, 0);
                        zmesh.scale.set(scale, scale, scale);
                        zmesh.castShadow = true;
                        zmesh.name = name;

                        if(name == "2"){
                            zmesh.traverse( function ( object ) {
                                object.visible = false;
                                with_roof = "1";
                            });
                        }
                        scene.add(zmesh);
                    }
                );
            }



            function startVisualisation(){
                started = true;
            }

            function pauseVisualisation(){
                if(!paused && started) {
                    window.removeEventListener('resize', onWindowResize, false);
                    cancelAnimationFrame(id);
                    paused = true;
                }
            }

            function onWindowResize() {
                camera.aspect = container.clientWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( container.clientWidth, window.innerHeight );
            }

            function animate() {
                window.addEventListener('resize', onWindowResize, false);
                paused = false;
                id = requestAnimationFrame( animate );
                render();
            }

            function changeObj(){
                var obj1 = scene.getObjectByName("1"),
                    obj2 = scene.getObjectByName("2");

                scene.remove( obj1 );
                scene.remove( obj2 );
            }

            function render() {
                var cameraTarget = new THREE.Mesh( new THREE.CubeGeometry(0,0,0));
                cameraTarget.position.y = 200;
                camera.lookAt( cameraTarget.position );
                renderer.render( scene, camera );
            }


            function switchObjects(){
                scene.getObjectByName(with_roof).traverse( function ( object ) {
                    object.visible = false;
                    with_roof = (with_roof == "1")?"2":"1";
                });

                scene.getObjectByName(with_roof).traverse( function ( object ) {
                    object.visible = true;
                });

            }

            return {
                init      : init,
                animate   : animate,
                load      : load_obj,
                pause     : pauseVisualisation,
                reset     : changeObj,
                resetView : resetView,
                roof      : switchObjects
            }

        }());

        return {
            isStarted : function () {
                return started;
            },
            isPaused : function () {
                return paused;
            },
            getVisState : function () {
                return [vis_obj, canvas]
            },
            setVisState : function (obj, vis_canvas) {
                vis_obj = obj;
                canvas  = vis_canvas;
            },
            pauseVis : function(){
                vis_obj.pause();
            },
            resetVis : function(){
                if(started){
                    vis_obj.reset();
                    vis_obj.resetView();
                }
            },
            resetView : function(){
                if(started){
                    vis_obj.resetView();
                }
            }
        }
    }());


    data.StatesStore = function(){
        var store = {
            vis: 0,
            photo: 0,
            front: 0,
            plans: 0
        };

        function resetState(view){
            store[view] = 0;
        }

        function resetAllState(){
            for(var k in store){
                store[k] = 0;
            }
        }

        function getState(view){
            return store[view];
        }

        function setState(view, state){
            store[view] = state;
        }

        return {
            reset: resetState,
            resetAll: resetAllState,
            set: setState,
            get: getState
        }
    }();



    data.wheelzoom = (function(){

        var current_element;

        var wheelzoom = (function(){
                var defaults = {
                    zoom: 0.10,
                    touchZoom: 0.03
                };

                var canvas = document.createElement('canvas');

                var main = function(img, options){
                    if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

                    var settings = {}, width, height, bgWidth,bgHeight, bgPosX, bgPosY, previousEvent, cachedDataUrl;

                    var dollyStart = new THREE.Vector2();
                    var dollyEnd = new THREE.Vector2();
                    var dollyDelta = new THREE.Vector2();
                    var dollyCenter = function(){
                        var x,y;

                        return {
                            get : function(){
                                return {x:x,y:y};
                            },
                            set: function(x1,y1){
                                x = x1;
                                y = y1;
                            }
                        }
                    }();

                    var rotateStart = new THREE.Vector2();
                    var rotateEnd = new THREE.Vector2();
                    var rotateDelta = new THREE.Vector2();


                    function setSrcToBackground(img) {
                        img.style.backgroundImage = 'url("'+img.src+'")';
                        img.style.backgroundRepeat = 'no-repeat';
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        cachedDataUrl = canvas.toDataURL();
                        img.src = cachedDataUrl;
                    }

                    function updateBgStyle() {
                        if (bgPosX > 0) {
                            bgPosX = 0;
                        } else if (bgPosX < width - bgWidth) {
                            bgPosX = width - bgWidth;
                        }

                        if (bgPosY > 0) {
                            bgPosY = 0;
                        } else if (bgPosY < height - bgHeight) {
                            bgPosY = height - bgHeight;
                        }

                        img.style.backgroundSize = bgWidth+'px '+bgHeight+'px';
                        img.style.backgroundPosition = bgPosX+'px '+bgPosY+'px';
                    }

                    function reset() {
                        bgWidth = width;
                        bgHeight = height;
                        bgPosX = bgPosY = 0;
                        updateBgStyle();
                    }


                    function onwheel(e) {
                        var deltaY = 0;

                        e.preventDefault();

                        if (e.deltaY) {
                            deltaY = e.deltaY;
                        } else if (e.wheelDelta) {
                            deltaY = -e.wheelDelta;
                        }

                        var rect = img.getBoundingClientRect();
                        var offsetX = e.pageX - rect.left - window.pageXOffset;
                        var offsetY = e.pageY - rect.top - window.pageYOffset;

                        var bgCursorX = offsetX - bgPosX;
                        var bgCursorY = offsetY - bgPosY;

                        var bgRatioX = bgCursorX/bgWidth;
                        var bgRatioY = bgCursorY/bgHeight;

                        if (deltaY < 0) {
                            bgWidth += bgWidth * settings.zoom;
                            bgHeight += bgHeight * settings.zoom;
                        } else {
                            bgWidth -= bgWidth*settings.zoom;
                            bgHeight -= bgHeight*settings.zoom;
                        }

                        bgPosX = offsetX - (bgWidth * bgRatioX);
                        bgPosY = offsetY - (bgHeight * bgRatioY);

                        if (bgWidth <= width || bgHeight <= height) {
                            reset();
                        } else {
                            updateBgStyle();
                        }
                    }

                    function touchZoom(){
                        var rect = img.getBoundingClientRect();
                        var center_point = dollyCenter.get();
                        
                        var offsetX = center_point.x - rect.left - window.pageXOffset;
                        var offsetY = center_point.y - rect.top - window.pageYOffset;

                        var bgCursorX = offsetX - bgPosX;
                        var bgCursorY = offsetY - bgPosY;

                        var bgRatioX = bgCursorX/bgWidth;
                        var bgRatioY = bgCursorY/bgHeight;


                        if (dollyDelta.y > 0) {
                            bgWidth += bgWidth*settings.touchZoom;
                            bgHeight += bgHeight*settings.touchZoom;
                        } else {
                            bgWidth -= bgWidth*settings.touchZoom;
                            bgHeight -= bgHeight*settings.touchZoom;
                        }

                        bgPosX = offsetX - (bgWidth * bgRatioX);
                        bgPosY = offsetY - (bgHeight * bgRatioY);

                        if (bgWidth <= width || bgHeight <= height) {
                            reset();
                        } else {
                            updateBgStyle();
                        }
                    }

                    function drag(e) {
                        e.preventDefault();
                        bgPosX += (e.pageX - previousEvent.pageX);
                        bgPosY += (e.pageY - previousEvent.pageY);
                        previousEvent = e;
                        updateBgStyle();
                    }


                    function onTouchStart( event ) {

                        switch ( event.touches.length ) {
                            case 1:
                                handleTouchStart( event );
                                break;

                            case 2:
                                handleTouchStartDolly( event );
                                break;

                            default:
                                break;
                        }
                    }


                    function onTouchMove( event ) {
                        event.preventDefault();
                        event.stopPropagation();

                        switch ( event.touches.length ) {
                            case 1:
                                handleTouchMove( event );
                                break;

                            case 2:
                                handleTouchMoveDolly( event );
                                break;

                            default:
                                break;
                        }
                    }

                    function handleTouchStart(event){
                        rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    }

                    function handleTouchMove( event ) {
                        rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                        rotateDelta.subVectors( rotateEnd, rotateStart );

                        bgPosX += (rotateDelta.x);
                        bgPosY += (rotateDelta.y);

                        rotateStart.copy( rotateEnd );
                        updateBgStyle();

                    }

                    function handleTouchStartDolly( event ) {

                        var touch0 = event.touches[ 0 ];
                        var touch1 = event.touches[ 1 ];

                        var x = ( touch0.pageX + touch1.pageX ) / 2;
                        var y = ( touch0.pageY + touch1.pageY ) / 2;
                        dollyCenter.set(x,y);

                        var dx = touch0.pageX - touch0.pageX;
                        var dy = touch1.pageY - touch1.pageY;

                        var distance = Math.sqrt( dx * dx + dy * dy );
                        dollyStart.set( 0, distance );
                    }

                    function handleTouchMoveDolly( event ) {

                        var touch0 = event.touches[ 0 ];
                        var touch1 = event.touches[ 1 ];

                        var dx = touch0.pageX - touch1.pageX;
                        var dy = touch0.pageY - touch1.pageY;

                        var distance = Math.sqrt( dx * dx + dy * dy );
                        dollyEnd.set( 0, distance );
                        dollyDelta.subVectors( dollyEnd, dollyStart );

                        touchZoom();
                        dollyStart.copy( dollyEnd );
                    }

                    function removeDrag() {
                        document.removeEventListener('mousemove', drag);
                        document.removeEventListener('mouseup', removeDrag);
                    }

                    function draggable(e) {
                        e.preventDefault();
                        previousEvent = e;
                        document.addEventListener('mousemove', drag);
                        document.addEventListener('mouseup', removeDrag);
                    }

                    function load() {
                        if (img.src === cachedDataUrl) return;

                        var computedStyle = window.getComputedStyle(img, null);

                        width = parseInt(computedStyle.width, 10);
                        height = parseInt(computedStyle.height, 10);
                        bgWidth = width;
                        bgHeight = height;
                        bgPosX = 0;
                        bgPosY = 0;

                        setSrcToBackground(img);

                        img.style.backgroundSize =  width+'px '+height+'px';
                        img.style.backgroundPosition = '0 0';
                        img.addEventListener('wheelzoom.reset', reset);
                        img.addEventListener('wheel', onwheel);
                        img.addEventListener('mousedown', draggable);
                        img.addEventListener('touchstart', onTouchStart);
                        img.addEventListener('touchmove', onTouchMove);
                    }


                    function removeAllListeners(){
                        img.removeEventListener('wheelzoom.destroy', destroy);
                        img.removeEventListener('wheelzoom.destroyAll', destroyAll);
                        img.removeEventListener('wheelzoom.reset', reset);
                        img.removeEventListener('load', load);
                        img.removeEventListener('mouseup', removeDrag);
                        img.removeEventListener('mousemove', drag);
                        img.removeEventListener('mousedown', draggable);
                        img.removeEventListener('wheel', onwheel);
                        img.removeEventListener('touchstart', onTouchStart);
                        img.removeEventListener('touchmove', onTouchMove);

                    }

                    var destroy = function (originalProperties,ng_src) {
                        removeAllListeners();

                        img.style.backgroundImage = originalProperties.backgroundImage;
                        img.style.backgroundRepeat = originalProperties.backgroundRepeat;
                        img.src = ng_src.target.ng_src;
                    }.bind(null, {
                        backgroundImage: img.style.backgroundImage,
                        backgroundRepeat: img.style.backgroundRepeat,
                        src: img.src
                    });

                    img.addEventListener('wheelzoom.destroy', destroy);

                    var destroyAll = function () {
                        removeAllListeners();
                    };

                    img.addEventListener('wheelzoom.destroyAll', destroyAll);

                    options = options || {};

                    Object.keys(defaults).forEach(function(key){
                        settings[key] = options[key] !== undefined ? options[key] : defaults[key];
                    });

                    if (img.complete) {
                        load();
                    }

                    img.addEventListener('load', load);
                };

                if (typeof window.getComputedStyle !== 'function') {
                    return function(elements) {
                        return elements;
                    };
                } else {
                    return function(elements, options) {
                        if (elements && elements.length) {
                            Array.prototype.forEach.call(elements, main, options);
                        } else if (elements && elements.nodeName) {
                            main(elements, options);
                        }
                        return elements;
                    };
                }
            }());


        function initWheelzoom(el){
            current_element = el;
            wheelzoom(current_element);

            $(current_element).dblclick(function () {
                this.dispatchEvent(new CustomEvent('wheelzoom.reset'));
            });
        }

        function removeCurrent(src){
           current_element.ng_src = src;
           current_element.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
        }

        function destroy(){
            if(current_element){
                current_element.dispatchEvent(new CustomEvent('wheelzoom.destroyAll'));
                current_element = null;
            }
        }

        function resetZoom(src){
            removeCurrent(src);
            initWheelzoom(current_element);
        }

        return {
            init        : initWheelzoom,
            destroy     : removeCurrent,
            destroyAll  : destroy,
            reset       : resetZoom
        }
    }());

    var local_Storage = function(){
        if (typeof(Storage) == "undefined") {
            return false;
        }

        function addElement(name, obj){
            localStorage.setItem(name, JSON.stringify(obj));
        }

        function getElement(name){
            return JSON.parse(localStorage.getItem(name));
        }

        function getAmount(){
            return localStorage.length;
        }

        function isStorageEmpty(){
            return (getAmount()==0);
        }


        function clearStorage(){
            localStorage.clear();
        }

        return {
            $add: addElement,
            $get: getElement,
            clear: clearStorage,
            amount: getAmount,
            isEmpty: isStorageEmpty
        }

    }();

    var notifyStorage = function(){
        var maxShowTime = 3,
            storage = local_Storage,
            notify_title = 'notifications';

        var notifications = ( storage.$get( notify_title ) )
                            ? storage.$get( notify_title )
                            : {} ;


        function allowNotify( name ){
            if(!name) return true;

            if( name in notifications ){
                if(+notifications[name] != 0){
                    +notifications[name]--;
                    saveNotifications();
                } else {
                    return false;
                }
            } else {
                notifications[name] = maxShowTime;
                saveNotifications();
            }
            return true;
        }

        function saveNotifications(){
            storage.$add(notify_title, notifications);
        }

        return {
            allowNotify : allowNotify
        }

    }();

    data.notifyStorage = notifyStorage;

    return data;

}]);






