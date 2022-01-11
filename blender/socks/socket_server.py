# WebSocket server for Blender
# Version 0.1.0
# Ben Farrell

# Heavily lifted from:
# Copyright 2015 Jonathan Giroux (Bloutiouf)
# Licensed under MIT (http://opensource.org/licenses/MIT)
# Originally found at https://github.com/KoltesDigital/websocket-server-for-blender

import bpy
from bpy.app.handlers import persistent
from bpy.props import BoolProperty, EnumProperty, IntProperty, PointerProperty, StringProperty
from bpy.types import AddonPreferences, Operator, Panel, PropertyGroup, USERPREF_HT_header, WindowManager

import copy
import json
import mathutils
import queue
import threading

from wsgiref.simple_server import make_server
from ws4py.websocket import WebSocket as _WebSocket
from ws4py.server.wsgirefserver import WSGIServer, WebSocketWSGIRequestHandler
from ws4py.server.wsgiutils import WebSocketWSGIApplication

class WebSocketApp(_WebSocket):
    def opened(self):
        print('Socket open')
        sockets.append(self)

    def closed(self, code, reason=None):
        print('Socket close')
        sockets.remove(self)

    def received_message(self, message):
        print('Socket message')


wserver = None


def start_server(host, port):
    global wserver
    if wserver:
        return False

    wserver = make_server(host, port,
                          server_class=WSGIServer,
                          handler_class=WebSocketWSGIRequestHandler,
                          app=WebSocketWSGIApplication(handler_cls=WebSocketApp)
                          )
    wserver.initialize_websockets_manager()

    wserver_thread = threading.Thread(target=wserver.serve_forever)
    wserver_thread.daemon = True
    wserver_thread.start()

    bpy.app.handlers.load_post.append(load_post)
    bpy.app.handlers.scene_update_post.append(scene_update_post)

    return True


def stop_server():
    global wserver
    if not wserver:
        return False

    wserver.shutdown()
    for socket in sockets:
        socket.close()

    wserver = None

    bpy.app.handlers.load_post.remove(load_post)
    bpy.app.handlers.scene_update_post.remove(scene_update_post)

    return True
