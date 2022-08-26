from statistics import mode
import xml.etree.ElementTree as ET
import sys
import dataModel
import dataCol
from ts import build as TS_BUILD
import const
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
            if attribute.attrib.get("value") != None:
                col.value = attribute.attrib["value"]
            if attribute.attrib.get("obj") != None:
                col.obj  = attribute.attrib["obj"]
            model.addCol(col)
            # 解析col
        const.dataModelMap[modename] = model
    TS_BUILD.run(const.dataModelMap)

def buildProtocol():
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
    print(const.dataModelMap)
    buildProtocol()
      
if __name__ == "__main__":
    loadXML()
