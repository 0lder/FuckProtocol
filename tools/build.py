from statistics import mode
import xml.etree.ElementTree as ET
import sys
import dataModel
import dataCol
from ts import build as TS_BUILD
build_type = ""
dataModelMap  = {}


def parseModel(modelRoot):
    tablelist = modelRoot.getchildren()
    for a in tablelist:
        print(a.tag,a.attrib)
        modename = a.attrib["name"]
        model = dataModel.DataModel(modename)

        # 获取属性
        for attribute in a.getchildren():
            col = dataCol.DataCol(attribute.attrib["name"])
            col.type = attribute.attrib["type"]
            col.desc = attribute.attrib["desc"]
            col.value = attribute.attrib["value"]
            model.addCol(col)
            # 解析col
        dataModelMap[modename] = model
    TS_BUILD.run(dataModelMap)
def loadXML():
    tree = ET.parse("in/protocol.xml")
    root = tree.getroot()
    childrens = root.getchildren()
    for child in childrens:
        if child.tag == "enums":
            pass
        elif child.tag == "models":
            parseModel(child)
      
if __name__ == "__main__":
    loadXML()
