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
//////////////////////////////////////////////////////////////////////////////////

let container;
let camera, scene, renderer;
let pointLight, directionalLight, ambientLight;
var object;
let controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var num = 0;
let orbit = 0;
let now;
let currentSec;
let lastSec;
let rate = .5; // non zero - 60 for accurate timing
//let rotationOn = false;
let rotationOn = true;

init();
animate();

function init() {
	// scene
	scene = new THREE.Scene();
	// camera
	setCams();
	// lighting
	setLights();
	// models
	loadModels();
	// renderer
	buildRenderer();
	// orbit controlls if desired
	addOrbitControls();
	// event listeners
	window.addEventListener( 'resize', onWindowResize );
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
	if (rotationOn == true) {
		for (const model of Object.values(models)) {
			scene.getObjectByName(model.name).rotation.y += degrees_to_radians(model.rotPerSec)/rate;								//* escape
			if (model.orbitArm != 0.0) {
				scene.getObjectByName(model.name).position.x = Math.cos(orbit) * model.orbitArm; 
				scene.getObjectByName(model.name).position.z = Math.sin(orbit) * model.orbitArm; 
			}
		}
		orbit += degrees_to_radians(0.1)/rate;		//*
		scene.updateMatrixWorld();
	}
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
	ambientLight = getAmbientLight( 0.7 );
	scene.add( ambientLight );
}

function loadModels() {
	const loader = new THREE.OBJLoader();
	const textureLoader = new THREE.TextureLoader();
	let texture;
	const material = new THREE.MeshPhongMaterial();
	const model =  {};
	for (const model of Object.values(models)) {
		loader.load( 'assetts/models/' + model.fileName, function ( object ) { // escape
					object.name = model.name;
					object.position = new THREE.Vector3();
					object.position.x = model.xPosit;
					object.position.y = model.yPosit;
					object.position.z = model.zPosit;
					object.rotation.y = parseFloat(model.yRot);
					texture = textureLoader.load( 'assetts/textures/' + model.textureFileName);
					object.traverse( function ( child ) {
						if ( child.isMesh ) {
							child.material = material;
							child.material.map = texture;
						}
					} );
					scene.add( object );
				}, function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				}, function ( error ) {
					console.log( 'An error happened' );
				}
			);
	}
}

function buildRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.evicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 'rgb(0, 0, 0)' );
	//	renderer.shadowMap.enabled = true;
	container = renderer.domElement;
}

function addOrbitControls() {
	controls = new THREE.OrbitControls( camera, container );
	document.getElementById( 'webgl' ).appendChild( container );
}

function degrees_to_radians( degrees ) {
	var pi = Math.PI;
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
	let light = new THREE.AmbientLight( 0xcccccc, intensity );
	return light;
}

function getHemisphereLight( intensity ) {
	let skyColor = 0xB1E1FF;  // light blue
	let groundColor = 0xB97A20;  // brownish orangelet
	light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
	return light;
}
