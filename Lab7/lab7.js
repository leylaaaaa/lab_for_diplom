// Scene setup
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
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-30, 28, 60)
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

var light = new THREE.AmbientLight(0xF7F8FF, 0.45)
scene.add(light)

var dirlight = new THREE.DirectionalLight(0xffffff, 0.55)
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
dirlight.position.set(-8, 20, 19)
scene.add(dirlight)

// Load textures
//
var textureLoader = new THREE.TextureLoader()

var texture1 = textureLoader.load("./images/texture1.png")
texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping

var texture2 = textureLoader.load("./images/texture2.png")
texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping

var materials = {
    "Initial": [
        new THREE.MeshPhongMaterial({ color: 0x79FED4 }),
        new THREE.MeshPhongMaterial({ color: 0x107870 })
    ],
    "1 texture": [
        new THREE.MeshPhongMaterial({ map: texture2 }),
        new THREE.MeshPhongMaterial({ map: texture2 })
    ],
    "2 textures": [
        new THREE.MeshPhongMaterial({ map: texture2 }),
        new THREE.MeshPhongMaterial({ map: texture1 })
    ]
}

var gui = new dat.GUI()

// Load font and make 3d text
//
var fontLoader = new THREE.FontLoader()

var text = "Програмна\n інженерія"
var textParams = {
    size: 4,
    height: 1.5,
    curveSegments: 4,
    material: 0,
    extrudeMaterial: 1
}

var text3d = undefined

fontLoader.load ( "./fonts/ProstoOne_Regular.json", function(font) {
    textParams.font = font

    // make 3d text
    text3d = new THREE.Mesh (
        new THREE.TextGeometry(text, textParams),
        materials["Initial"]
    )
    text3d.castShadow = text3d.receiveShadow = true
    text3d.geometry.center()
    text3d.position.set(0, 8, 3)
    scene.add(text3d)

    // select materials
    gui.add({ material: "Initial" }, "material", Object.keys(materials))
        .name("Material")
        .onChange(key => { text3d.material = materials[key] })

    // change font size
    gui.add(textParams, "size", 1, 20, 0.5)
        .name("Font size")
        .onChange(size => { 
            textParams.height = size * 0.3
            text3d.geometry = new THREE.TextGeometry(text, textParams)
            text3d.geometry.center()
            text3d.position.set(0, size*2, 3)
        })
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
