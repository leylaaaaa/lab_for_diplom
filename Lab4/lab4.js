var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0xC9CAD2))
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
    new THREE.MeshPhongMaterial({ color: 0xD2D6DF, side: THREE.DoubleSide })
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
scene.add(dirlight)

var gui = new dat.GUI()

gui.add(dirlight.position, "x", -20, 20, 1).name("Dir.Light position X")
gui.add(dirlight.position, "y", 10, 30, 1).name("Dir.Light position Y")
gui.add(dirlight.position, "z", -20, 20, 1).name("Dir.Light position Z")

gui.add({"Shadow map size": 512}, "Shadow map size", [128, 256, 512, 1024])
.onChange(function(size) {
    dirlight.shadow.mapSize.width = dirlight.shadow.mapSize.height = size 
    dirlight.shadow.map.dispose()
    dirlight.shadow.map = null
})

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
