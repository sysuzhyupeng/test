# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.webdriver.common.action_chains import ActionChains
import random
import unittest, time
import os


class Rent(unittest.TestCase):
    def setUp(self):

        self.driver = webdriver.Chrome()
        #設置隱式等待30秒
        self.driver.implicitly_wait(30)
        self.driver.get("https://www.591.com.hk/home/user/login")
        
    def test_rent_search(self):
        u"""刊登物件"""
        driver = self.driver
        

        driver.maximize_window()
        driver.find_element_by_xpath(".//*[@id='userNameIput']").clear()
        driver.find_element_by_xpath(".//*[@id='userNameIput']").send_keys("0921223333")
        driver.find_element_by_xpath(".//*[@id='userRepwd']").clear()
        driver.find_element_by_xpath(".//*[@id='userRepwd']").send_keys("123456")
        driver.find_element_by_xpath(".//*[@id='btnSubmit']").click()
    
        time.sleep(2)
        nowhandle=driver.current_window_handle
        driver.find_element_by_xpath("html/body/div[6]/div[1]/div[1]/p[3]/a[1]").click()#刊登出租廣告
        aalhandles=driver.window_handles#获取所有窗口句柄
        for handle in aalhandles:#在所有窗口中查找弹出窗口
           if handle!=nowhandle:
             driver.switch_to_window(handle)
        driver.find_element_by_xpath(".//*[@id='he_name']").send_keys(u"好景樓")
        time.sleep(0.3)
        a=random.randrange(20,50)
        b=random.randrange(50,70)
        c=random.randrange(1,5)
        d=random.randrange(3000,10000)
        e=random.randrange(1,2)
        driver.find_element_by_xpath(".//*[@id='use_area']").send_keys(a)#实用面积
        driver.find_element_by_xpath(".//*[@id='build_area']").send_keys(b)#建筑面积#
        driver.find_element_by_xpath(".//*[@id='floor']").send_keys(c)#出租楼层
        driver.find_element_by_xpath(".//*[@id='allfloor']").send_keys(c)#总楼层
        driver.find_element_by_xpath(".//*[@id='room']").send_keys(c)#间隔房
        driver.find_element_by_xpath(".//*[@id='hall']").send_keys(e)#间隔庭
        driver.find_element_by_xpath(".//*[@id='tr_price']/td/table/tbody/tr[1]/td[1]/input").send_keys(d)#租金
        driver.find_element_by_xpath(".//*[@id='formSubmit']").click()#下一步
        driver.find_element_by_xpath(".//*[@id='title']").send_keys(u"優質好物件，謝謝！~")
        driver.find_element_by_xpath(".//*[@id='formSubmit']").click()
        time.sleep(2)
    def tearDown(self):
        self.driver.quit()
        



if __name__ == "__main__":
    unittest.main()