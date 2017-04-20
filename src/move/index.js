var canvasElement = document.getElementById('canvas-frame');
var width = canvasElement.clientWidth;
var height = canvasElement.clientHeight;

var renderer;

function initThree() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    canvasElement.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

var scene;

function initScene() {
    scene = new THREE.Scene();
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
}

var light;

function initLight() {
    light = new THREE.AmbientLight(0xFFFFFF);
    light.position.set(100, 100, 200);
    scene.add(light);
    light = new THREE.PointLight(0x00FF00);
    light.position.set(0, 0, 300);
    scene.add(light);
}

var cube;
var mesh;

function initObject() {
    var geometry = new THREE.CylinderGeometry( 100, 150, 400);
    var material = new THREE.MeshLambertMaterial( { color: 0xFFFF00} );
    mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh);
}

function animation() {
    //renderer.clear();
    mesh.position.x -= 1;
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}


function startThree() {
    initThree();
    initScene();
    initCamera();
    initLight();
    initObject();
    animation();
}

startThree();

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

    stats.begin();

	// monitored code goes here

    stats.end();

    requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
