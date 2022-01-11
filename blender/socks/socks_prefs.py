import bpy
from bpy.types import Operator, AddonPreferences
from bpy.props import StringProperty, IntProperty, BoolProperty

class SocksAddonPreferences(AddonPreferences):
    bl_idname = __package__

    auto_start: BoolProperty(
        name="Auto start when Blender loads?",
        default=False,
    )

    default_host: StringProperty(
        name="Default Host",
        default="localhost"
    )

    default_port: IntProperty(
        name="Default Port",
        default=8137
    )

    def draw(self, context):
        layout = self.layout

        row = layout.row()
        row.prop(self, "default_host")

        row = layout.row()
        row.prop(self, "default_port")

        row = layout.row()
        row.prop(self, "auto_start")