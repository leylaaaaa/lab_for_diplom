// Scene setup
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
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-30, 28, 60)

var controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(-6, 5, 0)
controls.rotateSpeed = 0.7

var plane = new THREE.Mesh (
    new THREE.PlaneGeometry(20, 30, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xDEDEDE, side: THREE.DoubleSide })
)
plane.rotation.x = Math.PI/2 
plane.position.x = -22
plane.receiveShadow = true
scene.add(plane)

var plane2 = new THREE.Mesh (
    new THREE.PlaneGeometry(20, 30, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xCFDDA3, side: THREE.DoubleSide })
)
plane2.rotation.x = Math.PI/2 
plane2.receiveShadow = true
scene.add(plane2)

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

// 1 random color change
//
var prism = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 8, 6),
    new THREE.MeshPhongMaterial({ color: 0x454545, flatShading: true })
)
prism.position.set(-22, 5, 0)
scene.add(prism)

var timer = new THREE.Clock()
var timerPeriod = 2.0
timer.start()

// 2 compound object 
//
var materials = {
    wood: new THREE.MeshPhongMaterial({ color: 0x686555, flatShading: true }),
    leaves0: new THREE.MeshPhongMaterial({ color: 0x99CC88, flatShading: true }),
    leaves1: new THREE.MeshPhongMaterial({ color: 0xA3CE84, flatShading: true }),
    leaves2: new THREE.MeshPhongMaterial({ color: 0x89CC8E, flatShading: true }),
    rope: new THREE.MeshPhongMaterial({ color: 0xCFC9BD, flatShading: true }),
    blak: new THREE.MeshPhongMaterial({ color: 0x353434, flatShading: true }) 
}

var tree = new THREE.Object3D(); {
    var stem1 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.6, 1.1, 5, 6),
        materials.wood
    )
    stem1.position.set(0, 2.5, 0)
    tree.add(stem1)

    var stem2 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.4, 0.5, 2, 6),
        materials.wood
    )
    stem2.position.set(1, 5.2, 0)
    stem2.rotation.z = -0.3*Math.PI
    tree.add(stem2)

    var stem3 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.35, 0.55, 3, 6),
        materials.wood
    )
    stem3.position.set(-1.4, 4.6, 0.6)
    stem3.rotation.y = 0.13*Math.PI
    stem3.rotation.z = 0.32*Math.PI
    tree.add(stem3)

    var branch1 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.2, 0.35, 2, 6),
        materials.wood
    )
    branch1.position.set(1.7, 6.6, 0.1)
    branch1.rotation.x = 0.05*Math.PI
    tree.add(branch1)

    var branch2 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.18, 0.33, 1.9, 6),
        materials.wood
    )
    branch2.position.set(-2.5, 6.25, 0.9)
    branch2.rotation.x = -0.08*Math.PI
    tree.add(branch2)

    var branch3 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.25, 0.5, 4, 6),
        materials.wood
    )
    branch3.position.set(-0.05, 6.89, 0.03)
    branch3.rotation.x = 0.01*Math.PI
    tree.add(branch3)

    var leaves1 = new THREE.Mesh (
        new THREE.SphereGeometry(1.35, 10, 10),
        materials.leaves1
    )
    leaves1.position.set(2.1, 8.6, 0.11)
    tree.add(leaves1)

    var leaves2 = new THREE.Mesh (
        new THREE.SphereGeometry(2.1, 10, 10),
        materials.leaves2
    )
    leaves2.position.set(-3.2, 9.0, 0.25)
    tree.add(leaves2)

    var leaves3 = new THREE.Mesh (
        new THREE.SphereGeometry(3.1, 10, 10),
        materials.leaves0
    )
    leaves3.position.set(-0.03, 10.3, -0.15)
    tree.add(leaves3)

    var leaves4 = new THREE.Mesh (
        new THREE.SphereGeometry(1.3, 10, 10),
        materials.leaves1
    )
    leaves4.position.set(-3.2, 5.6, 0.9)
    tree.add(leaves4)

    var leaves5 = new THREE.Mesh (
        new THREE.SphereGeometry(1.6, 10, 10),
        materials.leaves1
    )
    leaves5.position.set(1.1, 8, -1.2)
    tree.add(leaves5)

    var branch6 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.21, 0.36, 2.8, 6),
        materials.wood
    )
    branch6.position.set(0.2, 5.6, 1.6)
    branch6.rotation.z = -0.06*Math.PI
    branch6.rotation.x = 0.4*Math.PI
    tree.add(branch6)

    var branch7 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.12, 0.2, 1.2, 6),
        materials.wood
    )
    branch7.position.set(0.45, 6.55, 2.8)
    tree.add(branch7)

    var leaves7 = new THREE.Mesh (
        new THREE.SphereGeometry(1.64, 10, 10),
        materials.leaves2
    )
    leaves7.position.set(0.5, 8.1, 2.9)
    tree.add(leaves7)

    var rope1 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.34, 0.34, 0.17, 7),
        materials.rope
    )
    rope1.position.set(0.27, 5.7, 1.9)
    rope1.rotation.z = -0.06*Math.PI
    rope1.rotation.x = 0.4*Math.PI
    tree.add(rope1)

    var rope2 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.07, 0.07, 3.6, 6),
        materials.rope
    )
    rope2.position.set(0.274, 3.8, 1.98)
    tree.add(rope2)
    
    var rope3 = new THREE.Mesh (
        new THREE.CylinderGeometry(0.2, 0.2, 0.15, 8),
        materials.rope
    )
    rope3.rotation.z = 0.5*Math.PI
    rope3.position.set(0.274, 2.1, 1.97)
    tree.add(rope3)

    var tire = new THREE.Mesh (
        new THREE.TorusGeometry(0.46, 0.18, 8, 24),
        materials.blak
    )
    tire.position.set(0.274, 1.64, 1.97)
    // tire.rotation.x = 0.5*Math.PI
    tree.add(tire)
}
tree.position.set(0, 0, 0)
tree.children.forEach(item => { item.castShadow = item.receiveShadow = true })
scene.add(tree)

function renderScene () {
    var t = timer.getElapsedTime() 
    if (t >= timerPeriod) {
        timer.elapsedTime = t - timerPeriod
        prism.material.color.setHex(Math.random() * 0xFFFFFF)
    }

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
