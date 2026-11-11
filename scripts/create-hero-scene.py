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
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    output = nodes.new("ShaderNodeOutputMaterial")
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
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
    "trim": material("Desk trim", (0.55, 0.62, 0.72), 0.35, 0.3),
    "accent": material("Warm accent", (0.48, 0.035, 0.045), 0.5, 0.28),
    "cable": material("Cable rubber", (0.015, 0.018, 0.025), 0.0, 0.8),
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


def cone(name, loc, radius1, radius2, depth, mat, vertices=32, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=loc,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    apply_mat(obj, mat)
    bevel = obj.modifiers.new("Soft edges", "BEVEL")
    bevel.width = 0.035
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


def cable(name, points, mat, thickness=0.022):
    curve_data = bpy.data.curves.new(name, "CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 2
    curve_data.bevel_depth = thickness
    curve_data.bevel_resolution = 3
    spline = curve_data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coords in zip(spline.bezier_points, points):
        point.co = coords
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    curve_data.materials.append(mat)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)
    return obj


def create_keyboard():
    base = cube("Keyboard base", (-0.25, 0.28, 0.82), (2.8, 0.12, 0.86), MAT["edge"], 0.06, rotation=(math.radians(-5), 0, 0))
    cube("Keyboard top plate", (-0.25, 0.36, 0.82), (2.58, 0.035, 0.68), MAT["body"], 0.035, rotation=(math.radians(-5), 0, 0))
    rows = [10, 10, 9, 8]
    for row, count in enumerate(rows):
        z = 0.54 + row * 0.16
        offset = (10 - count) * 0.075
        for col in range(count):
            width = 0.19
            if row == 3 and col in (0, count - 1):
                width = 0.34
            key_mat = MAT["blue"] if row == 0 and col in (0, count - 1) else MAT["key"]
            key = cube(f"Key {row}-{col}", (-1.17 + offset + col * 0.21, 0.40, z), (width, 0.045, 0.115), key_mat, 0.018, rotation=(math.radians(-5), 0, 0))
    cube("Space bar", (-0.25, 0.38, 1.03), (0.82, 0.045, 0.12), MAT["key"], 0.018, rotation=(math.radians(-5), 0, 0))
    cube("Keyboard status", (0.87, 0.42, 0.98), (0.12, 0.018, 0.025), MAT["mint"], 0.006)


def create_monitor():
    start_objects = set(bpy.context.scene.objects)
    cube("Monitor housing", (0, 2.1, 0), (3.9, 2.55, 0.28), MAT["body"], 0.14)
    cube("Monitor inner frame", (0, 2.1, 0.17), (3.56, 2.2, 0.06), MAT["edge"], 0.06)
    cube("Monitor glass", (0, 2.1, 0.215), (3.32, 1.98, 0.025), MAT["screen"], 0.025)
    cube("Screen mint accent", (-0.92, 2.75, 0.24), (1.18, 0.045, 0.012), MAT["mint"], 0.01)
    cube("Screen blue accent", (-1.08, 2.42, 0.24), (0.7, 0.045, 0.012), MAT["blue"], 0.01)
    cube("Screen panel", (0.54, 2.32, 0.24), (0.82, 0.48, 0.012), MAT["blue"], 0.02)
    cube("Screen footer", (-0.38, 1.68, 0.24), (1.68, 0.035, 0.012), MAT["blue"], 0.01)
    uv_sphere("Screen status", (1.23, 2.45, 0.25), (0.07, 0.07, 0.02), MAT["mint"])
    cube("Monitor webcam", (0, 3.18, 0.22), (0.22, 0.035, 0.035), MAT["edge"], 0.012)
    uv_sphere("Monitor webcam lens", (0, 3.18, 0.245), (0.018, 0.018, 0.008), MAT["mint"])
    cube("Monitor lower light", (0, 0.92, 0.22), (0.82, 0.018, 0.012), MAT["blue"], 0.006)
    cube("Monitor neck", (0, 0.62, 0), (0.36, 1.12, 0.32), MAT["accent"], 0.04)
    cube("Monitor foot", (0, 0.03, -0.02), (1.56, 0.18, 0.88), MAT["accent"], 0.07, rotation=(math.radians(-3), 0, 0))
    pivot = Vector((0, 1.55, 0))
    turn = Matrix.Translation(pivot) @ Matrix.Rotation(math.radians(-6), 4, "Y") @ Matrix.Translation(-pivot)
    for obj in set(bpy.context.scene.objects) - start_objects:
        if obj.type == "MESH":
            obj.matrix_world = turn @ obj.matrix_world


def create_speakers():
    for x in (-2.15, 2.15):
        cube(f"Speaker {x}", (x, 0.53, 0.12), (0.48, 1.02, 0.62), MAT["body"], 0.07)
        cylinder(f"Speaker cone {x}", (x, 0.58, -0.205), 0.15, 0.025, MAT["edge"], rotation=(math.radians(90), 0, 0))
        uv_sphere(f"Speaker light {x}", (x, 0.82, -0.225), (0.035, 0.035, 0.018), MAT["mint"])


def create_mouse():
    uv_sphere("Mouse shell", (1.55, 0.34, 0.72), (0.28, 0.17, 0.42), MAT["edge"])
    cube("Mouse center seam", (1.55, 0.50, 0.75), (0.018, 0.018, 0.34), MAT["body"], 0.006, rotation=(math.radians(-4), 0, 0))
    cube("Mouse wheel", (1.55, 0.51, 0.79), (0.055, 0.025, 0.14), MAT["mint"], 0.012, rotation=(math.radians(-4), 0, 0))
    cube("Mouse light", (1.55, 0.18, 0.52), (0.12, 0.012, 0.018), MAT["blue"], 0.006)


def create_lamp():
    cylinder("Lamp base", (-3.0, 0.25, -0.1), 0.48, 0.08, MAT["lamp"], rotation=(math.radians(90), 0, 0))
    cube("Lamp lower arm", (-3.0, 1.17, -0.1), (0.11, 1.82, 0.11), MAT["lamp"], 0.035, rotation=(0, 0, math.radians(-8)))
    uv_sphere("Lamp lower joint", (-2.88, 2.03, -0.1), (0.13, 0.13, 0.13), MAT["accent"])
    cube("Lamp upper arm", (-2.55, 2.45, -0.1), (0.11, 1.18, 0.11), MAT["lamp"], 0.035, rotation=(0, 0, math.radians(42)))
    uv_sphere("Lamp upper joint", (-2.14, 2.83, -0.1), (0.12, 0.12, 0.12), MAT["accent"])
    cone("Lamp shade", (-1.98, 2.72, -0.1), 0.46, 0.24, 0.62, MAT["lamp"], vertices=32, rotation=(math.radians(90), 0, math.radians(62)))
    uv_sphere("Lamp bulb", (-1.86, 2.56, -0.27), (0.13, 0.13, 0.13), MAT["mint"])


def create_plant():
    cylinder("Plant pot", (2.95, 0.42, 0.1), 0.36, 0.5, MAT["pot"], rotation=(math.radians(90), 0, 0))
    for i in range(7):
        angle = i * math.tau / 7
        x = 2.95 + math.cos(angle) * 0.22
        z = 0.1 + math.sin(angle) * 0.18
        leaf = uv_sphere(f"Leaf {i}", (x, 0.88 + (i % 3) * 0.13, z), (0.18, 0.06, 0.3), MAT["plant"])
        leaf.rotation_euler.y = angle


def create_desk():
    cube("Desk", (0, 0, 0), (8.8, 0.32, 4.6), MAT["desk"], 0.12)
    cube("Desk front trim", (0, -0.19, -2.22), (8.46, 0.18, 0.16), MAT["trim"], 0.035)
    cube("Desk rear trim", (0, -0.19, 2.22), (8.46, 0.18, 0.16), MAT["trim"], 0.035)
    for x in (-3.42, 3.42):
        cube("Trestle front leg", (x, -1.35, -1.48), (0.3, 2.8, 0.3), MAT["edge"], 0.055, rotation=(math.radians(-14), 0, 0))
        cube("Trestle rear leg", (x, -1.35, 1.48), (0.3, 2.8, 0.3), MAT["edge"], 0.055, rotation=(math.radians(14), 0, 0))
        cube("Trestle brace", (x, -1.52, 0), (0.34, 0.24, 3.05), MAT["edge"], 0.05)
        cube("Trestle top", (x, -0.26, 0), (0.38, 0.24, 3.65), MAT["edge"], 0.05)
    cube("Desk cable tray", (0, -0.3, 1.3), (2.4, 0.16, 0.54), MAT["body"], 0.05)
    cube("Desk edge light", (0, 0.2, -2.28), (8.0, 0.025, 0.025), MAT["blue"], 0.01)


def create_cables():
    cable("Mouse cable", [(1.55, 0.48, 0.58), (1.95, 0.24, 0.72), (2.35, 0.22, 1.05), (2.95, 0.2, 1.58)], MAT["cable"], 0.018)
    cable("Monitor cable", [(0.72, 0.25, 0.12), (1.65, 0.18, 0.18), (2.9, 0.17, 0.82), (4.25, 0.12, 1.82)], MAT["accent"], 0.024)
    cable("Desk cable one", [(4.12, 0.05, 1.68), (4.5, -0.45, 1.88), (4.75, -1.35, 2.25), (5.4, -2.15, 2.65)], MAT["cable"], 0.025)
    cable("Desk cable two", [(3.9, 0.04, 1.88), (4.35, -0.58, 2.08), (4.6, -1.5, 2.52), (5.25, -2.25, 2.92)], MAT["cable"], 0.02)


def setup_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    create_desk()
    create_monitor()
    create_speakers()
    create_keyboard()
    create_mouse()
    create_lamp()
    create_plant()
    create_cables()

    # The modeling helpers use Y as the readable "up" axis. Convert the finished
    # asset to Blender's Z-up convention before setting the camera and lights.
    axis_fix = Matrix.Rotation(math.radians(90), 4, "X")
    for obj in list(bpy.context.scene.objects):
        if obj.type == "MESH":
            obj.matrix_world = axis_fix @ obj.matrix_world

    bpy.ops.object.camera_add(location=(7.2, -15.0, 7.8))
    camera = bpy.context.object
    camera.name = "Hero Camera"
    bpy.context.scene.camera = camera
    target = Vector((0, 0, 0.75))
    direction = target - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 50

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

    bpy.ops.object.light_add(type="AREA", location=(0, -6.5, 1.2))
    lower_fill = bpy.context.object
    lower_fill.name = "Desk structure fill"
    lower_fill.data.energy = 180
    lower_fill.data.size = 5.5
    lower_fill.data.color = (0.32, 0.42, 0.7)
    lower_fill.rotation_euler = (Vector((0, 0, -1.1)) - lower_fill.location).to_track_quat("-Z", "Y").to_euler()

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
