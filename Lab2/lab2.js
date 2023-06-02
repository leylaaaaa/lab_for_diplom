var textureloader = new THREE.TextureLoader()

var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) 
    : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0xEDEDFF))
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)
    
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, 
    window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(50, 40, 50)
camera.lookAt(0, 5, 0)

var controls = new THREE.TrackballControls(camera, renderer.domElement)
controls.rotateSpeed = 2

var plane = new THREE.Mesh (
    new THREE.PlaneGeometry(20, 20, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xC9F6FE })
)
plane.rotation.x = - Math.PI / 2
scene.add(plane)

var prism = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xBAF8E5,
        transparent: true, flatShading: true, opacity: 1.0 })
)
prism.position.set(0, 7, 0)
prism.rotation.z = Math.PI / 2
scene.add(prism)

var light = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(light)
var dirlight = new THREE.DirectionalLight(0xffffff, 0.7)
dirlight.position.set(10, 12, 2)
scene.add(dirlight)

var prism_materials = {
    "Basic": new THREE.MeshBasicMaterial({
        color: 0xBAF8E5
    }),
    "Normal": new THREE.MeshNormalMaterial({ flatShading: true}),
    "Standard": new THREE.MeshStandardMaterial({
        color: 0xBAF8E5, flatShading: true
    }),
    "Phong": prism.material,
    "One texture": new THREE.MeshPhongMaterial({
        map: textureloader.load("./img/texture3.png")
    }),
    "Many textures": [
        new THREE.MeshPhongMaterial({
            map: textureloader.load("./img/texture3.png")
        }),
        new THREE.MeshPhongMaterial({
            map: textureloader.load("./img/texture1.png")
        }),
        new THREE.MeshPhongMaterial({
            map: textureloader.load("./img/texture2.png")
        })
    ],
    "With alpha map": [
        new THREE.MeshPhongMaterial({
            transparent: true,
            color: 0xE456FF,
            alphaMap: textureloader.load("./img/texture2.png"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshPhongMaterial({
            transparent: true,
            color: 0xBAF8E5,
            alphaMap: textureloader.load("./img/texture2.png"),
            side: THREE.DoubleSide
        }),
        new THREE.MeshPhongMaterial({
            transparent: true,
            color: 0xFF4400,
            alphaMap: textureloader.load("./img/texture2.png"),
            side: THREE.DoubleSide
        })
    ]
}

var parameters = {
    "Ambient light intensity": 0.4,
    "Dir. light intensity": 0.7,
    "Prism color": "#BAF8E5",
    "Prism opacity": prism.material.opacity,
    "Prism material": "Phong"
}

var gui = new dat.GUI()

gui.add(parameters, "Ambient light intensity", 0.0, 1.0, 0.1)
.onChange(value => { light.intensity = value })

gui.add(parameters, "Dir. light intensity", 0.0, 1.0, 0.1)
.onChange(value => { dirlight.intensity = value })

gui.addColor(parameters, "Prism color")
.onChange(value => { prism.material.color = new THREE.Color(value) })

gui.add(parameters, "Prism opacity", 0.05, 1.0, 0.05)
.onChange(value => { prism.material.opacity = value})

gui.add(parameters, "Prism material", Object.keys(prism_materials))
.onChange(value => { prism.material = prism_materials[value]})

function renderScene () {
    prism.rotation.y += 0.01

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
