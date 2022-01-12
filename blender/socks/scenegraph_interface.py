import bpy

class SceneGraphInterface:
    def doCommand(self, cmd):
        if cmd['command'] == 'update':
            self.update(cmd)

        elif cmd['command'] == 'delete':
            print("letter is Grapes")

        else:
            print('Command not found:', cmd['command'])

    def update(self, cmd):
        targetNames = cmd['target']
        targets = self.getTargets(targetNames)

        if targets == None:
            return

        for target in targets:
            if 'translateto' in cmd:
                self.transform(cmd['translateto'], target.location, False)
            elif 'translateby' in cmd:
                self.transform(cmd['translateby'], target.location, True)

            if 'scaleto' in cmd:
                self.transform(cmd['scaleto'], target.scale, False)
            elif 'scaleby' in cmd:
                self.transform(cmd['scaleby'], target.scale, True)

            if 'rotateto' in cmd:
                # TODO: Support other rotation modes
                target.rotation_mode = 'XYZ'
                self.transform(cmd['rotateto'], target.rotation_euler, False)
            elif 'rotateby' in cmd:
                # TODO: Support other rotation modes
                target.rotation_mode = 'XYZ'
                self.transform(cmd['rotateby'], target.rotation_euler, True)

    def getTargets(self, names):
        selectionIndx = []
        selection = [o for o in bpy.context.scene.objects if o.select_get()]
        for indx, name in enumerate(names):
            if name == '__$current_selection__':
                selectionIndx.append(indx)
                del names[indx]
            else:
                names[indx] = bpy.data.objects[name]

        for indx in selectionIndx:
            while len(selection) > 0:
                names.insert(indx, selection.pop())

        return names

    def transform(self, obj, target, additive):
        if 'x' in obj:
            if additive:
                target[0] += obj['x']
            else:
                target[0] = obj['x']

        if 'y' in obj:
            if additive:
                target[1] += obj['y']
            else:
                target[1] = obj['y']

        if 'z' in obj:
            if additive:
                target[2] += obj['z']
            else:
                target[2] = obj['z']

        if 'w' in obj:
            if additive:
                target[3] += obj['w']
            else:
                target[3] = obj['w']
