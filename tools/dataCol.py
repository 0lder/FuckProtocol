class DataCol:
    def __init__(self,name):
        self.name = name
        self.value = None
        self.type = None
        self.desc = ""
        self.obj = None
    def setParent(self,parentname):
        self.parent = parentname