var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0xC9CAD2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(50, 40, 50)
camera.lookAt(0, 5, 0)

var controls = new THREE.TrackballControls(camera, renderer.domElement)
controls.rotateSpeed = 2

var box = new THREE.Mesh (
    new THREE.BoxGeometry(40, 40, 40, 1),
    new THREE.MeshPhongMaterial({ color: 0xD2D6DF, side: THREE.BackSide })
)
box.position.set(0, 20, 0)
box.receiveShadow = true
scene.add(box)

var prism1 = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xBAF8E5, flatShading: true })
)
prism1.position.set(4, 6, -5)
prism1.rotation.z = Math.PI / 2
prism1.castShadow = prism1.receiveShadow = true

var prism2 = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xD066FE,flatShading: true, })
)
prism2.position.set(-8, 7, 5)
prism2.castShadow = prism2.receiveShadow = true

var group = new THREE.Object3D()
group.add(prism1)
group.add(prism2)
scene.add(group)

var light = new THREE.AmbientLight(0xF7F8FF, 0.4)
scene.add(light)

var ArrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-8, 11, 5), 8, undefined, 1.5, 0.8)

var GridHelper = new THREE.GridHelper(100, 20)

var AxesHelper = new THREE.AxesHelper(100)

var BoxHelper = new THREE.BoxHelper(group)

var camera2 = new THREE.PerspectiveCamera(45, 1.5, 2, 80)
var camhelper = new THREE.CameraHelper(camera2)

var CameraHelper = new THREE.Group()
CameraHelper.add(camera2)
CameraHelper.add(camhelper)
CameraHelper.position.set(-2, 20, 30)
CameraHelper.rotation.x = -Math.PI/8

var dirlight = new THREE.DirectionalLight(0xffffff, 0.75)
dirlight.castShadow = true
dirlight.shadow.camera.near = 1
dirlight.shadow.camera.far = 500
dirlight.shadow.camera.right = 20
dirlight.shadow.camera.left = -20
dirlight.shadow.camera.top  = 20
dirlight.shadow.camera.bottom = -20
dirlight.shadow.mapSize.width = 1024
dirlight.shadow.mapSize.height = 1024 
dirlight.shadow.radius = 4
dirlight.shadow.bias = -0.0001
dirlight.position.set(-10, 29, 10)

var DirectionalHelper = new THREE.Group()
DirectionalHelper.add(dirlight)
DirectionalHelper.add(new THREE.DirectionalLightHelper(dirlight)) 

var hemilight = new THREE.HemisphereLight(0xA5C9FF, 0x782100, 0.4)
var HemisphereHelper = new THREE.Group()
HemisphereHelper.add(hemilight)
HemisphereHelper.add(new THREE.HemisphereLightHelper(hemilight, 10))

var spotlight = new THREE.SpotLight(0xFE9845, 0.6, 160, Math.PI/6, 0.09, 1)
spotlight.position.set(12, 30, 20)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 512
spotlight.shadow.mapSize.height = 512
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 160
spotlight.shadow.radius = 4
spotlight.shadow.bias = -0.0002
var SpotlightHelper = new THREE.Group()
SpotlightHelper.add(spotlight)
SpotlightHelper.add(new THREE.SpotLightHelper(spotlight))

var pointlight = new THREE.PointLight(0x88FFEE, 0.9, 40)
pointlight.castShadow = true
pointlight.position.set(7, 5, 2)
var PointlightHelper = new THREE.Group()
PointlightHelper.add(pointlight)
PointlightHelper.add(new THREE.PointLightHelper(pointlight, 4))

var AllHelpers = {
    ArrowHelper,
    GridHelper,
    AxesHelper,
    BoxHelper,
    CameraHelper,
    DirectionalHelper,
    HemisphereHelper,
    SpotlightHelper,
    PointlightHelper
}

var HelpersEnabled = {
    ArrowHelper: false,
    GridHelper: false,
    AxesHelper: false ,
    BoxHelper: false,
    CameraHelper: false,
    DirectionalHelper: false,
    HemisphereHelper: false,
    SpotlightHelper: false,
    PointlightHelper: false
}

var gui = new dat.GUI()

for (var _key in AllHelpers) {
    let key = _key
    gui.add(HelpersEnabled, key).onChange(function(enabled) {
        if (enabled) scene.add(AllHelpers[key])
        else scene.remove(AllHelpers[key])
    })
} 

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
