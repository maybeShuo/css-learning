
var renderer;

function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 1500;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}

var cube;
function initObject() {

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors} );
    var color1 = new THREE.Color( 0x444444 );
    var color2 = new THREE.Color( 0xFF0000 );
    // var color3 = new THREE.Color( 0x0767b8 );

    // 线的材质可以由2点的颜色决定
    var p1 = new THREE.Vector3( -500, 0, 0 );
    var p2 = new THREE.Vector3(  500, 0, 0 );

    geometry.vertices.push(p1);
    geometry.vertices.push(p2);

    geometry.colors.push( color1, color2);

    for (var i = 0; i <= 20; i++) {
        var line1 = new THREE.Line( geometry, material, THREE.LineSegments );
        line1.position.z = ( i * 50 ) - 500;
        scene.add(line1);

        var line2 = new THREE.Line( geometry, material, THREE.LineSegments );
        line2.position.x = ( i * 50 ) - 500;
        line2.rotation.y = 90 * Math.PI / 180;
        scene.add(line2);
    }

    // var line = new THREE.Line( geometry, material, THREE.LinePieces );
    // scene.add(line);
}

function render()
{
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    render();
}

threeStart();
