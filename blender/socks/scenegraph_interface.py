import bpy
import time
from mathutils import Vector

class SceneGraphInterface:
    socketApp = None

    def doCommand(self, cmd):
        if cmd['command'] == 'update':
            self.update(cmd)

        elif cmd['command'] == 'sceneinfo':
            self.sendScene()

        elif cmd['command'] == 'selectioninfo':
            self.sendSelection()

        elif cmd['command'] == 'armatureinfo':
            if 'name' in cmd:
                self.sendArmature(cmd['name'])

        elif cmd['command'] == 'delete':
            print("TODO: Delete")

        else:
            print('Command not found:', cmd['command'])

    def sendScene(self):
        for scene in bpy.data.scenes:
            data = self.get_scene(scene)
            if data:
                self.socketApp.send(data)

    def sendSelection(self):
        data = self.get_selection()
        self.socketApp.send(data)

    def sendArmature(self, name):
        if name in bpy.data.objects:
            data = self.get_armature(name)
            self.socketApp.send(data)

    def update(self, cmd):
        try:
            unresolved_targets = cmd['target']

            cloneopts = None
            if 'clone' in cmd:
                cloneopts = cmd['clone']

            targets = self.getTargets(unresolved_targets, cloneopts)

            if targets == None:
                return

            for target in targets:
                if 'transforms' in cmd:
                    for transform in cmd['transforms']:
                        if 'transform' in transform:
                            if transform['transform'] == 'origin':
                                oldLoc = target.location
                                newLoc = self.transform(transform, Vector([target.location[0], target.location[1], target.location[2]]))
                                for vert in target.data.vertices:
                                    vert.co[0] -= newLoc[0] - oldLoc[0]
                                    vert.co[1] -= newLoc[1] - oldLoc[1]
                                    vert.co[2] -= newLoc[2] - oldLoc[2]
                                obj.location = newLoc
                                # The below is probably what we should do, but I can't get it working
                                # saved_location = bpy.context.scene.cursor.location
                                # bpy.context.scene.cursor.location = Vector((5.0, 0.0, 0.0))
                                # bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
                                # bpy.context.scene.cursor.location = saved_location

                            if transform['transform'] == 'translate':
                                self.transform(transform, target.location)
                                if 'keyframe' in cmd:
                                    target.keyframe_insert(data_path="location", frame=cmd['keyframe'])

                            if transform['transform'] == 'scale':
                                self.transform(transform, target.scale)
                                if 'keyframe' in cmd:
                                    target.keyframe_insert(data_path="scale", frame=cmd['keyframe'])

                            if transform['transform'] == 'rotate':
                                # TODO: Support other rotation modes
                                target.rotation_mode = 'XYZ'
                                self.transform(transform, target.rotation_euler)
                                if 'keyframe' in cmd:
                                    target.keyframe_insert(data_path="rotation_euler", frame=cmd['keyframe'])

        except NameError as e:
            print('Name Error for', e)
        except KeyError as e:
            print('Key Error for', e)

    def getTargets(self, unresolved, cloneopts):
        try:
            clonesleep = -1
            linked = False
            template = None
            if cloneopts:
                if 'sleep' in cloneopts:
                    clonesleep = cloneopts['sleep']

                if 'template' in cloneopts:
                    template = cloneopts['template']

                if 'linked' in cloneopts:
                    linked = cloneopts['linked']

            selectionIndx = []
            selection = [o for o in bpy.context.scene.objects if o.select_get()]
            for indx, name in enumerate(unresolved):
                if name == '__$current_selection__':
                    selectionIndx.append(indx)
                    del unresolved[indx]
                else:
                    if type(name) == str and name in bpy.data.objects:
                        # object is found, add to list
                        unresolved[indx] = bpy.data.objects[name]
                    elif type(name) != str:
                        # target is an object
                        unresolved[indx] = self.resolve_complex_target(name)
                    elif template:
                        # object not found, clone via template
                        if template == '__$current_selection__':
                            src_obj = selection[0]
                        else:
                            src_obj = bpy.data.objects[template]

                        unresolved[indx] = self.duplicate(src_obj, linked)
                        if clonesleep != -1:
                            time.sleep(clonesleep)

            for indx in selectionIndx:
                while len(selection) > 0:
                    unresolved.insert(indx, selection.pop())

            return unresolved
        except NameError as e:
            print(e)
            return []

    def resolve_complex_target(self, target):
        if 'armature' in target and bpy.data.objects[target['armature']]:
            armature = bpy.data.objects[target['armature']]
            if 'posebone' in target:
                return armature.pose.bones[target['posebone']]
            return None
        return None

    def duplicate(self, obj, linked):
        obj_copy = obj.copy()
        if not linked:
            obj_copy.data = obj_copy.data.copy()
        if not linked and obj_copy.animation_data:
            obj_copy.animation_data.action = obj_copy.animation_data.action.copy()
        bpy.context.collection.objects.link(obj_copy)
        return obj_copy

    def transform(self, obj, target):
        try:
            acceptedProps = ['x', 'y', 'z', 'w']
            for prop in obj:
                if prop in acceptedProps:
                    indx = acceptedProps.index(prop)
                    if 'relative' in obj and obj['relative'] == True:
                        target[indx] += obj[prop]
                    else:
                        target[indx] = obj[prop]
            return target

        except NameError as e:
            print(e)


    def get_selection(self):
        return {
            "messagetype": "selectioninfo",
            "message": [o.name for o in bpy.context.scene.objects if o.select_get()]
        }

    def get_armature(self, name):
        arm = bpy.data.objects[name]
        bones = []
        for indx, bone in enumerate(arm.pose.bones):
            bones.append(bone.name)
        return {
            "messagetype": "armatureinfo",
            "message": {
                "bones": bones,
                "armature": name
            }
        }

    def get_scene(self, scene):
        return {
            "messagetype": "sceneinfo",
            "message": {
                "scene": scene.name,
                "camera": scene.camera and scene.camera.name,
                "fps": scene.render.fps / scene.render.fps_base,
                "frame": scene.frame_current,
                "frameEnd": scene.frame_end,
                "frameStart": scene.frame_start,
                "gravity": scene.gravity,
                "objects": list(object.name for object in scene.objects),
                "timelineMarkers": list(scene.timeline_markers),
                "world": scene.world and scene.world.name,
                "selected": self.get_selection()
            }
        }
