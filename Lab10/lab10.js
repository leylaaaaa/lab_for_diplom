var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0xBABFCE))
renderer.setSize(window.innerWidth, window.innerHeight)

window.renderer = renderer

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(14, 10, 14)

var controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.5

// light
//
var light = new THREE.AmbientLight(0xF7F8FF, 0.4)
scene.add(light)

var dirlight = new THREE.DirectionalLight(0xffffff, 0.6)
dirlight.position.set(-20, 29, 20)
scene.add(dirlight)

var gridHelper = new THREE.GridHelper(10)
scene.add(gridHelper)

var axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

// compound object 
var compoundObject = new THREE.Mesh (
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial()
)
var objectParams = {
    h1: 1.5,
    h2: 2.0,
    h3: 1.5,
    r1: 1.2,
    r2: 2.2,
    r3: 1.5
} 

function buildObject() {
    const {h1, h2, h3, r1, r2, r3} = objectParams
    const x0 = compoundObject? compoundObject.position.x : 0
    const z0 = compoundObject? compoundObject.position.z : 0

    var cylinder1 = new THREE.Mesh (
        new THREE.CylinderGeometry(r1, r1, h1, 36),
        compoundObject.material
    )
    cylinder1.position.set(x0, h1/2, z0)

    var cone1 = new THREE.Mesh (
        new THREE.ConeGeometry(r2, h2, 36),
        compoundObject.material
    )
    cone1.position.set(x0, h1+h2/2, z0)

    var cone2 = new THREE.Mesh (
        new THREE.CylinderGeometry(r3, r2/2, h3, 36),
        compoundObject.material
    )
    cone2.position.set(x0, h1+h2/2+h3/2, z0)

    scene.remove(compoundObject)
    compoundObject = new ThreeBSP(cylinder1)
        .union(new ThreeBSP(cone1))
        .union(new ThreeBSP(cone2))
        .toMesh(compoundObject.material)
    scene.add(compoundObject)
}

// GUI controls
var gui = new dat.GUI()

Object.keys(objectParams).forEach(key => {
    gui.add(objectParams, key, 0.1, 5, 0.1).onChange(buildObject)
})
gui.add({ x: 0 }, "x", -10, 10, 0.1)
    .onChange(value => compoundObject.position.x = value)
gui.add({ z: 0 }, "z", -10, 10, 0.1)
    .onChange(value => compoundObject.position.z = value)

buildObject()

// render scene
//
function renderScene () {
    requestAnimationFrame(renderScene)
    controls.update()
    renderer.render(scene, camera)
}

renderScene()

window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
