
# -*- coding: utf-8 -*
import os
import re

import zipfile
import shutil
import time
import hashlib
import subprocess
import cmd
import json

# 获取环境变量
def getEnviron(path):
    if path in os.environ:
        return os.environ[path]
    else:
        cmd.error("not found environ[{}]".format(path))


def zip_ya(startdir, file_news):
    # file_news = startdir +'.zip' # 压缩后文件夹的名字
    z = zipfile.ZipFile(file_news, 'w', zipfile.ZIP_DEFLATED)  # 参数一：文件夹名
    for dirpath, dirnames, filenames in os.walk(startdir):
        fpath = dirpath.replace(startdir, '')  # 这一句很重要，不replace的话，就从根目录开始复制
        fpath = fpath and fpath + os.sep or ''
        for filename in filenames:
            z.write(os.path.join(dirpath, filename), "res/" + fpath + filename)
    z.close()


def copyFile(sFilePah, dFilePath):
    if os.path.exists(sFilePah):
        sf = open(sFilePah, "rb")
        df = open(dFilePath, "wb")
        df.write(sf.read())
        sf.close()
        df.close()
        print("copy {}  to {}".format(sf, df))


def mkDir(dirPath):
    if os.path.exists(dirPath):
        return
    os.makedirs(dirPath)
    print("create dir:{}".format(dirPath))
    time.sleep(1)


def clearDir(dirPath):
    mkDir(dirPath)
    time.sleep(1)
    shutil.rmtree(dirPath)
    time.sleep(3)
    mkDir(dirPath)


# 获取文件md5值
def getFileMd5(filePath):
    if not os.path.isfile(filePath):
        return
    myhash = hashlib.md5()
    f = open(filePath, "rb")
    while True:
        b = f.read(8096)
        if not b:
            break
        myhash.update(b)
    f.close()
    return myhash.hexdigest()


# 获取文件大小
def getFileSize(filePath):
    return os.path.getsize(filePath)


# 获取文件夹下所有文件列表
def get_filelist(dir, Filelist,needEnter = True):
    newDir = dir
    if os.path.isfile(dir):
        Filelist.append(dir.replace("\\", "/"))
    elif os.path.isdir(dir) and needEnter:

        for s in os.listdir(dir):
            newDir = os.path.join(dir, s)
            get_filelist(newDir, Filelist)
    return Filelist


def get_zip_file(input_path, result):
    """
    对目录进行深度优先遍历
    :param input_path:
    :param result:
    :return:
    """
    files = os.listdir(input_path)
    for file in files:
        if os.path.isdir(input_path + '/' + file):
            get_zip_file(input_path + '/' + file, result)
        else:
            result.append(input_path + '/' + file)


def copyDir(dirPath, desPath):
    print("try copy dir {} to {}".format(dirPath, desPath))
    shutil.copytree(dirPath, desPath)


def rmDir(dirPath):
    if not os.path.exists(dirPath):
        return
    print("remove path:{}".format(dirPath))
    shutil.rmtree(dirPath)
    time.sleep(1)


# 获取文件后缀名
def getFileType(filePath):
    return filePath[filePath.rfind("."):]


# 获取文件名
def getFileName(filePath):
    filename = os.path.splitext(filePath)[0]
    arr = filename.split("/")
    return arr[len(arr) - 1]


# 写入文件
def writeFile(filePath, content):
    f = open(filePath, "w", encoding="utf-8")
    f.write(content)
    f.close()
    print("write file:{} success".format(filePath))

def getFilePathByFileType(dir,filetype):
    filelist = []
    get_filelist(dir,filelist)
    for filepath in filelist:
        if getFileType(filepath) == filetype:
            return filepath
def getFileListPathByFileType(dir,filetype):
    filelist = []
    findFilePath = []
    get_filelist(dir,filelist)
    for filepath in filelist:
        if getFileType(filepath) == filetype:
            findFilePath.append(filepath)
    return findFilePath   

#读取文件
def readFile(filepath):
    if os.path.isfile(filepath):
        f = open(filepath,"r",encoding="utf-8")
        text = f.read()
        f.close()
        return text

def getPatchingVersion(filepath,needIncrease = False):
    data = json.loads(readFile(filepath))

    if data.get("intVer") == None:
        data["intVer"] = 1
        writeFile(filepath,json.dumps(data))
    if needIncrease:
        data["intVer"] += 1
        writeFile(filepath,json.dumps(data))
        print("{} 补丁版本号增加了:{}".format(filepath,data["intVer"]))

    return data["intVer"]
