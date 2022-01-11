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
        if 'translate' in cmd:
            self.translate(cmd['target'], cmd['translate'])

        if 'scale' in cmd:
            self.translate(cmd['target'], cmd['scale'])

        if 'rotate' in cmd:
            self.translate(cmd['target'], cmd['rotate'])


    def translate(self, target, obj):
        if 'x' in obj:
            bpy.data.objects[target].location[0] += obj['x']

        if 'y' in obj:
            bpy.data.objects[target].location[1] += obj['y']

        if 'z' in obj:
            bpy.data.objects[target].location[2] += obj['z']

    def scale(self, obj):
        print('scale')

    def rotate(self, obj):
        print('rotate')