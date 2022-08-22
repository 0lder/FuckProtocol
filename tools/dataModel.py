class DataModel:
    def __init__(self,name):
        self.name = name
        self.cols = []
    def addCol(self,col):
        self.cols.append(col)