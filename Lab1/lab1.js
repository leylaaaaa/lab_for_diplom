var renderer = window.WebGLRenderingContext ? 
    new THREE.WebGLRenderer({antialias:true}) 
    : new THREE.CanvasRenderer()
renderer.setClearColor(new THREE.Color(0xFBFCFE))
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

var object = new THREE.Mesh (
    new THREE.CylinderGeometry(5, 5, 10, 6),
    new THREE.MeshPhongMaterial({ color: 0xBAF8E5, flatShading: true })
)
object.position.set(0, 7, 0)
scene.add(object)

var light = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(light)
var dirlight = new THREE.DirectionalLight(0xffffff, 0.7)
dirlight.position.set(10, 12, 2)
scene.add(dirlight)

function renderScene () {
    object.rotation.x += 0.02
    object.rotation.y += 0.01

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
