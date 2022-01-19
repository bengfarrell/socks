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

        elif cmd['command'] == 'delete':
            print("letter is Grapes")

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

    def update(self, cmd):
        try:
            targetNames = cmd['target']
            template = None
            if 'template' in cmd:
                template = cmd['template']

            targets = self.getTargets(targetNames, template)

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

    def getTargets(self, names, template):
        try:
            selectionIndx = []
            selection = [o for o in bpy.context.scene.objects if o.select_get()]
            for indx, name in enumerate(names):
                if name == '__$current_selection__':
                    selectionIndx.append(indx)
                    del names[indx]
                else:
                    if name in bpy.data.objects:
                        # object is found, add to list
                        names[indx] = bpy.data.objects[name]
                    elif template:
                        # object not found, clone via template
                        if template == '__$current_selection__':
                            src_obj = selection[0]
                        else:
                            src_obj = bpy.data.objects[template]
                        new_obj = src_obj.copy()
                        new_obj.name = name
                        new_obj.data = src_obj.data.copy()
                        new_obj.animation_data_clear()
                        bpy.context.collection.objects.link(new_obj)
                        names[indx] = new_obj
                        # Blender gets crashy when we clone to quickly
                        time.sleep(.1)

            for indx in selectionIndx:
                while len(selection) > 0:
                    names.insert(indx, selection.pop())

            return names
        except NameError as e:
            print(e)
            return []

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
        return [o.name for o in bpy.context.scene.objects if o.select_get()]

    def get_scene(self, scene):
        return {
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
