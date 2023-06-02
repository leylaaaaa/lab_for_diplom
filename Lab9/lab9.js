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
renderer.setClearColor(new THREE.Color(0xBABFCE))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

window.renderer = renderer

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 30, 50)

var controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.5

// light
//
var light = new THREE.AmbientLight(0xF7F8FF, 0.4)
scene.add(light)

var dirlight = new THREE.DirectionalLight(0xffffff, 0.6)
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
dirlight.position.set(-20, 29, 20)
scene.add(dirlight)

var plane = new THREE.Mesh (
    new THREE.PlaneGeometry(40, 60, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xD2D6DF, side: THREE.DoubleSide })
)
plane.rotation.x = Math.PI/2 
plane.receiveShadow = true
scene.add(plane)

// 1. Logo
// 
var textureLoader = new THREE.TextureLoader()
var logo = new THREE.Mesh (
    new THREE.PlaneGeometry(7, 7, 1, 1),
    new THREE.MeshBasicMaterial({ 
        map: textureLoader.load("./images/logo.jpg"),
        side: THREE.DoubleSide
    })
)
logo.position.set(-8, 12, -3)
logo.castShadow = true
scene.add(logo)
var logoPositionTarget = { y: -3.2 }
new TWEEN.Tween(logo.position).to(logoPositionTarget, 2000)
    .repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Cubic.InOut).start()

// 2. Назва кафедри
//
var fontLoader = new THREE.FontLoader()
var text3d = undefined
fontLoader.load ( "./fonts/ProstoOne_Regular.json", font => {
    text3d = new THREE.Mesh(
        new THREE.TextGeometry("Кафедра програмної інженерії", {
            size: 1.6, height: 0.5, curveSegments: 4, font: font,
            material: 0, extrudeMaterial: 0
        }),
        new THREE.MeshPhongMaterial({
            color: 0xFEFE12, transparent: true, opacity: 0.1
        })
    )
    text3d.geometry.center()
    text3d.castShadow = true
    text3d.position.set(0, 4, -30)
    scene.add(text3d)
    new TWEEN.Tween(text3d.material).to({ opacity: 1 }, 6000)
        .easing(TWEEN.Easing.Cubic.In).delay(500).start()
    new TWEEN.Tween(text3d.position).to({ z: 15 }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut).start()
    new TWEEN.Tween(text3d.rotation).to({ x: -0.25*Math.PI}, 500)
        .easing(TWEEN.Easing.Quadratic.InOut).delay(6400).start()
})

// 3. Відеотекстура що обертається
//
var prism1 = new THREE.Mesh (
    new THREE.CylinderGeometry(6, 6, 6, 6),
    [
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
        new THREE.MeshBasicMaterial({ map: videoTexture }),
        new THREE.MeshPhongMaterial({ color: 0x404040, flatShading: true }),
    ]
)
prism1.position.set(7, 4, -5)
prism1.castShadow = prism1.receiveShadow = true
scene.add(prism1)
var prismTarget = { y: 2* Math.PI }
new TWEEN.Tween(prism1.rotation).to(prismTarget, 5000)
    .repeat(Infinity).start()


// GUI controls
var gui = new dat.GUI()

gui.add({ "play video" : true }, "play video")
    .onChange(play => {
        if (play) video.play()
        else video.pause()
    })

// render scene
//
function renderScene () {
    videoTexture.needsUpdate = true
    requestAnimationFrame(renderScene)
    controls.update()
    TWEEN.update()
    renderer.render(scene, camera)
}

renderScene()

window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
