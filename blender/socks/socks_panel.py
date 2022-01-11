import bpy
from .socks_server import ServerController
from bpy.props import StringProperty, IntProperty

hostInput: StringProperty(name="Host")

portInput: IntProperty(name="Port")

class Socks_PT_Panel(bpy.types.Panel):
    bl_idname = "SX_PT_Panel"
    bl_label = "Socks"
    bl_category = "Socks"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"

    def draw(self, context):
        layout = self.layout
        col = layout.column(align=True)
        col.prop(context.scene, "hostInput")
        col.prop(context.scene, "portInput")

        startRow = layout.row()
        startRow.operator('view3d.start_socks_server', text="Start Socket Server")
        startRow.enabled = not ServerController.serverIsRunning

        stopRow = layout.row()
        stopRow.operator('view3d.stop_socks_server', text="Stop Socket Server")
        stopRow.enabled = ServerController.serverIsRunning

        layout.separator()
        sendSceneGraphRow = layout.row()
        sendSceneGraphRow.operator('view3d.send_scene_graph', text="Post Scene Graph")
        sendSceneGraphRow.enabled = ServerController.serverIsRunning