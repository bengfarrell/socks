# WebSocket server for Blender
# Version 0.1.0
# Ben Farrell

# Heavily lifted from:
# Copyright 2015 Jonathan Giroux (Bloutiouf)
# Licensed under MIT (http://opensource.org/licenses/MIT)
# Originally found at https://github.com/KoltesDigital/websocket-server-for-blender

bl_info = {
    "name": "Socks",
    "author": "Ben Farrell",
    "description": "Web socket server and puppeteer for Blender",
    "blender": (2, 91, 0),
    "version": (0, 0, 1),
    "location": "View3D",
    "warning": "",
    "category": "Generic"
}

import sys
import os
import bpy

def ensure_site_packages(packages):
    """ `packages`: list of tuples (<import name>, <pip name>) """

    if not packages:
        return

    import site
    import importlib
    import importlib.util

    user_site_packages = site.getusersitepackages()
    os.makedirs(user_site_packages, exist_ok=True)
    sys.path.append(user_site_packages)

    modules_to_install = [module[1] for module in packages if not importlib.util.find_spec(module[0])]

    if modules_to_install:
        import subprocess

        if bpy.app.version < (2, 91, 0):
            python_binary = bpy.app.binary_path_python
        else:
            python_binary = sys.executable

        subprocess.run([python_binary, '-m', 'ensurepip'], check=True)
        subprocess.run([python_binary, '-m', 'pip', 'install', *modules_to_install, "--user"], check=True)

ensure_site_packages([
    ("ws4py", "ws4py"),
])


from .socks_panel import *
from .socks_ops import *
from .socks_server import ServerController
from .socks_prefs import SocksAddonPreferences

def register():
    bpy.utils.register_class(Socks_PT_Panel)
    bpy.utils.register_class(Start_Server_Op)
    bpy.utils.register_class(Stop_Server_Op)
    bpy.utils.register_class(Send_SceneGraph_Op)
    bpy.utils.register_class(SocksAddonPreferences)

    addon_prefs = bpy.context.preferences.addons[__name__].preferences

    default_host = "localhost"
    default_port = 8137
    if addon_prefs and 'default_host' in addon_prefs:
        default_host = str(addon_prefs.default_host)

    if addon_prefs and 'default_port' in addon_prefs:
        default_port = int(addon_prefs.default_port)


    bpy.types.Scene.hostInput = bpy.props.StringProperty(
        name = "URL",
        description = "Socket server URL",
        default = default_host
      )

    bpy.types.Scene.portInput = bpy.props.IntProperty(
        name = "Port",
        description = "Socket server port",
        default = default_port
      )

    if addon_prefs and 'auto_start' in addon_prefs and bool(addon_prefs.auto_start):
        ServerController.start_server(default_host, default_port)


def unregister():
    ServerController.stop_server()
    bpy.utils.unregister_class(Socks_PT_Panel)
    bpy.utils.unregister_class(Start_Server_Op)
    bpy.utils.unregister_class(Stop_Server_Op)
    bpy.utils.unregister_class(Send_SceneGraph_Op)
    bpy.utils.unregister_class(SocksAddonPreferences)

    del bpy.types.Scene.hostInput
    del bpy.types.Scene.portInput
