#!/usr/bin/env python3
"""Render the generated Open Micro GLB with production materials in Blender."""

from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def arguments() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--resolution", type=int, default=2048)
    parser.add_argument("--samples", type=int, default=128)
    return parser.parse_args(argv)


def set_input(shader: bpy.types.ShaderNodeBsdfPrincipled, name: str, value: object) -> None:
    socket = shader.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def material(
    name: str,
    color: tuple[float, float, float, float],
    *,
    metallic: float = 0.0,
    roughness: float = 0.35,
    transmission: float = 0.0,
    emission: tuple[float, float, float, float] | None = None,
    emission_strength: float = 0.0,
    microtexture: float = 0.0,
    specular_ior_level: float = 0.5,
) -> bpy.types.Material:
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    nodes = result.node_tree.nodes
    links = result.node_tree.links
    shader = nodes.get("Principled BSDF")
    set_input(shader, "Base Color", color)
    set_input(shader, "Metallic", metallic)
    set_input(shader, "Roughness", roughness)
    set_input(shader, "IOR", 1.46)
    set_input(shader, "Specular IOR Level", specular_ior_level)
    set_input(shader, "Transmission Weight", transmission)
    if emission is not None:
        set_input(shader, "Emission Color", emission)
        set_input(shader, "Emission Strength", emission_strength)
    if microtexture > 0:
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 145.0
        noise.inputs["Detail"].default_value = 2.0
        noise.inputs["Roughness"].default_value = 0.72
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = microtexture
        bump.inputs["Distance"].default_value = 0.000025
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return result


def assign(obj: bpy.types.Object, finish: bpy.types.Material) -> None:
    obj.data.materials.clear()
    obj.data.materials.append(finish)


def duplicate_mesh(obj: bpy.types.Object, name: str) -> bpy.types.Object:
    duplicate = obj.copy()
    duplicate.data = obj.data.copy()
    duplicate.name = name
    obj.users_collection[0].objects.link(duplicate)
    return duplicate


def world_top(obj: bpy.types.Object) -> float:
    return max((obj.matrix_world @ Vector(corner)).z for corner in obj.bound_box)


def apply_boolean(obj: bpy.types.Object, cutter: bpy.types.Object, operation: str) -> None:
    modifier = obj.modifiers.new(name=f"legend-{operation.lower()}", type="BOOLEAN")
    modifier.operation = operation
    modifier.solver = "EXACT"
    modifier.object = cutter
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.select_set(False)


def flush_keycap_legends(parts: list[bpy.types.Object]) -> None:
    by_name = {obj.name: obj for obj in parts}
    legends = [obj for obj in parts if obj.name.endswith("-legend")]
    for legend in legends:
        keycap = by_name[legend.name.removesuffix("-legend")]
        keycap_source = duplicate_mesh(keycap, f"{keycap.name}-flush-source")
        keycap_top = world_top(keycap_source)
        legend_tool = duplicate_mesh(legend, f"{legend.name}-flush-tool")
        apply_boolean(keycap, legend_tool, "DIFFERENCE")
        apply_boolean(legend, keycap_source, "INTERSECT")
        bpy.context.view_layer.update()
        legend_top = world_top(legend)
        bpy.data.objects.remove(legend_tool, do_unlink=True)
        bpy.data.objects.remove(keycap_source, do_unlink=True)

        if legend_top > keycap_top + 1e-7:
            raise RuntimeError(f"Legend protrudes above keycap: {legend.name}")
    print(f"Partitioned {len(legends)} keycaps into bodies and flush two-color legend inlays")


def look_at(obj: bpy.types.Object, target: tuple[float, float, float]) -> None:
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def area_light(
    name: str,
    location: tuple[float, float, float],
    target: tuple[float, float, float],
    energy: float,
    size: float,
    color: tuple[float, float, float],
) -> bpy.types.Object:
    data = bpy.data.lights.new(name, type="AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def remove_stage() -> None:
    for obj in list(bpy.context.scene.objects):
        if obj.name.startswith("stage-"):
            bpy.data.objects.remove(obj, do_unlink=True)


def stage(
    *,
    background: tuple[float, float, float, float],
    ground: bpy.types.Material,
    target: tuple[float, float, float],
    camera_location: tuple[float, float, float],
    lens: float,
) -> bpy.types.Object:
    remove_stage()
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("Open Micro studio")
        bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = background
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.4

    bpy.ops.mesh.primitive_plane_add(size=2, location=(0.048, 0.048, -0.00205))
    plane = bpy.context.object
    plane.name = "stage-ground"
    assign(plane, ground)

    camera_data = bpy.data.cameras.new("stage-camera")
    camera = bpy.data.objects.new("stage-camera", camera_data)
    bpy.context.collection.objects.link(camera)
    camera.location = camera_location
    camera.data.lens = lens
    camera.data.sensor_width = 36
    look_at(camera, target)
    bpy.context.scene.camera = camera

    area_light("stage-key", (-0.095, -0.1, 0.195), target, 4.5, 0.12, (1.0, 0.91, 0.82))
    area_light("stage-fill", (0.175, 0.09, 0.12), target, 2.5, 0.095, (0.79, 0.88, 1.0))
    area_light("stage-rim", (0.055, 0.21, 0.155), target, 4, 0.078, (0.75, 0.86, 1.0))
    area_light("stage-front", (0.02, -0.14, 0.07), target, 1.5, 0.07, (1.0, 0.97, 0.91))
    return camera


def render(path: Path) -> None:
    scene = bpy.context.scene
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def main() -> None:
    args = arguments()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(args.model.resolve()))

    parts = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    roots: set[bpy.types.Object] = set()
    for obj in parts:
        root = obj
        while root.parent is not None:
            root = root.parent
        roots.add(root)
    for root in roots:
        root.scale = tuple(value * 0.001 for value in root.scale)
    names = {obj.name for obj in parts}
    required = {"lower-enclosure", "top-plate", "main-pcb", "encoder-knob", "joystick-cap", "touch-puck"}
    missing = required - names
    keycaps = [obj for obj in parts if obj.name.startswith("keycap-") and not obj.name.endswith("-legend")]
    legends = [obj for obj in parts if obj.name.endswith("-legend")]
    if missing or len(keycaps) != 12 or len(legends) != 12:
        raise RuntimeError(f"Unexpected CAD assembly: missing={sorted(missing)}, keycaps={len(keycaps)}, legends={len(legends)}")
    flush_keycap_legends(parts)

    silver = material("Silver bead-blasted aluminum", (0.4, 0.44, 0.49, 1), metallic=0.88, roughness=0.3, microtexture=0.15)
    brushed_steel = material("Satin steel", (0.32, 0.36, 0.41, 1), metallic=0.9, roughness=0.24, microtexture=0.08)
    keycap_white = material("Warm white keycaps", (0.72, 0.705, 0.68, 1), roughness=0.32, microtexture=0.035)
    graphite = material("Graphite legends", (0.001, 0.001, 0.0015, 1), roughness=0.62, specular_ior_level=0.0)
    black = material("Black polymer", (0.018, 0.022, 0.03, 1), roughness=0.34, microtexture=0.025)
    frosted = material("Frosted polycarbonate", (0.78, 0.88, 0.95, 1), roughness=0.42, transmission=0.28, microtexture=0.12)
    touch = material("Touch surface", (0.48, 0.74, 1.0, 1), roughness=0.28, transmission=0.2, emission=(0.18, 0.48, 1.0, 1), emission_strength=0.16)
    pcb = material("PCB", (0.025, 0.18, 0.13, 1), metallic=0.15, roughness=0.38)
    copper = material("Copper", (0.44, 0.15, 0.055, 1), metallic=0.82, roughness=0.28)
    gold = material("Gold contacts", (0.72, 0.4, 0.055, 1), metallic=0.92, roughness=0.22)
    white_component = material("Ceramic", (0.82, 0.82, 0.79, 1), roughness=0.3)
    led = material("LED lens", (0.46, 0.84, 1.0, 1), roughness=0.2, transmission=0.15, emission=(0.2, 0.62, 1.0, 1), emission_strength=0.8)
    battery = material("Battery pouch", (0.055, 0.065, 0.075, 1), metallic=0.32, roughness=0.42)
    red = material("Positive lead", (0.48, 0.018, 0.015, 1), roughness=0.4)
    blue = material("Radio module", (0.025, 0.13, 0.35, 1), roughness=0.34)
    warm_ground = material("Warm studio ground", (0.52, 0.49, 0.44, 1), roughness=0.64)
    dark_ground = material("Graphite studio ground", (0.018, 0.022, 0.032, 1), roughness=0.58)

    for obj in parts:
        name = obj.name
        if name == "lower-enclosure" or name == "encoder-knob":
            assign(obj, silver)
        elif name in {"top-plate", "rf-window"}:
            assign(obj, frosted)
        elif name.startswith("keycap-") and name.endswith("-legend"):
            assign(obj, graphite)
        elif name.startswith("keycap-"):
            assign(obj, keycap_white)
        elif name in {"joystick-cap", "joystick-neck", "joystick-body"}:
            assign(obj, black)
        elif name == "touch-puck":
            assign(obj, touch)
        elif name == "main-pcb":
            assign(obj, pcb)
        elif name == "touch-electrode":
            assign(obj, copper)
        elif name == "tag-connect-pads":
            assign(obj, gold)
        elif name.startswith("rgb-led") or name == "touch-rgb-led":
            assign(obj, led)
        elif name == "battery":
            assign(obj, battery)
        elif name == "battery-positive-wire":
            assign(obj, red)
        elif name == "e73-module":
            assign(obj, blue)
        elif name in {"battery-connector", "boost-inductor"}:
            assign(obj, white_component)
        elif name.startswith("m2-fastener") or name.startswith("encoder-") or name == "usb-c-receptacle" or name == "stabilizer-wire":
            assign(obj, brushed_steel)
        else:
            assign(obj, black)

    original_locations = {obj.name: obj.location.copy() for obj in parts}
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = args.samples
    scene.render.resolution_x = args.resolution
    scene.render.resolution_y = args.resolution
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.use_file_extension = True
    scene.render.image_settings.color_depth = "8"
    scene.render.resolution_percentage = 100
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.image_settings.compression = 92
    scene.view_settings.look = "AgX - Medium High Contrast"

    stage(
        background=(0.72, 0.7, 0.67, 1),
        ground=warm_ground,
        target=(0.048, 0.048, 0.01),
        camera_location=(0.19, -0.17, 0.16),
        lens=58,
    )
    render(args.output_dir / "open-micro-hero-master.png")

    stage(
        background=(0.012, 0.016, 0.024, 1),
        ground=dark_ground,
        target=(0.048, 0.088, 0.085),
        camera_location=(0.19, -0.30, 0.19),
        lens=58,
    )
    enclosure_names = {"lower-enclosure", "rf-window"}
    cap_names = {"encoder-knob", "joystick-cap", "touch-puck"}
    hardware_names = {"touch-electrode", "touch-rgb-led"}
    hardware_prefixes = ("mx-switch", "encoder-", "joystick-", "stabilizer-")
    grouped_parts = {
        "enclosure": [],
        "core": [],
        "interface": [],
        "control hardware": [],
        "caps": [],
    }
    for obj in parts:
        name = obj.name
        if name in enclosure_names or name.startswith(("rubber-foot", "m2-fastener")):
            grouped_parts["enclosure"].append(obj)
        elif name == "top-plate":
            grouped_parts["interface"].append(obj)
        elif name in cap_names or name.startswith("keycap-"):
            grouped_parts["caps"].append(obj)
        elif name in hardware_names or name.startswith(hardware_prefixes):
            grouped_parts["control hardware"].append(obj)
        else:
            grouped_parts["core"].append(obj)
    layer_groups = list(grouped_parts.items())
    bpy.context.view_layer.update()
    layer_bounds = {}
    for layer_name, layer_parts in layer_groups:
        layer_z = [(obj.matrix_world @ Vector(corner)).z for obj in layer_parts for corner in obj.bound_box]
        layer_bounds[layer_name] = (min(layer_z), max(layer_z))

    previous_top = layer_bounds["enclosure"][1]
    layer_offsets = {"enclosure": (0.0, 0.0)}
    for layer_index, (layer_name, layer_parts) in enumerate(layer_groups[1:], start=1):
        layer_bottom, layer_top = layer_bounds[layer_name]
        vertical_offset = previous_top + 0.02 - layer_bottom
        rear_offset = layer_index * 0.02
        for obj in layer_parts:
            world_matrix = obj.matrix_world.copy()
            world_matrix.translation += Vector((0.0, rear_offset, vertical_offset))
            obj.matrix_world = world_matrix
        previous_top = layer_top + vertical_offset
        layer_offsets[layer_name] = (rear_offset, vertical_offset)

    print(
        "Exploded physical-layer offsets: "
        + ", ".join(
            f"{layer_name}=back {rear_offset * 100:.1f} cm/up {vertical_offset * 100:.1f} cm"
            for layer_name, (rear_offset, vertical_offset) in layer_offsets.items()
        )
        + "; vertical air gaps=2.0 cm"
    )
    render(args.output_dir / "open-micro-exploded-master.png")

    for obj in parts:
        obj.location = original_locations[obj.name].copy()
    stage(
        background=(0.018, 0.022, 0.032, 1),
        ground=dark_ground,
        target=(0.048, 0.058, 0.008),
        camera_location=(-0.14, 0.22, 0.11),
        lens=60,
    )
    render(args.output_dir / "open-micro-rear-master.png")

    stage(
        background=(0.72, 0.7, 0.67, 1),
        ground=warm_ground,
        target=(0.048, 0.048, 0.008),
        camera_location=(0.0481, 0.0482, 0.31),
        lens=60,
    )
    camera = bpy.context.scene.camera
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 0.13
    camera.rotation_euler = (0, 0, 0)
    render(args.output_dir / "open-micro-top-master.png")

    print(f"Rendered {len(parts)} exact CAD parts with 12 white keycaps to {args.output_dir}")


if __name__ == "__main__":
    main()
