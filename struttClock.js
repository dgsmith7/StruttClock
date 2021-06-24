////////////////////////////////////////////
//   "Strutt Epicyclic Clock Model"
//   June 2021
//   Original code by David Gail Smith
//   Attribution:
////////////////////////////////////////////

let container;
let camera, scene, renderer;
let pointLight, directionalLight, ambientLight;
let object;
let controls;
// let gears[];
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);
	camera.position.x = 110;
	camera.position.y = 11;
	camera.position.z = 250;
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	scene.add( camera );

	// lighting
	pointLight = getPointLight( 0.8 );
	scene.add( pointLight );
	camera.add( pointLight );
	directionalLight = getDirectionalLight( 1 );
	directionalLight.position.x = 13;
	directionalLight.position.y = 10;
	directionalLight.position.z = 10;
	directionalLight.intensity = .5;
	scene.add( directionalLight );
	ambientLight = getAmbientLight( 0.4 );
	scene.add( ambientLight );

	// manager
	function loadModel() {
		object.traverse( function ( child ) {
			if ( child.isMesh ) child.material.map = texture;
		} );
		object.position.y = -5;
		scene.add( object );
	}
	const manager = new THREE.LoadingManager( loadModel );
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	// texture
	const textureLoader = new THREE.TextureLoader( manager );
	const texture = textureLoader.load( 'Assetts/fur.jpg')

	// build objects for scene
	let n1 = getNode();
	scene.add(n1);

	// models
	function onProgress( xhr ) {
		if (xhr.lengthComputable ) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log( 'model ' + Math.round(percentComplete, 2 ) + '% downloaded' );
		}
	}

	function onError() {
		console.error("An error occurred loading the model.");
	}

	const loader = new THREE.OBJLoader( manager );
	loader.load( 'Assetts/ringGear.obj', function( obj ) {
		object = obj;
		object.name = 'g1';
	}, onProgress, onError );

	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.evicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 'rgb(0, 0, 0)' );
//	renderer.shadowMap.enabled = true;
	container = renderer.domElement;

	// orbit controlls if desired
	controls = new THREE.OrbitControls( camera, container );

	document.getElementById( 'webgl' ).appendChild( container );

	// event listeners
	document.addEventListener( 'mousemove', onDocumentMouseMove );
	document.addEventListener( 'mouseclick', onDocumentMouseClick );
	window.addEventListener( 'resize', onWindowResize );
}

function animate( /* renderer,*/ scene, camera, controls ) { // get next frame and dispaly
	//renderer.render( scene, camera );
	requestAnimationFrame( animate );
		//TWEEN.update();
	render();
}

function render() { // update scene here
//	camera.position.x += ( mouseX - camera.position.x ) * .05;
//	camera.position.y += ( - mouseY - camera.position.y ) * .05;
//	camera.lookAt( object.position );
  scene.getObjectByName('g1').rotation.y += 0.005;
	renderer.render( scene, camera );
} 

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function onDocumentMouseClick( event ) {
	console.log("mouse clicked.");
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

function getNode() {
  var geometry = new THREE.SphereGeometry(1, 25, 25 );
  var material = new THREE.MeshLambertMaterial({
    emissive: 'rgb(0, 255, 0)',
    emissiveIntensity: .75,
    opacity: 0.05,
    transparent: true
  });
  var mesh = new THREE.Mesh(
    geometry,
    material 
  );
  mesh.receiveShadow = true;
  return mesh;
}
