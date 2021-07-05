//////////////////////////////////////////////////////////////////////////////////
//   "Strutt Epicyclic Clock Model"
//   June 2021
//   Original code by David Gail Smith
//   Attribution / Inspiration:
//      Horological Times, January 2005 Pages 12-16
//          http://www.awci.com/wp-content/uploads/ht/2005/2005-01-web.pdf
//      Mechanical Principle - Ralph Steiner
//          https://www.youtube.com/watch?v=mkQ2pXkYjRM
//      Ken Kuo's Youtube video of Strutt's clock
//          https://www.youtube.com/watch?v=uwv7Z2I-JiI
//      A real one
//          https://www.lainewatches.com/strutt-clock
//      Very helpful site
//          https://threejsfundamentals.org
//////////////////////////////////////////////////////////////////////////////////

var container;
var camera, scene, renderer;
var pointLight, directionalLight, ambientLight;
var object;
var controls;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var num = 0;
var orbit = 0;
var now;
var currentSec;
var lastSec;
//var rate = 10; // non zero - 60 for accurate timing
var timeLapse = { rate : 10 };
//var rotationOn = false;
var rotationOn = true;
var expansion = { intensity : 1 };

//  var twn = [];
//  var change = true;
//  var twnLen = 20000;

init();
animate();

function init() {
	// scene
	scene = new THREE.Scene();
	// camera
	setCams();
	// lighting
	setLights();
	// GUI
	setupGUI();
	// models
	loadAssets();
	// renderer
	buildRenderer();
	// orbit controlls if desired
	addOrbitControls();
	// event listeners
	window.addEventListener( 'resize', onWindowResize );
	animate();
}

function animate( /* renderer,*/ scene, camera, controls ) { // get next frame and dispaly
	//renderer.render( scene, camera );
	//	requestAnimationFrame( animate );
	//TWEEN.update();
	setTimeout( function() {
		requestAnimationFrame( animate );
	}, 1000 / 60);  // fps control

	render();
}

function render() { // update scene here
	//	camera.position.x += ( mouseX - camera.position.x ) * .05;
	//	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	//	camera.lookAt( object.position );

//	    twn[ang] = new TWEEN.Tween(coords)
//        .to({x: posit.x, y: posit.y, z: posit.z}, twnLen)
//        .easing(TWEEN.Easing.Cubic.InOut)
//        .start();


	if (rotationOn == true) {
		for (const model of Object.values(models)) {
			scene.getObjectByName(model.name).rotation.y += 
				degrees_to_radians(model.rotPerSec)/(61 - (parseFloat(timeLapse.rate-1) * ((59.0/9.0)) + 1));								//* escape
			scene.getObjectByName(model.name).position.y = model.yPosit * expansion.intensity;
			if (model.orbitArm != 0.0) {
				scene.getObjectByName(model.name).position.x = Math.cos(orbit) * model.orbitArm; 
				scene.getObjectByName(model.name).position.z = Math.sin(orbit) * model.orbitArm; 
			}
		}
		orbit += degrees_to_radians(0.1)/(61 - (parseFloat(timeLapse.rate-1) * ((59.0/9.0)) + 1));		//*
		scene.updateMatrixWorld();
	}

	controls.update();
//	    TWEEN.update();

	renderer.render( scene, camera );
} 

function setCams() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 25;
	camera.position.z = 25;
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	scene.add( camera );
}

function setLights() {
	pointLight = getPointLight( 0.8 );
	scene.add( pointLight );
	camera.add( pointLight );
	directionalLight = getDirectionalLight( 0.5 );
	directionalLight.position.set(-7, 5, -3);
	directionalLight.target.position.set(8, -2, 4);
	scene.add( directionalLight );
	ambientLight = getAmbientLight( 1 );
	scene.add( ambientLight );
}

function setupGUI() {
  var gui = new dat.GUI();
  gui.add(expansion, 'intensity', 1, 10).name("Expansion");
  gui.add(timeLapse, 'rate', 1, 10).name("Speed of lapse");
}

function loadAssets() {
	const loader = new THREE.OBJLoader();
	const textureLoader = new THREE.TextureLoader();
	let texture;
//	let material = new THREE.MeshPhongMaterial({ 
//		color : 0xFF0000, 
//		shininess : 150,
//		flatShading : true,
//		emmisive : 0x0000FF,
//		emmisiveIntensity : 1,
//		wireframe : false
//	});

let material;

//				// Texture cubes as background
				const tcLoader = new THREE.CubeTextureLoader();
				tcLoader.setPath( 'assetts/textures/cube/polishedBrass/' );  // pixels power of 2
				textureCube = tcLoader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
				textureCube.encoding = THREE.sRGBEncoding;
//				textureCube.mapping = THREE.CubeRefractionMapping;
				textureCube.mapping = THREE.CubeReflectionMapping;
//				textureEquirec = textureLoader.load( 'textures/2294472375_24a3b8ef46_o.jpg' );
//				textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
//				textureEquirec.encoding = THREE.sRGBEncoding;
//				scene.background = textureCube;
					material = new THREE.MeshLambertMaterial( { envMap: textureCube } );
//				//

	for (const model of Object.values(models)) {
		loader.load( 'assetts/models/orig/' + model.fileName, function ( object ) { // escape
			object.name = model.name;
			object.position = new THREE.Vector3();
			object.position.x = model.xPosit;
			object.position.y = model.yPosit;
			object.position.z = model.zPosit;
			object.rotation.y = parseFloat(model.yRot);
//			material = new THREE.MeshPhongMaterial({ side:THREE.doubleSide });  // comment out for cube bg
			texture = textureLoader.load( 'assetts/textures/' + model.textureFileName);
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.material = material;
//					child.material.map = texture;  // comment out for cube bg
				} else {
					child.wireframe = true;
				}
			} );
			console.log( material );
			console.log( texture );
			scene.add( object );
		}, function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		}, function ( error ) {
			console.log( 'An error happened' );
		} );
	}
}

function buildRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias:true });
	renderer.setPixelRatio( window.evicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 'rgb(0, 0, 0)' );
	//	renderer.shadowMap.enabled = true;
	container = renderer.domElement;
}

function addOrbitControls() {
	controls = new THREE.OrbitControls( camera, container );
//	controls.autoRotate = true;
	document.getElementById( 'webgl' ).appendChild( container );
}

function degrees_to_radians( degrees ) {
	let pi = Math.PI;
	return degrees * (pi/180);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalyY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function getPointLight( intensity ) {
	let light = new THREE.PointLight( 0xffffff, intensity );
	light.castShadow = true;
	return light;
}

function getDirectionalLight( intensity ) {
	let light = new THREE.DirectionalLight( 0xffffff, intensity );
	light.castShadow = true;
	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;
	return light;
}

function getAmbientLight( intensity ) {
	let light = new THREE.AmbientLight( 0xaaaaaa, intensity );
	return light;
}

function getHemisphereLight( intensity ) {
	let skyColor = 0xB1E1FF;  // light blue
	let groundColor = 0xB97A20;  // brownish orangelet
	light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
	return light;
}
