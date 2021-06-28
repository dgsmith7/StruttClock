//////////////////////////////////////////////////////////////////////////////////
//   "Strutt Epicyclic Clock Model"
//   June 2021
//   Original code by David Gail Smith
//   Attribution / Inspiration:
//      http://www.awci.com/wp-content/uploads/ht/2005/2005-01-web.pdf  page 12-16
//      https://www.youtube.com/watch?v=uwv7Z2I-JiI
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
let rate = 1; // non zero - 60 for accurate timing
//let rotationOn = false;
let rotationOn = true;

init();
animate();

function init() {
	// set update clocks
	now = new Date();
	currentSec = now.getSeconds();	
	lastSec = 0;

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 25;
	camera.position.z = 25;
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

	// models
	const loader = new THREE.OBJLoader();
	const textureLoader = new THREE.TextureLoader();
	let texture;
	loader.load( 'Assetts/escape.obj', function ( object ) { // escape
				object.position.x = 0;
				object.position.y = 1.5;
				object.position.z = -11.4;
				object.rotation.y = 0.55;
				object.name = 'g0';
				texture = textureLoader.load( 'Assetts/t0.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/escapePinion.obj', function ( object ) { // escape pinion
				object.position.x = 0;
				object.position.y = 1.5;
				object.position.z = -11.4;
				object.rotation.y = 0.55;
				object.name = 'g1';
				texture = textureLoader.load( 'Assetts/textures/t1.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/ringGear.obj', function ( object ) { // ring
				object.position.x = 0;
				object.position.y = 2;
				object.position.z = 0;
				object.rotation.y = 0;
				object.name = 'g2';
				texture = textureLoader.load( 'Assetts/textures/t2.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/drive.obj', function ( object ) { // drive
				object.position.x = 3.85;
				object.position.y = 1;
				object.position.z = 3.85;
				object.name = 'g3';
				texture = textureLoader.load( 'Assetts/textures/t3.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/drivePinionMinutes.obj', function ( object ) { // drive pinion minutes
				object.position.x = 0;
				object.position.y = 1;
				object.position.z = 0;
				object.rotation.y = 0.4;
				object.name = 'g4';
				texture = textureLoader.load( 'Assetts/textures/t4.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/arm.obj', function ( object ) { // arm
				object.position.x = 0;
				object.position.y = 1.5;
				object.position.z = 0;
				object.name = 'g5';
				texture = textureLoader.load( 'Assetts/textures/t5.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/planet.obj', function ( object ) { // planet
				object.position.x = -4.65;
				object.position.y = 2;
				object.position.z = 0;
				object.rotation.y = 0;
				object.name = 'g6';
				texture = textureLoader.load( 'Assetts/textures/t6.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/planetPinion.obj', function ( object ) { // planet pinion
				object.position.x = -4.65;
				object.position.y = 2;
				object.position.z = 0;
				object.rotation.y = degrees_to_radians(22.5);
				object.name = 'g7';
				texture = textureLoader.load( 'Assetts/textures/t7.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/sunFreeHour.obj', function ( object ) { // sun free hour
				object.position.x = 0;
				object.position.y = 2.5;
				object.position.z = 0;
				object.name = 'g8';
				texture = textureLoader.load( 'Assetts/textures/t8.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);
	loader.load( 'Assetts/models/sunFixed.obj', function ( object ) { // sun fixed
				object.position.x = 0;
				object.position.y = 3.0;
				object.position.z = 0;
				object.rotation.y = degrees_to_radians(90);
				object.name = 'g9';
				texture = textureLoader.load( 'Assetts/textures/t9.png')
				object.traverse( function ( child ) {
					if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}, function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			}, function ( error ) {
				console.log( 'An error happened' );
			}
		);

//	// build objects for scene
//	let n1 = getNode();
//	scene.add(n1);

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

function degrees_to_radians( degrees )
{
  var pi = Math.PI;
  return degrees * (pi/180);
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
		scene.getObjectByName('g0').rotation.y += degrees_to_radians(13.7075555555555)/rate;								//* escape
		scene.getObjectByName('g1').rotation.y += degrees_to_radians(13.7075555555555)/rate;								//* escape pinion
		scene.getObjectByName('g2').rotation.y -= degrees_to_radians(0.48955555555555)/rate;								//* ring
		scene.getObjectByName('g3').rotation.y += degrees_to_radians(.012)/rate;															//* drive
		scene.getObjectByName('g4').rotation.y -= degrees_to_radians(0.1)/rate;															//* drive pinion minutes
		scene.getObjectByName('g5').rotation.y -= degrees_to_radians(.1)/rate;															//* arm
		scene.getObjectByName('g6').rotation.y -= degrees_to_radians(0.92499999999999)/rate;								//* planet
		scene.getObjectByName('g6').position.x = Math.cos(orbit) * -4.65; //*
		scene.getObjectByName('g6').position.z = Math.sin(orbit) * -4.65; //*
		scene.getObjectByName('g7').rotation.y -= degrees_to_radians(0.92499999999999)/rate;//.9166)/rate;	//* planet pinion 
		scene.getObjectByName('g7').position.x = Math.cos(orbit) * -4.65; //*
		scene.getObjectByName('g7').position.z = Math.sin(orbit) * -4.65; //*
		orbit += degrees_to_radians(0.1)/rate;		//*
		scene.getObjectByName('g8').rotation.y -= degrees_to_radians(0.008333333333333)/rate;							//* sun free hour 
		scene.getObjectByName('g9').rotation.y -= degrees_to_radians(0)/rate;															//* sun fixed 
	}
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

