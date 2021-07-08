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
var spotLight, pointLight, pointLight2;
var controls;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var orbit = 0;
var timeLapse = {
	rate: 10
};
var rotationOn = true;
var expansion = {
	intensity: 1
};

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
	window.addEventListener('resize', onWindowResize);
	animate();
}

function animate() { // get next frame and dispaly
	setTimeout(function() {
		requestAnimationFrame(animate);
	}, 1000 / 60); // fps control
	render();
}

function render() { // update scene here
	if (rotationOn == true) {
		for (const model of Object.values(models)) {
			scene.getObjectByName(model.name).rotation.y +=
				degrees_to_radians(model.rotPerSec) / (61 - (parseFloat(timeLapse.rate - 1) * ((59.0 / 9.0)) + 1)); //* escape
			scene.getObjectByName(model.name).position.y = model.yPosit * expansion.intensity;
			if (model.orbitArm != 0.0) {
				scene.getObjectByName(model.name).position.x = Math.cos(orbit) * model.orbitArm;
				scene.getObjectByName(model.name).position.z = Math.sin(orbit) * model.orbitArm;
			}
		}
		orbit += degrees_to_radians(0.1) / (61 - (parseFloat(timeLapse.rate - 1) * ((59.0 / 9.0)) + 1)); //*
		scene.updateMatrixWorld();
	}
	controls.update();
	renderer.render(scene, camera);
}

function setCams() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 25;
	camera.position.z = 25;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);
}

function setLights() {
	spotLight = getSpotLight();
	scene.add(spotLight);
	camera.add(spotLight);
	pointLight = getPointLight(0.5);
	scene.add(pointLight);
	pointLight2 = getPointLight(0.5);
	pointLight2.position.set(4.0, -1, 4.0);
	scene.add(pointLight2);
	ambientLight = getAmbientLight(2);
	scene.add(ambientLight);
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
	let material;
	// Texture cubes as background
	const tcLoader = new THREE.CubeTextureLoader();
	tcLoader.setPath('assetts/textures/cube/polishedBrass/'); // pixels power of 2
	textureCube = tcLoader.load(['posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png']);
	textureCube.encoding = THREE.sRGBEncoding;
	textureCube.mapping = THREE.CubeReflectionMapping;
	// Iterate file for models and their parameters
	for (const model of Object.values(models)) {
		loader.load('assetts/models/orig/' + model.fileName, function(object) {
			object.name = model.name;
			object.position = new THREE.Vector3();
			object.position.x = model.xPosit;
			object.position.y = model.yPosit;
			object.position.z = model.zPosit;
			object.rotation.y = parseFloat(model.yRot);
			material = new THREE.MeshStandardMaterial({
				color: parseInt(model.color),
				metalness: 0.8,
				roughness: 0.2,
				envMap: textureCube
			});
			texture = textureLoader.load('assetts/textures/' + model.textureFileName);
			object.traverse(function(child) {
				if (child.isMesh) {
					child.material = material;
				}
			});
			scene.add(object);
		}, function(xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		}, function(error) {
			console.log('An error happened:' + error);
		});
	}
}

function buildRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.evicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(0, 0, 0)');
	renderer.shadowMap.enabled = true;
	container = renderer.domElement;
}

function addOrbitControls() {
	controls = new THREE.OrbitControls(camera, container);
	controls.minDistance = 20;
	controls.maxDistance = 70;
	document.getElementById('webgl').appendChild(container);
}

function degrees_to_radians(degrees) {
	let pi = Math.PI;
	return degrees * (pi / 180);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function getPointLight() {
	let light = new THREE.PointLight(0xffffff, 2, 800, 2);
	light.position.set(0, 0, 0);
	return light;
}

function getSpotLight() {
	let light = new THREE.SpotLight(0x555555, 0.1, 0, 0.2, 1, 2);
	light.position.set(50, 500, 100);
	light.target.position.set(0, 0, 0);
	return light;
}

function getAmbientLight(intensity) {
	let light = new THREE.AmbientLight(0xffffff, intensity);
	return light;
}