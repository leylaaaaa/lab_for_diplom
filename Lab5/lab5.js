var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0x343538))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

window.renderer = renderer

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(50, 40, 50)
camera.lookAt(0, 5, 0)

var controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.7

var plane = new THREE.Mesh (
    new THREE.PlaneGeometry(40, 40, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xDFE2EA, side: THREE.DoubleSide })
)
plane.rotation.x = Math.PI/2 
plane.receiveShadow = true
scene.add(plane)

var prism1 = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xBAF8E5, flatShading: true })
)
prism1.position.set(4, 6, -5)
prism1.rotation.z = Math.PI / 2
prism1.castShadow = prism1.receiveShadow = true

var prism2 = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xD166FE,flatShading: true, })
)
prism2.position.set(-8, 7, 5)
prism2.castShadow = prism2.receiveShadow = true

scene.add(prism1)
scene.add(prism2)

var light = new THREE.AmbientLight(0xF7F8FF, 0.4)
scene.add(light)

var dirlight = new THREE.DirectionalLight(0xffffff, 0.75)
dirlight.castShadow = true
dirlight.shadow.camera.near = 1
dirlight.shadow.camera.far = 500
dirlight.shadow.camera.right = 50
dirlight.shadow.camera.left = -50
dirlight.shadow.camera.top  = 50
dirlight.shadow.camera.bottom = -50
dirlight.shadow.mapSize.width = 512
dirlight.shadow.mapSize.height = 512 
dirlight.shadow.radius = 4
dirlight.shadow.bias = -0.0001
dirlight.position.set(-10, 29, 10)
var Directional = new THREE.Group()
Directional.add(dirlight)
var dirhelper = new THREE.DirectionalLightHelper(dirlight)
Directional.add(dirhelper) 
scene.add(Directional)

var spotlight = new THREE.SpotLight(0xFE9845, 0.6, 160, Math.PI/6, 0.09, 1)
spotlight.position.set(12, 30, 20)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 512
spotlight.shadow.mapSize.height = 512
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 160
spotlight.shadow.radius = 4
spotlight.shadow.bias = -0.0002
var Spotlight = new THREE.Group()
Spotlight.add(spotlight)
var spothelper = new THREE.SpotLightHelper(spotlight)
Spotlight.add(spothelper)

var pointlight = new THREE.PointLight(0x88FFEE, 0.9, 40)
pointlight.castShadow = true
pointlight.position.set(7, 5, 2)
var Pointlight = new THREE.Group()
Pointlight.add(pointlight)
var pointhelper = new THREE.PointLightHelper(pointlight, 4)
Pointlight.add(pointhelper)

var gui = new dat.GUI()

var dirlightGUI = gui.addFolder("Directional light")
dirlightGUI.open()
dirlightGUI.add({ enabled: true }, "enabled")
.onChange(enabled => { 
    if (enabled) scene.add(Directional)
    else scene.remove(Directional) 
})
dirlightGUI.add(dirlight, "intensity", 0.0, 1.0, 0.05)
dirlightGUI.add(dirlight.position, "x", -30, 30, 1)
    .name("position X").onChange(() => dirhelper.update())
dirlightGUI.add(dirlight.position, "y", 0, 60, 1)
    .name("position Y").onChange(() => dirhelper.update())
dirlightGUI.add(dirlight.position, "z", -30, 30, 1)
    .name("position Z").onChange(() => dirhelper.update())

var spotlightGUI = gui.addFolder("Spot light")
spotlightGUI.open()
spotlightGUI.add({ enabled: false }, "enabled")
.onChange(enabled => { 
    if (enabled) scene.add(Spotlight)
    else scene.remove(Spotlight) 
})
spotlightGUI.add(spotlight, "intensity", 0.0, 1.0, 0.05)
spotlightGUI.add(spotlight, "angle", 0.05, 1.00)
    .onChange(() => spothelper.update())
spotlightGUI.add(spotlight, "penumbra", 0.0, 0.5)
    .onChange(() => spothelper.update())
spotlightGUI.add(spotlight, "decay", 0.0, 2.0, 0.1)
    .onChange(() => spothelper.update())
spotlightGUI.add(spotlight.position, "x", -30, 30, 1)
    .name("position X").onChange(() => spothelper.update())
spotlightGUI.add(spotlight.position, "y", 0, 60, 1)
    .name("position Y").onChange(() => spothelper.update())
spotlightGUI.add(spotlight.position, "z", -30, 30, 1)
    .name("position Z").onChange(() => spothelper.update())

var pointlightGUI = gui.addFolder("Point light")
pointlightGUI.open()
pointlightGUI.add({ enabled: false }, "enabled")
.onChange(enabled => { 
    if (enabled) scene.add(Pointlight)
    else scene.remove(Pointlight) 
})
pointlightGUI.add(pointlight, "intensity", 0.0, 1.0, 0.05)
pointlightGUI.add(pointlight.position, "x", -30, 30, 1)
    .name("position X").onChange(() => pointhelper.update())
pointlightGUI.add(pointlight.position, "y", 0, 60, 1)
    .name("position Y").onChange(() => pointhelper.update())
pointlightGUI.add(pointlight.position, "z", -30, 30, 1)
    .name("position Z").onChange(() => pointhelper.update())


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
