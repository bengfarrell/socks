import bpy

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
        if data:
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
                            if transform['transform'] == 'translate':
                                self.transform(transform, target.location)

                            if transform['transform'] == 'scale':
                                self.transform(transform, target.scale)

                            if transform['transform'] == 'rotate':
                                # TODO: Support other rotation modes
                                target.rotation_mode = 'XYZ'
                                self.transform(transform, target.rotation_euler)
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
