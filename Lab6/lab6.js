// video texture
//
var video = document.createElement("video")
video.src = "./video/FractalZoom.mp4"
video.loop = "loop"
video.muted = true
video.play()
var videoTexture = new THREE.Texture(video)
videoTexture.minFilter = THREE.LinearFilter
videoTexture.magFilter = THREE.LinearFilter
videoTexture.format = THREE.RGBFormat
videoTexture.generateMipmaps = false

// renderer, scene, camera, controls
//
var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0x343538))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

window.renderer = renderer

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-30, 60, -30)
camera.lookAt(5, 5, 5)

var controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.5

// objects
//
var plane = new THREE.Mesh (
    new THREE.PlaneGeometry(40, 40, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xD2D6DF, side: THREE.DoubleSide })
)
plane.rotation.x = Math.PI/2 
plane.receiveShadow = true
scene.add(plane)

var prism1 = new THREE.Mesh (
    new THREE.CylinderGeometry(6, 6, 6, 6),
    [
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
        new THREE.MeshBasicMaterial({ map: videoTexture }),
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
    ]
)
prism1.position.set(0, 4, -5.2)
prism1.castShadow = prism1.receiveShadow = true

var prism2 = new THREE.Mesh (
    new THREE.CylinderGeometry(6, 6, 10, 6),
    [
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x90BB97, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
    ]
)
prism2.position.set(6, 6, 5)
prism2.castShadow = prism2.receiveShadow = true

var prism3 = new THREE.Mesh (
    new THREE.CylinderGeometry(6, 6, 8, 6),
    [
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x92BB96, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
    ]
)
prism3.position.set(-6, 5, 5)
prism3.castShadow = prism3.receiveShadow = true

scene.add(prism1)
scene.add(prism2)
scene.add(prism3)

// light
//
var light = new THREE.AmbientLight(0xF7F8FF, 0.4)
scene.add(light)

var dirlight = new THREE.DirectionalLight(0xffffff, 0.7)
dirlight.castShadow = true
dirlight.shadow.camera.near = 1
dirlight.shadow.camera.far = 100
dirlight.shadow.camera.right = 50
dirlight.shadow.camera.left = -50
dirlight.shadow.camera.top  = 50
dirlight.shadow.camera.bottom = -50
dirlight.shadow.mapSize.width = 1024
dirlight.shadow.mapSize.height = 1024 
dirlight.shadow.radius = 3
dirlight.shadow.bias = -0.0001
dirlight.position.set(-10, 29, 10)
scene.add(dirlight)

// GUI controls
var gui = new dat.GUI()

gui.add({ "play video" : true}, "play video").onChange(play => {
    if (play) video.play()
    else video.pause()
})

// render scene
//
function renderScene () {
    videoTexture.needsUpdate = true
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