import bpy
import json
import mathutils
import threading

from wsgiref.simple_server import make_server
from ws4py.websocket import WebSocket as _WebSocket
from ws4py.server.wsgirefserver import WSGIServer, WebSocketWSGIRequestHandler
from ws4py.server.wsgiutils import WebSocketWSGIApplication

from .scenegraph_interface import SceneGraphInterface

scenegraph = SceneGraphInterface()

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # print(type(obj))

        if isinstance(obj, bpy.types.BlendData):
            return {
                "objects": list(self.default(object) for object in obj.objects)
            }

        if isinstance(obj, bpy.types.Camera):
            return {
                "angle": obj.angle
            }

        if isinstance(obj, bpy.types.Mesh):
            return None

        if isinstance(obj, bpy.types.Object):
            rotation = obj.rotation_euler
            if obj.rotation_mode == 'AXIS_ANGLE':
                rotation = list(obj.rotation_axis_angle)
            elif obj.rotation_mode == 'QUATERNION':
                rotation = obj.rotation_quaternion
            r = {
                "location": self.default(obj.location),
                "rotation": self.default(rotation),
                "rotationMode": obj.rotation_mode,
                "scale": self.default(obj.scale),
                "type": obj.type
            }
            if obj.data:
                r["data"] = obj.data.name
            return r

        if isinstance(obj, bpy.types.Scene):
            return {
                "camera": obj.camera.name if obj.camera else None
            }

        if isinstance(obj, bpy.types.World):
            r = {
                "ambiantColor": self.default(obj.ambiant_color),
                "ambientOcclusionBlendType": obj.light_settings.ao_blend_type,
                "ambientOcclusionFactor": obj.light_settings.ao_factor,
                "colorRange": obj.color_range,
                "environmentColor": obj.light_settings.environment_color,
                "environmentEnergy": obj.light_settings.environment_energy,
                "exposure": obj.exposure,
                "falloffStrength": obj.light_settings.falloff_strength,
                "gatherMethod": obj.gather_method,
                "horizonColor": self.default(obj.horizon_color),
                "indirectBounces": obj.light_settings.environment_bounces,
                "indirectFactor": obj.light_settings.environment_factor,
                "useAmbientOcclusion": obj.light_settings.use_ambient_occlusion,
                "useEnvironmentLighting": obj.light_settings.use_environment_light,
                "useFalloff": obj.light_settings.use_falloff,
                "useIndirectLighting": obj.light_settings.use_indirect_light,
                "useMist": obj.mist_settings.use_mist,
                "useSkyBlend": obj.use_sky_blend,
                "useSkyPaper": obj.use_sky_paper,
                "useSkyReal": obj.use_sky_real,
                "zenithColor": self.default(obj.zenith_color),
            }
            if obj.gather_method == "RAYTRACE":
                r["samples"] = obj.light_settings.samples
                r["samplingMethod"] = obj.light_settings.sample_method
                r["distance"] = obj.light_settings.distance
            if obj.gather_method == "APPROXIMATE":
                r["correction"] = obj.light_settings.correction
                r["errorThreshold"] = obj.light_settings.error_threshold
                r["passes"] = obj.light_settings.passes
                r["useCache"] = obj.light_settings.use_cache
            if obj.mist_settings.use_mist:
                r["mist"] = 2
            return r

        if isinstance(obj, bpy.types.TimelineMarker):
            return {
                "frame": obj.frame,
                "name": obj.name
            }

        if isinstance(obj, mathutils.Color):
            return list(obj)

        if isinstance(obj, mathutils.Euler):
            return list(obj)

        if isinstance(obj, mathutils.Quaternion):
            return list(obj)

        if isinstance(obj, mathutils.Vector):
            return list(obj)

        return json.JSONEncoder.default(self, obj)


def stringify(data):
    return JSONEncoder(separators=(",", ":")).encode(data)


previous_context = {}
previous_data_keys = {}
previous_scenes = {}


def get_context(addon_prefs, diff):
    global previous_context

    current_context = {
        "filePath": bpy.data.filepath,
        "selectedObjects": hasattr(bpy.context, "selected_objects") and list(
            object.name for object in bpy.context.selected_objects)
    }

    if previous_context == current_context and diff:
        return

    previous_context = current_context
    return current_context


sockets = []

def broadcast(message):
    global sockets
    for socket in sockets:
        socket.send(message)


class WebSocketApp(_WebSocket):
    def opened(self):
        sockets.append(self)

    def closed(self, code, reason=None):
        sockets.remove(self)

    def received_message(self, message):
        data = json.loads(message.data.decode(message.encoding))
        for cmd in data:
            scenegraph.doCommand(cmd)


class ServerController:
    serverIsRunning = False
    wserver = None
    wserver_thread = None

    @staticmethod
    def start_server(host, port):
        print("Start Socks server at ", host, port)
        if ServerController.wserver:
            return False

        ServerController.wserver = make_server(host, port,
                              server_class=WSGIServer,
                              handler_class=WebSocketWSGIRequestHandler,
                              app=WebSocketWSGIApplication(handler_cls=WebSocketApp)
                              )
        ServerController.wserver.initialize_websockets_manager()

        ServerController.wserver_thread = threading.Thread(target=ServerController.wserver.serve_forever, daemon=True)
        ServerController.wserver_thread.start()

        ServerController.serverIsRunning = True
        return True

    @staticmethod
    def stop_server():
        if not ServerController.wserver:
            return False

        ServerController.wserver.server_close()
        ServerController.wserver.shutdown()

        for socket in sockets:
            socket.close()

        ServerController.wserver = None

        ServerController.wserver_thread.join()
        ServerController.serverIsRunning = False
        print("Stop Socks server")
        return True

    def send(data):
        broadcast(stringify(data))

    def stringify(self, data):
        return JSONEncoder(separators=(",", ":")).encode(data)

scenegraph.socketApp = ServerController