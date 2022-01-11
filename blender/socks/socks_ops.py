import bpy
from .socks_server import (ServerController, JSONEncoder, broadcast)

class Start_Server_Op(bpy.types.Operator):
    bl_idname = "view3d.start_socks_server"
    bl_label = "Start Socket Server"
    bl_description = "Starts socket server"

    def execute(self, context):
        ServerController.start_server(context.scene.hostInput, int(context.scene.portInput))
        return {'FINISHED'}

class Stop_Server_Op(bpy.types.Operator):
    bl_idname = "view3d.stop_socks_server"
    bl_label = "Stop Socket Server"
    bl_description = "Stops socket server"

    def execute(self, context):
        ServerController.stop_server()
        return {'FINISHED'}

class Send_SceneGraph_Op(bpy.types.Operator):
    bl_idname = "view3d.send_scene_graph"
    bl_label = "Send Scene Graph"
    bl_description = "Posts Blender scene graph to socket connections"

    def execute(self, context):
        for scene in bpy.data.scenes:
            data = self.get_scene(scene)
            if data:
                broadcast(self.stringify(("scene", scene.name, data)))

        return {'FINISHED'}

    def get_scene(self, scene):
        return {
            "camera": scene.camera and scene.camera.name,
            "fps": scene.render.fps / scene.render.fps_base,
            "frame": scene.frame_current,
            "frameEnd": scene.frame_end,
            "frameStart": scene.frame_start,
            "gravity": scene.gravity,
            "objects": list(object.name for object in scene.objects),
            "timelineMarkers": list(scene.timeline_markers),
            "world": scene.world and scene.world.name
        }

    def stringify(self, data):
        return JSONEncoder(separators=(",", ":")).encode(data)

