import bpy
import math
import os
from mathutils import Matrix, Vector


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT = os.path.join(ROOT, "public", "models", "hero-workstation.glb")


def material(name, color, metallic=0.0, roughness=0.5, emission=None):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
        bsdf.inputs["Emission Strength"].default_value = 2.5
    return mat


MAT = {
    "body": material("Body navy", (0.025, 0.045, 0.09), 0.72, 0.24),
    "edge": material("Edge graphite", (0.07, 0.09, 0.14), 0.55, 0.28),
    "screen": material("Screen glass", (0.012, 0.04, 0.105), 0.25, 0.12),
    "desk": material("Desk charcoal", (0.035, 0.045, 0.065), 0.2, 0.38),
    "key": material("Keys", (0.16, 0.19, 0.24), 0.3, 0.48),
    "mint": material("Mint light", (0.18, 0.9, 0.7), 0.15, 0.24, (0.18, 0.9, 0.7)),
    "blue": material("Blue light", (0.12, 0.3, 0.85), 0.2, 0.28, (0.08, 0.2, 0.7)),
    "plant": material("Plant", (0.06, 0.25, 0.12), 0.0, 0.72),
    "pot": material("Pot", (0.06, 0.07, 0.09), 0.25, 0.42),
    "lamp": material("Lamp", (0.02, 0.025, 0.035), 0.7, 0.24),
}


def apply_mat(obj, mat):
    obj.data.materials.append(mat)
    return obj


def cube(name, loc, scale, mat, bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = (scale[0] / 2, scale[1] / 2, scale[2] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Soft edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    apply_mat(obj, mat)
    return obj


def cylinder(name, loc, radius, depth, mat, vertices=32, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    apply_mat(obj, mat)
    bevel = obj.modifiers.new("Soft edges", "BEVEL")
    bevel.width = min(radius * 0.16, 0.06)
    bevel.segments = 3
    return obj


def uv_sphere(name, loc, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_mat(obj, mat)
    return obj


def create_keyboard():
    base = cube("Keyboard base", (0.0, 0.77, -0.82), (2.8, 0.12, 0.86), MAT["edge"], 0.06, rotation=(math.radians(-5), 0, 0))
    rows = [10, 10, 9, 8]
    for row, count in enumerate(rows):
        z = -0.54 - row * 0.16
        offset = (10 - count) * 0.075
        for col in range(count):
            width = 0.19
            if row == 3 and col in (0, count - 1):
                width = 0.34
            key = cube(f"Key {row}-{col}", (-0.92 + offset + col * 0.21, 0.865, z), (width, 0.045, 0.115), MAT["key"], 0.018, rotation=(math.radians(-5), 0, 0))
    cube("Space bar", (0.0, 0.865, -1.03), (0.82, 0.045, 0.12), MAT["key"], 0.018, rotation=(math.radians(-5), 0, 0))


def create_monitor():
    cube("Monitor housing", (0, 2.1, 0), (3.9, 2.55, 0.28), MAT["body"], 0.14)
    cube("Monitor inner frame", (0, 2.1, 0.17), (3.56, 2.2, 0.06), MAT["edge"], 0.06)
    cube("Monitor glass", (0, 2.1, 0.215), (3.32, 1.98, 0.025), MAT["screen"], 0.025)
    cube("Screen mint accent", (-0.92, 2.75, 0.24), (1.18, 0.045, 0.012), MAT["mint"], 0.01)
    cube("Screen blue accent", (-1.08, 2.42, 0.24), (0.7, 0.045, 0.012), MAT["blue"], 0.01)
    cube("Screen panel", (0.54, 2.32, 0.24), (0.82, 0.48, 0.012), MAT["blue"], 0.02)
    cube("Screen footer", (-0.38, 1.68, 0.24), (1.68, 0.035, 0.012), MAT["blue"], 0.01)
    uv_sphere("Screen status", (1.23, 2.45, 0.25), (0.07, 0.07, 0.02), MAT["mint"])
    cube("Monitor neck", (0, 0.62, 0), (0.36, 1.12, 0.32), MAT["body"], 0.04)
    cube("Monitor foot", (0, 0.03, -0.02), (1.56, 0.18, 0.88), MAT["edge"], 0.07, rotation=(math.radians(-3), 0, 0))


def create_mouse():
    mouse = uv_sphere("Mouse", (1.62, 0.82, -0.65), (0.28, 0.13, 0.42), MAT["edge"])
    mouse.rotation_euler.x = math.radians(-5)
    cube("Mouse wheel", (1.62, 0.98, -0.58), (0.05, 0.025, 0.14), MAT["mint"], 0.01)


def create_lamp():
    cylinder("Lamp base", (-3.0, 0.28, -0.1), 0.48, 0.08, MAT["lamp"])
    cylinder("Lamp arm", (-3.0, 1.45, -0.1), 0.06, 2.25, MAT["lamp"], rotation=(0, math.radians(-12), 0))
    cylinder("Lamp shade", (-2.78, 2.62, -0.1), 0.38, 0.55, MAT["lamp"], vertices=32, rotation=(math.radians(12), 0, 0))
    uv_sphere("Lamp bulb", (-2.78, 2.48, -0.28), (0.12, 0.12, 0.12), MAT["mint"])


def create_plant():
    cylinder("Plant pot", (2.95, 0.42, 0.1), 0.36, 0.5, MAT["pot"])
    for i in range(7):
        angle = i * math.tau / 7
        x = 2.95 + math.cos(angle) * 0.22
        z = 0.1 + math.sin(angle) * 0.18
        leaf = uv_sphere(f"Leaf {i}", (x, 0.88 + (i % 3) * 0.13, z), (0.18, 0.06, 0.3), MAT["plant"])
        leaf.rotation_euler.y = angle


def setup_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    cube("Desk", (0, 0, 0), (8.8, 0.32, 4.6), MAT["desk"], 0.12)
    cube("Desk edge light", (0, 0.2, -2.28), (8.0, 0.025, 0.025), MAT["blue"], 0.01)
    create_monitor()
    create_keyboard()
    create_mouse()
    create_lamp()
    create_plant()

    # The modeling helpers use Y as the readable "up" axis. Convert the finished
    # asset to Blender's Z-up convention before setting the camera and lights.
    axis_fix = Matrix.Rotation(math.radians(90), 4, "X")
    for obj in list(bpy.context.scene.objects):
        if obj.type == "MESH":
            obj.matrix_world = axis_fix @ obj.matrix_world

    bpy.ops.object.camera_add(location=(5.4, -11.5, 4.4))
    camera = bpy.context.object
    camera.name = "Hero Camera"
    bpy.context.scene.camera = camera
    target = Vector((0, 0, 1.45))
    direction = target - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 58

    bpy.ops.object.light_add(type="AREA", location=(1.5, 6.5, 4.5))
    key = bpy.context.object
    key.location = (3.5, -4.5, 7.0)
    key.name = "Key light"
    key.data.energy = 420
    key.data.shape = "DISK"
    key.data.size = 5.0
    key.data.color = (0.45, 0.62, 1.0)
    key.rotation_euler = (Vector((0, 0, 1.2)) - key.location).to_track_quat("-Z", "Y").to_euler()

    bpy.ops.object.light_add(type="AREA", location=(-4.2, 3.5, 2.5))
    fill = bpy.context.object
    fill.location = (-4.2, -2.5, 4.0)
    fill.name = "Mint fill"
    fill.data.energy = 220
    fill.data.size = 3.0
    fill.data.color = (0.2, 1.0, 0.75)
    fill.rotation_euler = (Vector((0, 0, 1.1)) - fill.location).to_track_quat("-Z", "Y").to_euler()

    world = bpy.context.scene.world
    world.color = (0.003, 0.005, 0.012)
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.003, 0.005, 0.012, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.18

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 50
    scene.render.filepath = os.path.join(ROOT, "public", "models", "hero-workstation-preview.png")
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.look = "AgX - Medium High Contrast"

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "public", "models", "hero-workstation.blend"))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "public", "models", "hero-workstation.blend"))
    bpy.ops.export_scene.gltf(filepath=OUTPUT, export_format="GLB", export_materials="EXPORT", export_cameras=False, export_lights=False)
    bpy.ops.render.render(write_still=True)


setup_scene()
